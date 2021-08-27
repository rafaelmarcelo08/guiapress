const express = require('express');
const router = express.Router();
const slugify = require('slugify');

const Category = require('../../categories/model/Category');
const Article = require('../model/Article');

router.get('/admin/articles', (req, res) => {
    Article.findAll({
        raw: false,
        include: [{
            model: Category,
        }]
    }).then((articles) => {
        res.render('admin/articles/index', {
            articles: articles
        });
    });
});

router.get('/admin/articles/new', (req, res) => {
    Category.findAll({
        raw: true
    }).then((categories) => {

        res.render('admin/articles/new', {
            categories: categories
        });
    });
});

router.post('/articles/save', (req, res) => {
    let {
        category
    } = req.body;
    let {
        title
    } = req.body;
    let {
        body
    } = req.body;

    Article.create({
        title: title,
        slug: slugify(title),
        body: body,
        categoryId: category
    }).then(() => {
        console.log('Artigo salvo com sucesso.');
        res.redirect('/admin/articles');
    });
});

router.post('/articles/delete', (req, res) => {
    let {
        id
    } = req.body;

    if (id != undefined) {
        if (!isNaN(id)) {
            Article.destroy({
                where: {
                    id: id
                }
            }).then(() => {
                console.log('Artigo deletado.');
                res.redirect('/admin/articles');
            });
        } else {
            res.redirect('/admin/articles');
        }
    } else {
        res.redirect('/admin/articles');
    }
});

router.get('/admin/articles/edit/:id', (req, res) => {
    let {
        id
    } = req.params;

    if (id != undefined) {
        if (!isNaN(id)) {

            Article.findByPk(
                    id, {
                        raw: true
                    }
                )
                .then((article) => {
                    if (article != undefined) {

                        Category.findAll({
                            raw: true
                        }).then((categories) => {
                            if (categories != undefined) {
                                res.render('admin/articles/edit', {
                                    article: article,
                                    categories: categories
                                });
                            } else {
                                res.redirect('/');
                            }
                        });

                    } else {
                        res.redirect('/');
                    }
                }).catch((error) => {
                    console.log(error);
                    res.redirect('/');
                });
        } else {
            res.redirect('/admin/articles');
        }
    } else {
        res.redirect('/admin/articles');
    }
});

router.post('/articles/update', (req, res) => {
    let {
        id,
        title,
        body,
        category
    } = req.body;

    console.log(
        id,
        title,
        body,
        category);

    Article.update({
            title: title,
            slug: slugify(title),
            body: body,
            categoryId: category,

        }, {
            where: {
                id: id
            }
        })
        .then(() => {
            res.redirect('/admin/articles');
        })
        .catch((error) => {
            console.log(error);
            res.redirect('/');
        });


});

module.exports = router;