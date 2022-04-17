// ----[Modules]----------------------
let networkManager = new NetworkManager();
let controlPanel = new ControlPanel();
let canvas = new Canvas();
let camera = new Camera();
let cursor = new Cursor();
let eventManager = new EventManager();
let coordinateDisplay = new CoordinateDisplay();


// ----[Variables]----------------------
let lastTime = Date.now();
let place = null;


// ----[Main Loop]----------------------
function loop(){
  requestAnimationFrame(loop);

  // calculate delta time
  let now = Date.now();
  let deltaTime = (now - lastTime) / 1000;
  lastTime = now;

  cursor.tick(deltaTime);
}


// ----[DOM Events]----------------------
function onSubmitButtonPressed(){

  // check if token cookie is already set
  let token = Cookies.get("token");
  if(token == ""){
    token = prompt("Please enter your token. If you do not have one, you can get it from the Discord Place Bot.", "")
    if(token == "") return;
    if(token == null) return;
    Cookies.set("token", token, 1);
  }

  // make api request to place pixel
  let x = cursor.currentCurserPosition.x;
  let y = cursor.currentCurserPosition.y;

  if(x == null || y == null) {
    alert("Please place the cursor on the canvas before submitting your pixel.");
    return;
  }

  let color = controlPanel.getSelectedColor();

  // return codes:
  //  0: success
  // -1: invalid arguments
  // -2: on cooldown
  // -3: not authorized
  fetch(`/api/placepixel?x=${x}&y=${y}&color=${color}&token=${token}`).then(res => {
    res.json().then(data => {
      if(data.result == -3){
        token = prompt("The token you entered previously was invalid. Please enter a valid one. If you do not have one, you can get it from the Discord Place Bot.", "")
        if(token == "") return;
        if(token == null) return;
        Cookies.set("token", token, 1);
      }
      else if(data.result == -2){
        //alert("You are on cooldown. Please wait a few seconds before placing another pixel.");
        controlPanel.beginCooldown(Math.ceil(data.cooldown / 1000));
      }
      else if(data.result == 0){
        controlPanel.beginCooldown(data.cooldown / 1000);
      }
    });
  });
}

controlPanel.setSubmitButtonPressedCallback(onSubmitButtonPressed);


// ----[Network Events]----------------------
function onPlace(placeData){
  place = placeData;
  canvas.init(place.length, place[0].length);
  canvas.drawPlace(place);
  camera.init(40 * place.length, 40 * place[0].length);
  cursor.init();
}

function onTilePlaced(data){
  canvas.drawPixel(data.x, data.y, data.color);
  place[data.x][data.y] = {color: data.color, author: data.author};
  coordinateDisplay.setCoordinate(data.x, data.y, data.author);
}

networkManager.setOnPlaceCallback(onPlace);
networkManager.setOnTilePlacedCallback(onTilePlaced);


// ----[DOM Events]----------------------
eventManager.initControlPanelEvents();
eventManager.initCameraEvents();

loop();