const express = require ('express');
const app = express();
const path = require('path');
const router = express.Router();

router.get('/', function(req,res){

    res.sendFile(path.join(__dirname + '/Views/home.html'))

})

router.get('/login.html', function(req,res){

    res.sendFile(path.join(__dirname + '/Views/login.html'))

})


router.get('/sobre.html', function(req,res){

    res.sendFile(path.join(__dirname + '/Views/sobre.html'))

})

router.get('/registrar.html', function(req,res){

    res.sendFile(path.join(__dirname + '/Views/registrar.html'))

})

app.use(express.static( __dirname + '/Views/'));


const server = require('http').createServer(app);
const io = require ('socket.io')(server);

io.on('connection', socket => {
    console.log('Novo Usuario Conectado: ${socket.id}');
});

app.use('/', router);
app.listen(process.env.port || 3000);

console.log("Server rodando, listening at dor :3000 ")