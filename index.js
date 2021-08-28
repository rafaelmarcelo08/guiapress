const express = require('express');
const app = express();

const connection = require('./src/database/database');
const categoryController = require('./src/categories/Controllers/CategoryController');
const articleController = require('./src/articles/Controllers/ArticleController');
const Category = require('./src/categories/model/Category');
const Article = require('./src/articles/model/Article');

app.use(express.urlencoded({
    extended: false
}));
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
    Article.findAll({
        raw: true,
        order: [
            ['createdAt', 'DESC']
        ],
        limit: 4
    }).then((articles) => {
        Category.findAll({
            raw: true
        }).then((categories) => {
            res.render('index', {
                articles: articles,
                categories: categories
            });
        });
    });
});

app.get('/:slug', (req, res) => {
    let {
        slug
    } = req.params;

    Article.findOne({
        raw: true,
        where: {
            slug: slug
        }
    }).then((article) => {
        if (article != undefined) {
            Category.findAll({
                raw: true
            }).then((categories) => {
                res.render('article', {
                    article: article,
                    categories: categories
                });
            }).catch((error) => {
                console.log(error);
                res.redirect('/');
            });
        } else {
            res.redirect('/');
        }
    }).catch((error) => {
        console.log(error);
        res.redirect('/');
    });
});

app.get('/category/:slug', (req, res) => {
    let {
        slug
    } = req.params;

    Category.findOne({
        where: {
            slug: slug
        },
        include: [{
            model: Article
        }]
    }).then((category) => {
        if (category != undefined) {
            Category.findAll({
                raw: true
            }).then((categories) => {
                res.render('index', {
                    articles: category.articles,
                    categories: categories
                });
            });
        } else {
            res.redirect('/');
        }
    }).catch((error) => {
        console.log(error);
        res.redirect('/');
    });
});

app.listen(8080, () => {
    console.log('App rodando');
});