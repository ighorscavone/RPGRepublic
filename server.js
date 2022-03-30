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
const schemaUsuario = require('./src/models/Usuario')
app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

app.use(expressLayouts)
//app.set('layout', './layouts/layoutHome.ejs')
app.set('view engine', 'ejs')

router.get('/', function(req,res){

    res.render(path.join(__dirname + '/views/home.ejs'), { title: 'Home', layout: './layoutHome.ejs' })

})

router.get('/login', function(req,res){

    res.render(path.join(__dirname + '/views/login.ejs'), { title: 'Login', layout: './layoutHome.ejs' })

})


router.get('/sobre', function(req,res){

    res.render(path.join(__dirname + '/views/sobre.ejs'), { title: 'Sobre', layout: './layoutHome.ejs' })

})

router.get('/registrar', function(req,res){

    res.render(path.join(__dirname + '/views/registrar.ejs'), { title: 'Registrar', layout: './layoutHome.ejs' })

})

router.get('/game', function(req,res){

    res.render(path.join(__dirname + '/dice/dice/game.ejs'), { title: 'Game', layout: './layoutHome.ejs' })

})

router.get('/sala', function(req,res){

    res.render(path.join(__dirname + '/views/sala.ejs'), { title: 'Game', layout: './layoutHome.ejs' })

})

app.post('/salvarUsuario', (req, res) => {

    //DESTRUCT, EXTRAIR PROPRIEDADE DE UM OBJETO PARA VARIÁVEIS
    const { dto } = req.body;

    if(!dto) res.send("Dados insuficientes!");

    //CASO O NOME DA PROPRIEDADE DE CONSULTA SEJA IGUAL AO NOME DE UMA VARÍAVEL
    //NÃO É NECESSÁRIO REPETI-LA: EX: email: email
    schemaUsuario.find({email}, (erro, usuario) => {

        if(erro) res.send("Erro ao consultar usuário");

        if(usuario) res.send("Usuário já existe");        

        schemaUsuario.create({email, senha, usuario}, (erro, usuario) => {

            if(erro) res.send("Erro ao criar novo usuário");
                      
            res.send({
                usuario,
                token: criaTokenUsuario(usuario.id)
            });
            
        })
    })
    
    res.send("Método post USUARIOS funcionando corretamente");

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

console.log("Server rodando, listening at http://localhost:3333")