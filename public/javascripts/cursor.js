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

    camera.setPosition(camera.getOffsetX() + cameraOffset.x, camera.getOffsetY() + cameraOffset.y);
    this.centerCursor();
    
    if(this.animationProgress >= 1 || (this.currentCurserPosition.x == this.desiredCurserPosition.x && this.currentCurserPosition.y == this.desiredCurserPosition.y)){
      this.inAnimation = false;
      this.animationProgress = 0;
    }
  }

  init(){
    this.centerCursor();
    this.setDesiredCurserPosition(this.currentCurserPosition.y, this.currentCurserPosition.x);
    this.resizeCursor();
    this.curserElement.style.opacity = 1;
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