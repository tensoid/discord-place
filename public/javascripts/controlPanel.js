class ControlPanel {

  constructor(){

    this.currentCooldown = 0;
    this.cooldownElement = document.querySelector(".cooldown");

    this.submitButtonElement = document.querySelector(".submit-button");
    this.submitButtonElement.addEventListener("click", () => {
      if(this.submitButtonPressedCallback) this.submitButtonPressedCallback();
    });

    window.addEventListener("keyup", (e) => {
      if(e.key == " ") {
        if(this.submitButtonPressedCallback) this.submitButtonPressedCallback();
      }
    });

    this.setSelectedColor(document.querySelector(".color-block"));
    this.previousColorBlockElement = document.querySelector(".color-block");
    this.submitButtonPressedCallback = null;

    this.interval = null;
  }

  tick(){
    this.currentCooldown--;
    if(this.currentCooldown <= 0){
      clearInterval(this.interval);
      this.interval = null;
      this.cooldownElement.style.color = "lightgreen";
    }
    this.cooldownElement.innerText = `Cooldown: ${this.currentCooldown}s`;
  }

  beginCooldown(cooldown){
    this.cooldownElement.style.display = "block";
    this.currentCooldown = cooldown;
    this.cooldownElement.innerText = `Cooldown: ${this.currentCooldown}s`;
    this.cooldownElement.style.color = "white";
    clearInterval(this.interval);
    this.interval = setInterval(this.tick.bind(this), 1000);
  }

  getSelectedColor(){
    return this.selectedColor;
  }

  setSelectedColor(colorBlockElement){

    if(this.previousColorBlockElement != null) {
      this.previousColorBlockElement.style.border = "none";
    }

    this.selectedColor = colorBlockElement.id;
    colorBlockElement.style.border = "4px solid rgba(0,0,0, 0.25)";

    this.previousColorBlockElement = colorBlockElement;
  }

  setSubmitButtonPressedCallback(callback){
    this.submitButtonPressedCallback = callback;
  }
}