module.exports = {
  welcomeMessage: {
    "embeds": [{
      "title": "Welcome to Discord r/place",
      "description": "Here you can set one pixel of a giant canvas (like in r/place on Reddit) and team up with other servers or users to create awesome artworks or overtake others. \n\nTo join all you have to do is react with any emoji to this message.",
      "color": 47296,
      "author": {
        "name": "rPlace Bot"
      },
      "footer": {
        "text": "made by tensoid"
      }
    }]
  },

  helpMessage: {
    embeds: [{
      "title": "Commands",
      "color": 47296,
      "fields": [{
          "name": ".begin",
          "value": "Sets the current channel to the bots main channel and creates the welcome message that users can join the place with.",
          "inline": true
        },
        {
          "name": ".help",
          "value": "Shows this page."
        }
      ],
      "author": {
        "name": "rPlace Bot"
      },
      "footer": {
        "text": "made by tensoid"
      }
    }]
  },
}