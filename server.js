/* const express = require('express');
const routes = require('./routes');
const bodyParser = require('body-parser')
//require('./database');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended : false}))
app.use(routes);

require('./controllers/autenticacaoController')(app)


app.listen(3333, ()=>{
    console.log('Server no ar')
}) */


const express = require ('express');
const expressLayouts = require('express-ejs-layouts')
const app = express();
const path = require('path');
const router = express.Router();

app.use(expressLayouts)
//app.set('layout', './layouts/layoutHome.ejs')
app.set('view engine', 'ejs')

router.get('/', function(req,res){

    res.render(path.join(__dirname + '/views/home.ejs'), { title: 'Home', layout: './layouts/layoutHome.ejs' })

})

router.get('/login', function(req,res){

    res.render(path.join(__dirname + '/views/login.ejs'), { title: 'Login', layout: './layouts/layoutHome.ejs' })

})


router.get('/sobre', function(req,res){

    res.render(path.join(__dirname + '/views/sobre.ejs'), { title: 'Sobre', layout: './layouts/layoutHome.ejs' })

})

router.get('/registrar', function(req,res){

    res.render(path.join(__dirname + '/views/registrar.ejs'), { title: 'Registrar', layout: './layouts/layoutHome.ejs' })

})

router.get('/game', function(req,res){

    res.render(path.join(__dirname + '/dice/dice/game.ejs'), { title: 'Game', layout: './layouts/layoutHome.ejs' })

})

app.use(express.static( __dirname + '/dice/'));
app.use(express.static( __dirname + '/dice/dice/'));
app.use(express.static( __dirname + '/views/'));


const server = require('http').createServer(app);
const io = require ('socket.io')(server);

io.on('connection', socket => {
    console.log('Novo Usuario Conectado: ${socket.id}');
});

app.use('/', router);
app.listen(process.env.port || 3333);

console.log("Server rodando, listening at dor :3333 ")