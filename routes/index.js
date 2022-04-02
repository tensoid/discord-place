var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/* GET place page */
router.get('/place/:ID', function(req, res, next) {
  let placeID = req.params.ID;
  res.render('place', { title: 'Place', placeID });
});

module.exports = router;
