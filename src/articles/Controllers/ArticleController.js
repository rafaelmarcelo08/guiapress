const express = require('express');
const router = express.Router();

const Category = require('../../categories/model/Category');

router.get('/article', (req, res) => {
    res.send('rota de articles');
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

module.exports = router;