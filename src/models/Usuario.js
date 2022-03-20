const mongoose = require('../database')
//const bcrypt = require('bcryptjs')

const schemaUsuario = new mongoose.Schema({ 
   
    Login: {
        type: String,
        required: true, 
    },    

    Senha: {
        type: String,
        required: true,
        select: false,  
    },

    Nivel: {
        type: Number,
        default: 1,
        
    },

    eMail: {
        type: String,
        required: true, 
        unique: true,
        lowercase: true,
    },

    Moeda: {
        type: Number,
    },

    Acesso: {
        type: Number,        
    },

    createdAt : {
        type: Date,
        default: Date.now,
    }    
})

schemaUsuario.pre('save', async function(next) {
    const hash = await bcrypt.hash(this.senha, 10)
    this.senha = hash

    next()
})

const Usuario = mongoose.model('Usuario', schemaUsuario)

module.exports = Usuario