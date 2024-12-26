const Sequelize = require("sequelize");
const connection = require("../database/database");

const User = connection.define('users',{
    email:{
        type: Sequelize.STRING,
        allowNull: false
    },password: {
        type: Sequelize.STRING,
        allowNull: false
    }
})


try {
  //  User.sync({force : true })
} catch (error) {
    console.error("Erro ao sincronizar o modelo Users:", error);
}

module.exports = User