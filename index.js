const express = require("express")
const app = express()

const bodyParser = require("body-parser")
const connection = require("./database/database")
const categoriesController = require("./categories/categoriesController")
const articlesController = require("./articles/articlesController")
const userController = require("./users/userController")



//Controladores de Artigos e Categorias
const Article = require("./articles/article")
const Category = require("./categories/Category")
const User =require("./users/User")

//para aceitar arquivos estaticos
app.use(express.static('public'))

//body parser
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

//Rotas para Controllers Categoria e Artigos
app.use("/",categoriesController)
app.use("/",articlesController)
app.use("/", userController)
//app.use("/",usersController)




//Rota inicial
app.get("/",(req,res) =>{

    Article.findAll({
        order: [
                ['id','Desc']
                ],
                limit: 4
    }).then(articles => {
        Category.findAll().then(categories=>{
        res.render("index",{articles : articles, categories:categories})
    }
)
        //renderizando
    })
    
})

app.get("/:slug",(req, res) => {
    var slug = req.params.slug
    var novo = req.params.novo

    Article.findOne({
        where: {
            slug: slug
        }
    }).then(article => {
        if(article != undefined){
            Category.findAll().then(categories => {
                res.render("article", {article: article, categories: categories});
            });
        }else{
            res.redirect("/");
        }
    }).catch( err => {
        res.redirect("/");
    });
})

//Atribui qual é a view engine será usada, ou seja, como será feita
// a redenrização do HTML - No caso o EJS os arquivos de HTML ficarão
// na pasta views
app.set('view engine','ejs')


app.get("/category/:slug",(req, res) => {
    var slug = req.params.slug
    Category.findOne({
        where: {
            slug: slug
        },
        include: [{model: Article}]
    }).then( category => {
        if(category != undefined){
            Category.findAll().then(categories => {
                res.render("index",{articles: category.articles,categories: categories});
            });
        }else{
            res.redirect("/");
        }
    }).catch( err => {
        res.redirect("/");
    })
})


//Database connection
connection
    .authenticate()
    .then(() => {
            console.log("conexão feita com sucesso")
    })
    .catch((error) => {
        console.log(error)
    })



// Conexão
app.listen(8080,( ) =>{
    console.log("O servidor está rodando")
})





