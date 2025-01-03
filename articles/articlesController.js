const express = require("express")
const router = express.Router()
const Category = require("../categories/Category")
const Article = require("./article")
const slugify = require("slugify")


router.get("/admin/articles",(req, res) => {
    Article.findAll({
        order: [
                ['id','Desc']
                ],

        include: [{model: Category}]
    }).
    then(articles => {
        res.render("admin/articles/index", {articles: articles});
    });
});
router.get("/admin/articles/edit/:id", (req, res) => {
    var id = req.params.id;
    Article.findByPk(id).then(article => {
        if(article != undefined){
            Category.findAll().then(categories => {
                res.render("admin/articles/edit", {categories: categories, article: article})

            });
        }else{
            res.redirect("/");
        }
    }).catch(err => {
        res.redirect("/");
    });
});





router.get("/articles/new",(req,res) => {
    Category.findAll().then(categories => {
        res.render("admin/articles/new",{categories : categories})    
    })
})

router.post("/articles/save",(req, res) => {
    var title = req.body.title;
    var body = req.body.body;
    var category = req.body.category


    Article.create({
            title: title,
            slug: slugify(title),
            body:body,
            categoryId:category
        }).then(() => {
            res.redirect("/admin/articles")
        })
    });



//Apagar  Categoria
router.post("/articles/delete", (req, res) => {
    var id = req.body.id;
    if(id != undefined){
        if(!isNaN(id)){
            Article.destroy({
                where: {
                    id: id
                }
            }).then(() => {
                res.redirect("/admin/articles");
            });
        }else{// NÃO FOR UM NÚMERO
            res.redirect("/admin/articles");
        }
    }else{ // NULL
        res.redirect("/admin/articles");
    }
});

router.post("/articles/update", (req, res) => {
    var id = req.body.id;
    var title = req.body.title;
    var body = req.body.body;
    var category = req.body.category

    Article.update({title: title, body: body, categoryId: category, slug:slugify(title)},{
        where: {
            id: id
        }
    }).then(() => {
        res.redirect("/admin/articles");
    }).catch(err => {
        res.redirect("/");
    });
});

   
       
        router.get("/articles/page/:num",(req, res) => {
            var page = req.params.num;
            var offset = 0
        
            if(isNaN(page) || page == 1){
                offset = 0;
            }else{
                offset = (parseInt(page) - 1) * 4;
            }
        
             Article.findAndCountAll({
                limit: 4,
                offset: offset,
            }).then(articles => { 
                 
                 var next
                if(offset + 4 >= articles.count){
                    next = false;
                }else{
                    next = true;
                }
                
                var result = {
                    page: parseInt(page),
                    next: next,
                    articles : articles
                } 

                Category.findAll().then(articles => {
                    Category.findAll().then(categories=>{
                    res.render("./admin/articles/page",{result: result, articles : articles, categories:categories})
                }
            )
                    //renderizando
                })

            
        
/*                Category.findAll().then(categories => {
                    res.render("/admin/articles/page")
                    //res.render("/admin/articles/page",{result: result, categories: categories})
                }); */
            })
        
        

        });
        
    



module.exports = router