const crypto = require('crypto');


module.exports = {
  generateID() {
    return crypto.randomBytes(10).toString("hex");
  },

  isValidColor(color){
    return color >= 0 && color <= 29;
  },

  isValidPixel(x, y, db){
    let sizeX = db.place.get().length;
    let sizeY = db.place.get()[0].length;

    return x >= 0 && x < sizeX && y >= 0 && y < sizeY;
  },

  resizeArray(arr, width, height){

    let neededWidth = width - arr.length;
  
    if (neededWidth > 0) {
      for (let i = 0; i < neededWidth; i++) {
        arr.push([]);
      }
    } else if (neededWidth < 0) {
      for (let i = 0; i < -neededWidth; i++) {
        arr.pop();
      }
    }
  
    for (let i = 0; i < arr.length; i++) {
      let row = arr[i];
      let neededHeight = height - row.length;
  
      if (neededHeight > 0) {
        for (let j = 0; j < neededHeight; j++) {
          row.push(0);
        }
      } else if (neededHeight < 0) {
        for (let j = 0; j < -neededHeight; j++) {
          row.pop();
        }
      }
    }
  
    return arr;
  }
}