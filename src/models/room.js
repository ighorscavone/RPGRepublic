const mongoose = require('../database')
//const bcrypt = require('bcryptjs')

const schemaRoom = new mongoose.Schema({

    nome: {
        type: String,
        required: true, 


    },
  
})

/* usuarioSchema.pre('save', async function(next) {
    const hash = await bcrypt.hash(this.senha, 10)
    this.senha = hash

    next()
})
 */
const Room = mongoose.model('Room', schemaRoom)

module.exports = Room