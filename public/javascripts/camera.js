class Camera {
  constructor(){
    this.zoomElement = document.querySelector(".zoom-element");
    this.panElement = document.querySelector(".pan-element");
    this.cameraElement = document.querySelector(".camera");
  }

  init(zoomElementWidth, zoomElementHeight){
    this.zoomElement.style.width = `${zoomElementWidth}px`;
    this.zoomElement.style.height = `${zoomElementHeight}px`;
    this.centerCanvas();
  }

  getTotalScale(){
    return 40 / this.getScale();
  }

  getScale(){
    return parseFloat(this.zoomElement.style.transform.split("(")[1].split("px)")[0]);
  }

  getOffsetX(){
    return parseFloat(this.panElement.style.transform.split("(")[1].split("px)")[0]);
  }

  getOffsetY(){
    return parseFloat(this.panElement.style.transform.split("(")[2].split("px)")[0]);
  }

  updateScale(scale){

    // get current scale value
    let oldScale = this.getScale();

    // update the scale value and clamp
    let newScale = oldScale * scale;
    newScale = Math.min(1, newScale);
    this.zoomElement.style.transform = `scale(${newScale})`;
  }

  updatePosition(x, y){
    //get the current transform value
    let oldX = this.getOffsetX();
    let oldY = this.getOffsetY();

    // update the transform value
    let newX = oldX + x;
    let newY = oldY + y;

    // clamp to screenspace
    let canvasSize = this.zoomElement.getBoundingClientRect();
    newX = Math.min(this.cameraElement.clientWidth / 2, newX);
    newX = Math.max(this.cameraElement.clientWidth / 2 - canvasSize.width, newX);
    newY = Math.min(this.cameraElement.clientHeight / 2, newY);
    newY = Math.max(this.cameraElement.clientHeight / 2 - canvasSize.height, newY);


    this.panElement.style.transform = `translateX(${newX}px) translateY(${newY}px)`;
  }

  centerCanvas(){
    let canvasSize = this.zoomElement.getBoundingClientRect();
    let newX = this.cameraElement.clientWidth / 2 - canvasSize.width / 2;
    let newY = this.cameraElement.clientHeight / 2 - canvasSize.height / 2;

    this.panElement.style.transform = `translateX(${newX}px) translateY(${newY}px)`;
  }
}