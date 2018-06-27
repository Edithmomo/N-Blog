var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
   res.render('aboutAs', { title: '关于我们'});
});

module.exports = router;