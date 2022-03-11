const express = require('express')

const Usuario = require('../models/Usuario')

const router = express.Router()

router.post('/cadastro', async (req, res) => {
    try {
        const usuario = await Usuario.create(req.body)

        return res.send({ usuario })
    } catch(err) {
        return res.status(400).send({ error: err })
    }
})

module.exports = app => app.use('/auth', router)