const { EventListener } = require('yuuko');


module.exports = new EventListener("messageReactionAdd", (message, emoji, member, ctx) => {

  if(ctx.db.discordBot.getWelcomeMessageIDs().includes(message.id)) {

    ctx.client.getDMChannel(member.id).then(channel => {

      let alreadyRegistered = ctx.db.users.getUser(member.id) !== undefined;
      let token = ctx.db.users.addUser(member.username, member.id).token;

      if(alreadyRegistered) {
        channel.createMessage({embeds: [{
          "title": `Hello ${member.username}!`,
          "description": "This is your new personal access token to modify the Place.\n```" + token + "```\n",
          "color": 47296,
          "author": {
            "name": "Place Bot"
          }
        }]});
      }
      else {
        channel.createMessage({embeds: [{
          "title": `Welcome ${member.username}!`,
          "description": "This is your personal access token to modify the Place.\n```" + token + "```\nDo not share this token with others!\nIn the case that you want to reset your token because you lost it or accidentally leaked it just react to any rPlace Bot welcome message on any server and another one will be sent to you.",
          "color": 47296,
          "author": {
            "name": "Place Bot"
          }
        }]});
      }
    });
  }
});