var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Members' });
});

router.get('/home', function(req, res, next) {
  res.render('index', { title: 'Members' });
});
module.exports = router;
