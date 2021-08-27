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

router.get('/articles/pages/:num', (req, res) => {
    let {
        num
    } = req.params;
    let page = parseInt(num);
    let offSet = 0;
    let next;

    if (isNaN(page)) {
        res.send('Não é um numero');
    } else {
        offSet = page * 4;
    }

    Article.findAndCountAll({
            limit: 4,
            offset: offSet
        })
        .then((articles) => {

            if (((page * 4) + 4) < articles.count) {
                next = true;
            } else {
                next = false;
            }

            let result = {
                next: next,
                ...articles
            }
            
            Category.findAll({
                raw: true
            }).then((categories) => {
                res.render('admin/articles/page',
                {
                    result: result,
                    categories: categories
                }
            );
            });
        });
});

module.exports = router;