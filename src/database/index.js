const Sequelize = require('sequelize');
const dbConfig = require('../config/database');

//const User = require('../models/User');

const connection = new Sequelize(dbConfig);

async function test(){
    try{
        await Sequelize.authenticate()
        console.log('sucesso!!')
    }
    catch(error){
        console.log('falhou!!')

    }
}


test()
module.exports = connection;