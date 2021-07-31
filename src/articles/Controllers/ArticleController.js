const express = require('express');
const router = express.Router();

router.get('/article', (req, res) => {
    res.send('rota de articles')
});

module.exports = router;