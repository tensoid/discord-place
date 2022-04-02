// Imports
var fs = require('fs');
var { join } = require('path');

// Variables
let db = require('./db.json');

let utils = require('./utils.js');
let saveInterval = 2000;



const dbAccess = {
  //----[Place]----------------------------
  place : {

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
  fs.writeFile(join("data", "db.json"), JSON.stringify(db, null, 2), function(err) {
    if (err) console.log(err);
  });
}

setInterval(save, saveInterval);

module.exports = dbAccess;