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
            //res.redirect('/admin/categories/new');
        }).catch((error) => {
            console.log(error);
        });
    } else {
        res.redirect('admin/categories/new');
    }
});

module.exports = router;