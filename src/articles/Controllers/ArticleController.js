const express = require('express');
const router = express.Router();
const slugify = require('slugify');

const Category = require('../../categories/model/Category');
const Article = require('../model/Article');

router.get('/admin/articles', (req, res) => {
    Article.findAll(
        {
            raw: false,
            include: [
                {
                    model: Category, 
                }
            ]
        }
    ).then((articles) => {
        console.log(articles);
        res.render('admin/articles/index',
            {
                articles: articles
            }
        );
    });
});

router.get('/admin/articles/new', (req, res) => {
    Category.findAll(
        {
            raw: true
        }
    ).then((categories) => {

        res.render('admin/articles/new',
            {
                categories: categories
            }
        );
    });
});

router.post('/articles/save', (req, res) => {
    let { category } = req.body;
    let { title } = req.body;
    let { body } = req.body;

    Article.create(
        {
            title: title,
            slug: slugify(title),
            body: body,
            categoryId: category
        }
    ).then(() => {
        console.log('Artigo salvo com sucesso.');
        res.redirect('/admin/articles');
    });
});

module.exports = router;