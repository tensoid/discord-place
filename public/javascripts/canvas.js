class Canvas {

  constructor(canvas) {
    this.canvas = document.querySelector("#place-canvas");
    this.ctx = this.canvas.getContext("2d");
  }

  init(width, height){
    this.width = width;
    this.height = height;
    this.canvas.width = this.width;
    this.canvas.height = this.height;
  }

  drawPlace(place){
    for(let x = 0; x < place.length; x++){
      for(let y = 0; y < place[0].length; y++){

        let pixelColor = Color.pixelStateToColor(place[x][y]);        

        this.ctx.fillStyle = pixelColor;
        this.ctx.fillRect(x, y, 1, 1);
      }
    }
  }

  drawPixel(x, y, color){
    this.ctx.fillStyle = Color.pixelStateToColor(color);
    this.ctx.fillRect(x, y, 1, 1);
  }
}