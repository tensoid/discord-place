class Cursor {
  constructor() {

    this.cameraElement = document.querySelector(".camera");
    this.curserElement = document.querySelector(".cursor");
    this.coordinateDisplayElement = document.querySelector(".coordinate-display");
  
    this.mouseDown = false;
    this.mouseDragging = false;
    this.mouseStartX = 0;
    this.mouseStartY = 0;

    this.mouseX = 0;
    this.mouseY = 0;

    this.currentCurserPosition = {
      x: null,
      y: null 
    };

    this.initEventListeners();
  }

  initEventListeners() {
    this.cameraElement.addEventListener("mousedown", this.onMouseDown.bind(this));
    // window is needed to capture mouseup events outside of the canvas to stop 
    // the dragging if the mouse goes out of the canvas while dragging
    window.addEventListener("mouseup", this.onMouseUp.bind(this)); 
    this.cameraElement.addEventListener("mousemove", this.onMouseMove.bind(this));
    this.cameraElement.addEventListener("wheel", this.onMouseWheel.bind(this));
  }

  onMouseDown(e) {
    this.mouseDown = true;
    this.mouseStartX = e.clientX;
    this.mouseStartY = e.clientY;
  }

  onMouseUp(e) {

    // detect if a mouse click was made and not a drag
    const diffX = Math.abs(e.clientX - this.mouseStartX);
    const diffY = Math.abs(e.clientY - this.mouseStartY);

    if (diffX < 6 && diffY < 6) {
      let coords = this.getSelectedPixel();
      this.setCursorPosition(coords.x, coords.y);
    }

    this.mouseDragging = false;
    this.mouseDown = false;
  }

  onMouseMove(e) {

    if(this.mouseDown) this.mouseDragging = true;

    // get mouse delta
    let deltaY = e.clientY - this.mouseY;
    let deltaX = e.clientX - this.mouseX;
    this.mouseX = e.clientX;
    this.mouseY = e.clientY;

    // update the camera position
    if (this.mouseDragging) {
      camera.updatePosition(deltaX, deltaY);
    }    

    this.updateCursor();
  }

  onMouseWheel(e) {

    let mousePosWorldBeforeZoom = this.screenToWorldSpace(this.mouseX, this.mouseY);

    // get mousewheel delta
    let delta = e.deltaY;

    // update the camera scale
    if (delta > 0) camera.updateScale(0.9);
    else camera.updateScale(1.1);

    let mousePosWorldAfterZoom = this.screenToWorldSpace(this.mouseX, this.mouseY);

    // update the camera position
    camera.updatePosition(-(mousePosWorldBeforeZoom.x - mousePosWorldAfterZoom.x) * 40 * camera.getScale(), -(mousePosWorldBeforeZoom.y - mousePosWorldAfterZoom.y)* 40 * camera.getScale());
    
    this.updateCursor();
  }


  getCoordinateFromMousePos(x, y){
    let worldSpace = this.screenToWorldSpace(x, y);
    return {
      x: Math.floor(worldSpace.x),
      y: Math.floor(worldSpace.y)
    }
  }

  screenToWorldSpace(x, y){
    return {
      x: (x / 40 / camera.getScale()) - (camera.getOffsetX() / 40 / camera.getScale()),
      y: (y / 40 / camera.getScale()) - (camera.getOffsetY() / 40 / camera.getScale())
    };
  }

  worldToScreenSpace(x, y){
    return {
      x: x * 40 * camera.getScale() + camera.getOffsetX(),
      y: y * 40 * camera.getScale() + camera.getOffsetY()
    }
  }

  getSelectedPixel(){
    return this.getCoordinateFromMousePos(this.mouseX, this.mouseY);
  }

  setCursorPosition(x, y){

    if(x === null || y === null) return;
    if(x < 0 || y < 0) return;
    if(x >= canvas.width || y >= canvas.height) return;

    if(camera.getScale() < 0.2) this.curserElement.style.opacity = 0;
    else this.curserElement.style.opacity = 1;

    this.currentCurserPosition.x = x;
    this.currentCurserPosition.y = y;

    let screenSpace = this.worldToScreenSpace(x, y);

    this.curserElement.style.left = `${screenSpace.x - 3 * camera.getScale()}px`;
    this.curserElement.style.top = `${screenSpace.y - 3 * camera.getScale()}px`;

    this.coordinateDisplayElement.innerText = `${x}, ${y}`;
  }

  updateCursor(){

    this.setCursorPosition(this.currentCurserPosition.x, this.currentCurserPosition.y);
    this.curserElement.style.width = `${46 * camera.getScale()}px`;
    this.curserElement.style.height = `${46 * camera.getScale()}px`;
  }
}