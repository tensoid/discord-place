const { Server } = require("socket.io");
var server = null;


module.exports = {

    // Needed to get the http server instance from the express app
    createServer: (httpServer) => {
      const io = new Server(httpServer);

      server = new NetworkManager(io);
    },

    // Return the server instance
    getServer: () => server,
}


class NetworkManager {

  /**
   * @param {Server} server 
   */
  constructor(server) {
    this.server = server;
    this.db = require("./data/dbManager");

    this.init();
  }

  init() {
    this.server.on("connection", (socket) => {
      socket.emit("place", this.db.place.get());
    });
  }


  tilePlaced(x, y, color) {
    this.server.emit("tilePlaced", {x, y, color});
  }

  canvasReset(){
    this.server.emit("place", this.db.place.get());
  }
}