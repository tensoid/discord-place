var router = require('express').Router();
var db = require('../place/data/dbManager');


function isNumeric(str) {
  return !isNaN(str) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
         !isNaN(parseFloat(str)) // ...and ensure strings of whitespace fail
}


// return codes:
//  0: success
// -1: invalid arguments
// -2: on cooldown
// -3: not authorized


router.get('/placepixel', function(req, res, next) {
  let x = req.query.x;
  let y = req.query.y;
  let color = req.query.color;
  let token = req.query.token;

  if(!x || !y || !color || !token) {
    return res.json({code: -1, message: "Invalid arguments"});
  }

  if(!isNumeric(x) || !isNumeric(y) || !isNumeric(color)) {
    return res.json({code: -1, message: "Invalid arguments"});
  }

  let result = db.place.tryPlacePixel(parseInt(x), parseInt(y), parseInt(color), token);
    
  return res.json(result);
});


module.exports = router;
