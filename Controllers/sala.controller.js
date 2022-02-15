var express = require('express');
var router = express.Router();
var request = require('request');
var config = require('config.json');

router.get('/', function (req, res) {
    res.render('ficha');
});

router.post('/', function (req, res) {
   
    request.post({
        url: config.apiUrl + '/home/sala',
        form: req.body,
        json: true
    }, function (error, response, body) {
        if (error) {
            return res.render('sala', { error: 'Erro interno' });
        }

        if (response.statusCode !== 200) {
            return res.render('register', {
                error: response.body,
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                username: req.body.username
            });
        }

        
        req.session.success = 'Ficha atualizada com sucesso';
        return res.redirect('/login');
    });
});

module.exports = router;