const crypto = require('crypto');


module.exports = {
  generateID() {
    return crypto.randomBytes(10).toString("hex");
  },

  isValidColor(color){
    return color >= 0 && color <= 23;
  },

  isValidPixel(x, y, db){
    let sizeX = db.place.get().length;
    let sizeY = db.place.get()[0].length;

    return x >= 0 && x < sizeX && y >= 0 && y < sizeY;
  }
}