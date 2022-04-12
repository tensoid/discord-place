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
      x: 0,
      y: 0 
    };

    this.desiredCurserPosition = {
      x: 0,
      y: 0 
    };

    this.animationProgress = 0;
    this.inAnimation = false;


    this.initEventListeners();
  }

  tick(deltaTime){
    if(!this.inAnimation) {
      this.animationProgress = 0;
      return;
    }
    
    let currentCurserPositionScreen = {
      x: this.worldToScreenSpace(this.currentCurserPosition.x, this.currentCurserPosition.y).x,
      y: this.worldToScreenSpace(this.currentCurserPosition.x, this.currentCurserPosition.y).y
    }

    let newCurserPositionScreen = {
      x: this.worldToScreenSpace(this.desiredCurserPosition.x, this.desiredCurserPosition.y).x,
      y: this.worldToScreenSpace(this.desiredCurserPosition.x, this.desiredCurserPosition.y).y
    }

    this.animationProgress += deltaTime;
    
    let cameraOffset = Vec2.lerp(currentCurserPositionScreen, newCurserPositionScreen, this.animationProgress);
    cameraOffset = {
      x: currentCurserPositionScreen.x - cameraOffset.x,
      y: currentCurserPositionScreen.y - cameraOffset.y
    }

    //camera.updatePosition(cameraOffset.x, cameraOffset.y);
    camera.setPosition(camera.getOffsetX() + cameraOffset.x, camera.getOffsetY() + cameraOffset.y);
    this.centerCursor();
    
    console.log(this.animationProgress);

    if(this.animationProgress >= 1 || this.currentCurserPosition.x == this.desiredCurserPosition.x && this.currentCurserPosition.y == this.desiredCurserPosition.y){
      this.inAnimation = false;
      this.animationProgress = 0;
      this.currentCurserPosition.x = this.desiredCurserPosition.x;
      this.currentCurserPosition.y = this.desiredCurserPosition.y;
      console.log("animation finished");
    }
  }

  init(){
    this.centerCursor();
    this.setDesiredCurserPosition(this.currentCurserPosition.y, this.currentCurserPosition.x);
    this.resizeCursor();
    this.curserElement.style.opacity = 1;
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
      if(this.isValidPosition(coords.x, coords.y)) {
        this.inAnimation = true;
        this.setDesiredCurserPosition(coords.x, coords.y);
      }
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
      if(this.inAnimation) return;
      camera.updatePosition(deltaX, deltaY);
      this.centerCursor();
      this.setDesiredCurserPosition(this.currentCurserPosition.y, this.currentCurserPosition.x);
    }    
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
    
    this.resizeCursor();
    this.centerCursor();
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

    if(!this.isValidPosition(x, y)) return;

    this.currentCurserPosition.x = x;
    this.currentCurserPosition.y = y;

    let screenSpace = this.worldToScreenSpace(x, y);

    this.curserElement.style.left = `${screenSpace.x - 3 * camera.getScale()}px`;
    this.curserElement.style.top = `${screenSpace.y - 3 * camera.getScale()}px`;

    this.coordinateDisplayElement.innerText = `${x}, ${y}`;
  }

  setDesiredCurserPosition(x, y){

    if(!this.isValidPosition(x, y)) return;

    console.log(`setDesiredCurserPosition(${x}, ${y})`);
    console.log(this.currentCurserPosition);
    this.desiredCurserPosition.x = x;
    this.desiredCurserPosition.y = y;  
  }


  centerCursor(){

    // get the current pixel in center of screen
    let curserPositionWorld = this.screenToWorldSpace(this.cameraElement.clientWidth / 2, this.cameraElement.clientHeight / 2);
    curserPositionWorld.x = Math.floor(curserPositionWorld.x);
    curserPositionWorld.y = Math.floor(curserPositionWorld.y);
    curserPositionWorld.x = Math.min(Math.max(curserPositionWorld.x, 0), canvas.width - 1);
    curserPositionWorld.y = Math.min(Math.max(curserPositionWorld.y, 0), canvas.height - 1);
    this.currentCurserPosition.x = curserPositionWorld.x;
    this.currentCurserPosition.y = curserPositionWorld.y;

    // set curser position
    this.setCursorPosition(this.currentCurserPosition.x, this.currentCurserPosition.y);
  }

  resizeCursor(){
    this.curserElement.style.width = `${46 * camera.getScale()}px`;
    this.curserElement.style.height = `${46 * camera.getScale()}px`;
  }

  isValidPosition(x, y){
    if(x === null || y === null) return false;
    if(x < 0 || y < 0) return false;
    if(x >= canvas.width || y >= canvas.height) return false;

    return true;
  }
}