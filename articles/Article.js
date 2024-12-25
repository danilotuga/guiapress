const Sequelize = require("sequelize")
const connection = require("../database/database")
const Category = require("../categories/Category")



const Article = connection.define('articles',{
    title:{
        type: Sequelize.STRING,
        allowNull: false
    },slug: {
        type: Sequelize.STRING,
        allowNull: false
    },
    body: {
        type: Sequelize.TEXT,
        allowNull: false
    }
})
 
//Category.hasMany(Article) // Uma categoria tem muitos artigos
//expressar relacionamento entre controllers
//Article.belongsTo(Category) //1 artigo pertence a 1 categoria
Category.hasMany(Article);
Article.belongsTo(Category);


try {
//   Article.sync({force: false});
} catch (error) {
    console.error("Erro ao sincronizar o modelo Article:", error);
} 

module.exports = Article

//module.exports = {Category, Article}