const { Client } = require('yuuko');
const database = require('../data/dbManager');

const bot = new Client({
  token: process.env.DISCORD_BOT_TOKEN,
  prefix: '.'
});

bot.extendContext({db: database});


bot
  .addDir("./discord/commands")
  .addDir("./discord/events")
  .connect();



  