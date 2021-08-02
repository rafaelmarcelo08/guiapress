const express = require('express');
const router = express.Router();
const slugify = require('slugify');

const Category = require('../model/Category');

router.get('/admin/categories/new', (req, res) => {
    res.render('admin/categories/new');
});

router.post('/categories/save', (req, res) => {
    let { title } = req.body;

    if (title != undefined) {
        Category.create(
            {
                title: title,
                slug: slugify(title)
            }
        ).then(() => {
            console.log('Categoria salva.');
            res.redirect('/admin/categories');
        }).catch((error) => {
            console.log(error);
        });
    } else {
        res.redirect('/admin/categories/new');
    }
});

router.get('/admin/categories', (req, res) => {
    Category.findAll(
        {
            raw: true,
        }
    ).then((categories) => {
        res.render('admin/categories/index',
            {
                categories: categories
            }
        );
    });
});

router.post('/categories/delete', (req, res) => {
    let { id } = req.body;

    if (id != undefined) {
        if (!isNaN(id)) {

            Category.destroy(
                {
                    where: {
                        id: id
                    }
                }
            ).then(() => {
                res.redirect('/admin/categories');
            });

        } else {
            res.redirect('/admin/categories');
        }
    } else {
        res.redirect('/admin/categories');
    }

});

router.get('/admin/categories/edit/:id', (req, res) => {
    let { id } = req.params;

    if (isNaN(id)) {
        res.redirect('/admin/categories');
    }

    Category.findByPk(id,
        {
            raw: true,
        }
    ).then((category) => {
        if (category != undefined) {

            res.render('admin/categories/edit',
                {
                    category: category
                }
            );
        } else {
            res.redirect('/admin/categories');
        }
    }).catch((error) => {
        console.log(error);
        res.redirect('/admin/categories');
    });
});

module.exports = router;