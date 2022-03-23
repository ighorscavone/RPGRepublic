const express = require('express');
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
})