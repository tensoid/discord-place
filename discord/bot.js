const { Client } = require('yuuko');
const database = require('../place/data/dbManager');

const bot = new Client({
  token: process.env.DISCORD_BOT_TOKEN,
  prefix: '.'
});

bot.extendContext({db: database});


try {
  bot
  .addDir("./discord/commands")
  .addDir("./discord/events")
  .connect();
} catch (err) {
  console.error(err);
}




  