const { Command } = require('yuuko');
const { helpMessage } = require('../utils');


module.exports = new Command('help', (message, _args, _ctx) => {
  message.channel.createMessage(helpMessage);
});