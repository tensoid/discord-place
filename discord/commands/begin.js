const { Command } = require('yuuko');
const { welcomeMessage } = require('../utils');


module.exports = new Command('begin', (message, _,  { db } ) => {
  let msg = message.channel.createMessage(welcomeMessage);
  msg.then(m => {
    db.discordBot.setGuildWelcomeMessage(message.guildID, message.channel.id, m.id);
  });
});