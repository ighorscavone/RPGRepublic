const express = require('express');



const routes = express.Router();

routes.get('/', (req, res)=>{
    res.render('home', { title: 'About Page', layout: './layouts/layoutHome' })
})

module.exports = routes;