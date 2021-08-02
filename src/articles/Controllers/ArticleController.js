const express = require('express');
const router = express.Router();

router.get('/article', (req, res) => {
    res.send('rota de articles')
});

router.get('/admin/articles/new', (req, res) => {
    res.render('admin/articles/new')
});

module.exports = router;