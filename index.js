const express = require('express');
const app = express();

const connection = require('./src/database/database');

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.set('view engine', 'ejs');
app.set('views', __dirname + '/src/views');

connection.authenticate()
    .then(() => {
        console.log('Autenticado com sucesso!');
    }).catch((error) => {
        console.log(error);
    });

app.use(express.static('public'));

app.get('/', (req, res) => {
    res.render('index');
});

app.listen(8080, () => {
    console.log('App rodando');
})