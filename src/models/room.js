const mongoose = require('../database')
const bcrypt = require('bcryptjs')

const schemaRoom = new mongoose.Schema({

    nome: {
        type: String,
        required: true, 


    },
  
})



const Room = mongoose.model('Room', schemaRoom)

module.exports = Room