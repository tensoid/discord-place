class NetworkManager {
  constructor() {
    this.socket = io();
    this.init();

    this.onPlaceCallback = null;
    this.onTilePlacedCallback = null;
  }

  init() {
    this.socket.on("place", (data) => {
      if(this.onPlaceCallback) this.onPlaceCallback(data);
    });
    this.socket.on("tilePlaced", (data) => {
      if(this.onTilePlacedCallback) this.onTilePlacedCallback(data);
    });
  }

  setOnPlaceCallback(callback) {
    this.onPlaceCallback = callback;
  }

  setOnTilePlacedCallback(callback) {
    this.onTilePlacedCallback = callback;
  }
}