var express = require('express');
var router = express.Router();


// Redirect everything to '/'
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Place'});
});


router.get('*', function(req, res, next) {
  res.redirect('/');
});


module.exports = router;
