class CoordinateDisplay {
  constructor(){
    this.coordinateDisplayElement = document.querySelector(".coordinate-display");
  }

  setCoordinate(x, y){
    this.coordinateDisplayElement.innerText = `${x}, ${y}`;
  }
}