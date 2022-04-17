class CoordinateDisplay {
  constructor(){
    this.coordinateDisplayElement = document.querySelector(".coordinate-display");
  }

  setCoordinate(x, y, author){
    if(author != null) {
      this.coordinateDisplayElement.innerText = `${x}, ${y} by ${author}`;
    }
    else {
      this.coordinateDisplayElement.innerText = `${x}, ${y}`;
    }
  }
}