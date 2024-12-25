const express = require("express")
const router = express.Router()
const Category = require("./Category")
const slugify = require("slugify");
const { Where } = require("sequelize/lib/utils");


//Lista todas as Categorias  / Pagina inicial Categorias
router.get("/admin/categories",(req, res) => {
    Category.findAll().
    then(categories => {
        res.render("admin/categories/index", {categories: categories});
    });
});

/* 
//Inserir novo Registro de Categorias
router.get("/admin/categories/new",(req,res) => {
    res.render("admin/categories/new")
})

router.get("/admin/categories/edit/:id",(req,res) => {
    var id = req.params.id

    Category.findByPk(id, {Where: {id: id}}).then(() => {
        res.render("admin/categories/edit",{categorie :categorie})
    })

}) */


//Retorna Valor de uma categoria específica para edição.
router.get("/admin/categories/edit/:id",(req,res) => {
    var id = req.params.id

    if(isNaN(id)){
        res.redirect("/admin/categories")
    }
       
    Category.findByPk(id).then(categorie => {
            
            if(categorie != undefined){
                res.render("admin/categories/edit",{categorie :categorie})
            } else{
                res.redirect("/admin/categories/")
            }
        }).catch(erro =>{
            res.redirect("admin/categories")
        })
})

// Inserir nova Categoria
router.post("/categories/save",(req,res) => {
    var title = req.body.title
 
    if(title != undefined){
        
        Category.create({
            title: title,
            slug:  slugify(title)
        }).then(() =>{
            res.redirect("/admin/categories/")
        })

    }else{
        res.render("admin/categories/new") 
    }
})

//Atualizar Nova Categoria
router.post("/categories/update",(req,res) => {
    var id = req.body.id
    var title = req.body.title
    var slug = slugify(title)

    Category.update({title: title, slug : slug},
    {
        where: {id: id}
    })
    .then(() => {
        res.redirect("/admin/categories/")
    })
})



//Apagar nova Categoria
router.post("/categories/delete", (req, res) => {
    var id = req.body.id;
    if(id != undefined){
        if(!isNaN(id)){
            Category.destroy({
                where: {
                    id: id
                }
            }).then(() => {
                res.redirect("/admin/categories");
            });
        }else{// NÃO FOR UM NÚMERO
            res.redirect("/admin/categories");
        }
    }else{ // NULL
        res.redirect("/admin/categories");
    }
});


module.exports = router