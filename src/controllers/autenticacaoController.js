const express = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const Usuario = require('../models/Usuario')
const autenticacaoConfig = require('../config/autenticacao.json')

const router = express.Router()

router.post('/cadastro', async (req, res) => {
    try {
        const usuario = await Usuario.create(req.body)

        return res.send({ usuario })
    } catch(err) {
        return res.status(400).send({ error: err })
    }
})

router.post('/autenticar', async (req, res) =>{
    const { eMail, Senha } = req.body

    const usuario = await Usuario.findOne({ eMail }).select('+Senha')   
    if(!usuario){
        res.status(400).send({ error: 'Usuário não encontrado' })
    }

    if(!await bcrypt.compare(Senha, usuario.Senha)){
        res.status(400).send({ error: 'Usuário ou senha inválidos! ' })
    }

    usuario.Senha = undefined

    const token = jwt.sign({ id: usuario.id }, autenticacaoConfig.secret, {expiresIn: 86400})

    res.send({ usuario, token })

})

module.exports = app => app.use('/auth', router)