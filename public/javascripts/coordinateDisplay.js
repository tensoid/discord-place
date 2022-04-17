class CoordinateDisplay {
  constructor(){
    this.coordinateDisplayElement = document.querySelector(".coordinate-display");
  }

  updateCoordinate(){

    let x = cursor.currentCurserPosition.x;
    let y = cursor.currentCurserPosition.y;
    let author = place[x][y].author;

    if(author != null) {
      this.coordinateDisplayElement.innerText = `${x}, ${y} by ${author}`;
    }
    else {
      this.coordinateDisplayElement.innerText = `${x}, ${y}`;
    }
  }
}