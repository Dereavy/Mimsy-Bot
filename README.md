# Mimsy-Bot

Read the wiki for more information on what the bot does:
https://github.com/Lezappen/Mimsy-Bot/wiki

Installation:
  - Create channels and enter their corresponding ID's in the config
  - Fill in the config with all other information
  - Add botToken.js to the js folder, to fill it you will need:
      - Discord Bot token
      - Youtube API key + channel ID
      - Cleverbot User ID and Key
      
botToken.js content:

        module.exports = {
            getToken: function() { return 'Paste Bot token here' },
            
    // Can be obtained here: https://developers.google.com/youtube/v3/getting-started
            getYT_API_KEY: function() { return 'Paste YT API key here' },
            getYT_Channel_ID: function() { return 'Paste YT channel ID' },
            
    // Can be obtained at https://cleverbot.io/login:
            getCleverbotUser: function() { return 'cleverbot User ID' },
            getCleverbotKey: function() { return 'Cleverbot User Key' }
        }
