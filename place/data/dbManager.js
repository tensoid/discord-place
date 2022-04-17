// Imports
var fs = require('fs');
var { join } = require('path');

let { getServer } = require('../network-manager');
let db = require('./db.json');
let utils = require('./utils.js');
let config = require('../config.json');
let saveInterval = 2000;



const dbAccess = {
  //----[Place]----------------------------
  place : {
    get(){
      return db.place;
    },

    tryPlacePixel(x, y, color, token){

      // check if authorized
      if(!db.users.map(user => user.token).includes(token)){
        return {result: -3, message: "Not authorized"};
      }

      // check if on cooldown
      let user = db.users.find(user => user.token == token);
      if(Date.now() - user.lastDrawTime <= config.placeCooldown){
        return {result: -2, message: "On cooldown", cooldown: config.placeCooldown - (Date.now() - user.lastDrawTime)};
      }

      // check if valid arguments
      if(!utils.isValidPixel(x, y, dbAccess) || !utils.isValidColor(color)){
        return {result: -1, message: "Invalid arguments"};
      }


      // place pixel
      db.place[x][y] = color;
      user.lastDrawTime = Date.now();

      db.changes.push({x, y, color});

      // broadcast to clients
      getServer().tilePlaced(x, y, color);

      return {result: 0, message: "Success", cooldown: config.placeCooldown};
    },

    tryResetCanvas(sizeX, sizeY, token){
      if(token != process.env.ADMIN_API_TOKEN){
        return {result: -3, message: "Not authorized"};
      }

      let newCanvas = [];
      for(let i = 0; i < sizeX; i++){
        newCanvas.push([]);
        for(let j = 0; j < sizeY; j++){
          newCanvas[i].push(0);
        }
      }

      db.place = newCanvas;

      // broadcast to clients
      getServer().canvasReset();
      
      return {result: 0, message: "Success"};
    },

    tryResizeCanvas(sizeX, sizeY, token){
      if(token != process.env.ADMIN_API_TOKEN){
        return {result: -3, message: "Not authorized"};
      }

      db.place = utils.resizeArray(db.place, sizeX, sizeY);

      // broadcast to clients
      getServer().canvasResize();
      
      return {result: 0, message: "Success"};
    },

    trySetCooldown(cooldown, token){
      if(token != process.env.ADMIN_API_TOKEN){
        return {result: -3, message: "Not authorized"};
      }

      config.placeCooldown = cooldown;

      saveConfig();

      return {result: 0, message: "Success"};
    }
  }
  //----[Users]----------------------------
  , users : {

    addUser(name, id) {

      // remove user if already exists
      db.users = db.users.filter(user => user.id != id);

      // generate new token until it is unique
      let token = utils.generateID();
      while(db.users.find(u => u.token === token) !== undefined) {
        token = utils.generateID();
      }

      let user = {
        name,
        id, 
        token,
        lastDrawTime: 0,
      };

      db.users.push(user);
      return user;
    },

    removeUser(id){
      let user = this.getUser(id);
      if(user) db.users.splice(db.users.indexOf(user), 1);
    },

    getUser(id){
      return db.users.find(user => user.id === id);
    },

    validateToken(token){
      return db.users.find(user => user.token === token) !== undefined;
    }
    
  },
  //----[Discord Bot]----------------------
  discordBot : {
    setGuildWelcomeMessage(guildID, channelID, messageID){
      db.discordBot.guilds = db.discordBot.guilds.filter(guild => guild.guildID !== guildID);
      let guild = {guildID, channelID, messageID};
      db.discordBot.guilds.push(guild);
    },

    getWelcomeMessageIDs(){
      return db.discordBot.guilds.map(guild => guild.messageID);
    }
  }
}




function save(){
  fs.writeFile(join("place", "data", "db.json"), JSON.stringify(db, null, 2), function(err) {
    if (err) console.log(err);
  });
}

function saveConfig(){
  fs.writeFile(join("place", "config.json"), JSON.stringify(config, null, 2), function(err) {
    if (err) console.log(err);
  });
}

setInterval(save, saveInterval);

module.exports = dbAccess;