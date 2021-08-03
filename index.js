const express = require('express');
const app = express();

const connection = require('./src/database/database');
const categoryController = require('./src/categories/Controllers/CategoryController');
const articleController = require('./src/articles/Controllers/ArticleController');
const Category = require('./src/categories/model/Category');
const Article = require('./src/articles/model/Article');

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

app.use('/', categoryController);
app.use('/', articleController);

app.get('/', (req, res) => {
    Article.findAll(
        {
            raw: true
        }
    ).then((articles) => {
        res.render('index',
            {
                articles: articles
            }
        );
    });
});

app.listen(8080, () => {
    console.log('App rodando');
});