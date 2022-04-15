class EventManager{
  constructor(){

  }

  initControlPanelEvents(){
    let submitButtonElement = document.querySelector(".submit-button");
    submitButtonElement.addEventListener("click", () => {
      if(controlPanel.submitButtonPressedCallback) controlPanel.submitButtonPressedCallback();
    });
    
    window.addEventListener("keyup", (e) => {
      if(e.key == " ") {
        if(controlPanel.submitButtonPressedCallback) controlPanel.submitButtonPressedCallback();
      }
    });
  }

  initCameraEvents(){

    let cameraElement = document.querySelector(".camera");

    window.addEventListener("keyup", (e) => {

      if(cursor.inAnimation) return;
  
      if(e.key == "ArrowRight" || e.key.toLowerCase() == "d"){
        cursor.inAnimation = true;
        cursor.setDesiredCurserPosition(cursor.currentCurserPosition.x + 1, cursor.currentCurserPosition.y);
      }
      else if(e.key == "ArrowLeft" || e.key.toLowerCase() == "a"){
        cursor.inAnimation = true;
        cursor.setDesiredCurserPosition(cursor.currentCurserPosition.x - 1, cursor.currentCurserPosition.y);
      }
      else if(e.key == "ArrowUp" || e.key.toLowerCase() == "w"){
        cursor.inAnimation = true;
        cursor.setDesiredCurserPosition(cursor.currentCurserPosition.x, cursor.currentCurserPosition.y - 1);
      }
      else if(e.key == "ArrowDown" || e.key.toLowerCase() == "s"){
        cursor.inAnimation = true;
        cursor.setDesiredCurserPosition(cursor.currentCurserPosition.x, cursor.currentCurserPosition.y + 1);
      }
    });
  

    cameraElement.addEventListener("mousedown", (e) => {
      cursor.mouseDown = true;
      cursor.mouseStartX = e.clientX;
      cursor.mouseStartY = e.clientY;
    });
    
  
    // event listener is added to window is needed to capture mouseup events outside of the canvas to stop 
    // the dragging if the mouse goes out of the canvas while dragging
    window.addEventListener("mouseup", (e) => {
  
      // detect if a mouse click was made and not a drag
      const diffX = Math.abs(e.clientX - cursor.mouseStartX);
      const diffY = Math.abs(e.clientY - cursor.mouseStartY);
  
      if (diffX < 6 && diffY < 6) {
        let coords = cursor.getSelectedPixel();
        if(cursor.isValidPosition(coords.x, coords.y)) {
          cursor.inAnimation = true;
          cursor.setDesiredCurserPosition(coords.x, coords.y);
        }
      }
  
      cursor.mouseDragging = false;
      cursor.mouseDown = false;
    }); 
    
  
    cameraElement.addEventListener("mousemove", (e) => {
  
      if(cursor.mouseDown) cursor.mouseDragging = true;
  
      // get mouse delta
      let deltaY = e.clientY - cursor.mouseY;
      let deltaX = e.clientX - cursor.mouseX;
      cursor.mouseX = e.clientX;
      cursor.mouseY = e.clientY;
  
      // update the camera position
      if (cursor.mouseDragging) {
        if(cursor.inAnimation) return;
        camera.updatePosition(deltaX, deltaY);
        cursor.centerCursor();
        cursor.setDesiredCurserPosition(cursor.currentCurserPosition.y, cursor.currentCurserPosition.x);
      }    
    });
    
    cameraElement.addEventListener("wheel", (e) => {
  
      let mousePosWorldBeforeZoom = cursor.screenToWorldSpace(cursor.mouseX, cursor.mouseY);
  
      // get mousewheel delta
      let delta = e.deltaY;
  
      // update the camera scale
      if (delta > 0) camera.updateScale(0.9);
      else camera.updateScale(1.1);
  
      let mousePosWorldAfterZoom = cursor.screenToWorldSpace(cursor.mouseX, cursor.mouseY);
  
      // update the camera position
      camera.updatePosition(-(mousePosWorldBeforeZoom.x - mousePosWorldAfterZoom.x) * 40 * camera.getScale(), -(mousePosWorldBeforeZoom.y - mousePosWorldAfterZoom.y)* 40 * camera.getScale());
      
      cursor.resizeCursor();
      cursor.centerCursor();
    });
  }
}