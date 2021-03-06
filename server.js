﻿"use strict";
/**
 * Make sure you have these following dependencies installed

    npm install python-software-properties
    npm install python
    npm install g++
    npm install make
    npm install build-essential
    npm install get-json
    npm install util
    npm install request
    npm install discord.js
    npm install fs
    npm install js-yaml
    npm install sqlite3 --build-from-source

*/
/* DEPENDENCIES */
var getJSON = require('get-json');
const util = require('util');
var request = require("request")
const Discord = require("discord.js");
//const AIntelli = require('ai-chatbot');
//var cleverbot = require("better-cleverbot-io");
const sql = require("sqlite");
var fs = require('fs');
//var path = require('path');
var yaml = require('js-yaml');
const Actions = require("./js/mimsyactions.js");
const Soundboard = require("./js/Soundboard.js");
const Animals = require("./js/chatanimals.js");
const Rules = require("./js/rules.js");
const Hangman = require("./js/Hangman.js");
const Login = require('./js/botToken.js'); //Not included in the git file, see wiki for details.
const DB = require('./js/Database.js');
const config = require('./js/config.js');
const RPG = require('./js/rpg.js');
const Playlist = require('./js/Playlist.js');

/* INITIALISATION */

sql.open("./sqlite/users.sqlite"); // (userId, points, level)
sql.open("./sqlite/hangman.sqlite"); // (User_ID, Session_Status, Word, Guess_List, Hint, Difficulty, Total_Points)
sql.open("./sqlite/subscribers.sqlite"); // (User_ID, joinDate, loyaltyPoints)
sql.open("./sqlite/suggestions.sqlite"); // (messageID, User_ID)
sql.open("./sqlite/medals.sqlite"); // (userId, points)


var livestreamStatus = false;
var VIDEO_ID = "";
var VIDEO_TITLE = "";
var loggedInList = []; //List of users that have logged in this mimsy day!
var tempSub = []; // List of people having executed the follow command
var liveStreamCooldown = false; // Avoids posting double announcements
var activeVoiceChannel = ""; //Voice Channel the bot is currently in, prevents a user from summoning the bot multiple times to the same channel.
const bot = new Discord.Client();
//const Cbot = new cleverbot({ key: Login.getCleverbotKey(), user: Login.getCleverbotUser(), nick: "MimsyAI" });

/* YOUTUBE */
const YT_API_KEY = Login.getYT_API_KEY();
const YT_Channel_ID = Login.getYT_Channel_ID();
const YTAPIVideoURL = ('https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=' + YT_Channel_ID + '&eventType=live&type=video&key=' + YT_API_KEY);
const YTAPIStatusURL = ('https://www.googleapis.com/youtube/v3/liveBroadcasts?part=id%2Csnippet%2Cstatus&mine=true&broadcastStatus=active&key=' + YT_API_KEY);


console.log(`[Start] ${new Date()}`);
console.log(`[Start] ${config.get.welcome}`);
console.log(` `);
Actions.consoleWave();
console.log(` `);
console.log(` [Mimsy] Hello!`);

setInterval(function() { //12 hour loop
    console.log('It\'s a new beautiful day!');
    tempSub = []; //Players can reuse the 'follow' command 

}, 43200000);
setInterval(function() { //2 hour loop
    if ((((new Date()).getHours()) == 6) || (((new Date()).getHours()) == 18)) {
        loggedInList = []
        liveStreamCooldown = false;
    }
}, 7200000);

// GETS YOUTUBE INFO EVERY "updateInterval" Milliseconds
function crawl(anotherCallback) {

    //SENDS REQUEST TO GOOGLE API:Youtube API Video URL TO "GET" JSON
    var APIoptions = {
        url: YTAPIVideoURL,
        method: "GET",
        timeout: 10000,
        followRedirect: true,
        maxRedirects: 10
    };

    //CALLBACK FOR WHEN GOOGLE RESPONDS WITH JSON CONTAINING YOUTUBE INFO
    var callback = function(error, response, body) {
        if (!error && response.statusCode == 200) {
            var jsonContent = JSON.parse(body);
            if ((jsonContent["pageInfo"]["totalResults"]) != 0) {
                VIDEO_TITLE = jsonContent["items"][0]["snippet"]["title"];
                VIDEO_ID = jsonContent["items"][0]["id"]["videoId"];
                //Successfully grabs the right VIDEO_TITLE and VIDEO_ID
                getVideoDetails(VIDEO_ID, VIDEO_TITLE);
            } else {
                VIDEO_ID = "";
                VIDEO_TITLE = "";
                streamStatus(false);
            }
        } else {
            //if (typeof response == "undefined") {}
        }
    };
    //REQUEST CALLBACK
    request(APIoptions, callback)
};

function getVideoDetails(id, title) {
    VIDEO_TITLE = title;
    VIDEO_ID = id;
    if (liveStreamCooldown == false) {
        streamStatus(true);
    }
}

function streamStatus(bool) {
    if (livestreamStatus != bool) {
        livestreamStatus = bool;
        if (livestreamStatus == false) { bot.channels.get(config.get.YouTubeChannelID).send("Live stream has gone offline!"); }
        if (livestreamStatus == true) {
            liveStreamCooldown = true;
            bot.guilds.get(config.serverID).roles.get(config.get.followerRoleID).setMentionable(true)
                .then(updated => console.log(`@subscribers mention enabled`))
                .catch(console.error);
            bot.channels.get(config.get.YouTubeChannelID).send("  <@&" + config.get.followerRoleID + ">  - ** Live stream is now online! ** \n_Join the stream !_\n\nVideo:\nhttps://www.youtube.com/watch?v=" + VIDEO_ID + "\n_`Get notified:  " + config.get.prefix + " subscribe`_\n\n**" + VIDEO_TITLE + "**");
            bot.guilds.get(config.get.serverID).roles.get(config.get.followerRoleID).setMentionable(false)
                .then(updated => console.log(`Subscribers pinged, @subscribers mention disabled`))
                .catch(console.error);
        }
    }
}
setInterval(crawl, config.get.updateInterval);


function isLoggedIn(text) {
    for (var i = 0; i < loggedInList.length; i++) {
        if (loggedInList[i] == text) { return true; }
    }
    return false;
}

function isSubscribed(userID) {
    for (var i = 0; i < tempSub.length; i++) {
        if (tempSub[i] == userID) { return true; }
    }
    return false;
}

bot.on('ready', () => {
    bot.user.setActivity('with your mind!');
    //(bot.channels.get(config.get.suggestionsChannelID)).fetchMessages() /*This is broken: TypeError: Cannot read property 'fetchMessages' of undefined*/
    var mimsyChannel = bot.channels.get(config.get.mimsyChannelID);
    setInterval(function() { //12 hour loop
        if (config.get.dailyGreeting == true) {
            mimsyChannel.send('It\'s a new day!');
        }
    }, 43200000);
});

/* Chat */
/*
bot.on('messageReactionAdd', (reaction, user) => {
    if ((reaction.message.channel.id == config.get.suggestionsChannelID) && (user.id == config.get.ownerID)) {
        if (reaction.emoji.identifier == "%E2%9C%85") {
            var newEmbed = new Discord.RichEmbed(reaction.message.embeds[0])
            var content  =?
            console.log(content);
            reaction.message.edit(content, { color: "123132" })
                //reaction.message.edit("00b300", reaction.message. )
        }
    }
}); */
function removeCircularReferences(obj) {
    const objs = new Map;
    for (const prop in obj) typeof obj[prop] === "object" && obj[prop] !== null && (objs.has(obj[prop]) ? delete obj[prop] : objs.set(obj[prop]));
}

bot.on('messageDelete', (message) => {
    var channel = message.channel;
    if (message.author.bot) {
        if (message.channel.id == config.get.suggestionsChannelID) {}
        return;
    }
    if (channel == bot.channels.get(config.get.soundboardChannelID)) {
        return;
    }
    var modChannel = bot.channels.get(config.get.moderationChannelID);
    modChannel.send({
        "embed": {
            "description": "**Deleted message : **\n**User : **" + message.author.tag + "\n**ID : ** " + message.author.id + " \n ```\n" + message.content + "```",
            "color": 14120349,
            "author": {
                "name": "A message has been deleted!"
            }
        }
    }).catch(reason => {
        console.error('[Mimsy] I cannot see who deleted this message, ' + reason);
    });
});
bot.on('messageReactionAdd', (reaction, user) => {
    if ((reaction.message.channel.id == config.get.suggestionsChannelID) && (user.id == config.get.ownerID)) {
        if (reaction.emoji.identifier == "%E2%9C%85") {
            let newEmbed = new Discord.RichEmbed(reaction.message.embeds[0]).setColor(0x006600);
            Object.values(newEmbed).forEach(v => { if (v && v.embed) delete(v.embed) });
            reaction.message.edit("", { embed: newEmbed });
        }
        if (reaction.emoji.identifier == "%E2%9D%8C") {
            let newEmbed = new Discord.RichEmbed(reaction.message.embeds[0]).setColor(0xff0000);
            Object.values(newEmbed).forEach(v => { if (v && v.embed) delete(v.embed) });
            reaction.message.edit("", { embed: newEmbed });
        }
    }
    if ((reaction.message.channel.id == config.get.suggestionsChannelID) && (typeof reaction.message.embeds[0] != "undefined")) {
        var suggestionOwnerTag = Actions.getUserTag(reaction.message.embeds[0]["footer"]["text"]);
    }
    if ((reaction.message.channel.id == config.get.suggestionsChannelID) && (user.tag == suggestionOwnerTag)) {
        if (reaction.emoji.identifier == "%E2%9D%8C") {
            reaction.message.delete(1000).catch(O_o => {});
        }
    }
    if ((user.id == config.get.ownerID) && (reaction.emoji.identifier == "%E2%98%A0")) {
        reaction.message.delete(1000).catch(O_o => {});
    }
    if ((user.id == config.get.ownerID) && (reaction.emoji.identifier == "%F0%9F%8F%85")) {
        reaction.message.channel.fetchMessages({ limit: 5 }).then(
            addGoodBoi(reaction.message.author.id, 1, reaction.message.channel));
    }
});
bot.on('message', (message) => {

    var channel = message.channel;


    if (message.author.bot) {
        if (message.channel.id == config.get.suggestionsChannelID) {}
        return;
    }

    function getArg(number) {
        return message.content.trim().split(/ /g)[number];
    }



    var lowercaseMessage = message.content.toLowerCase();
    var logChannel = bot.channels.get(config.get.logChannelID);
    var spacer = "";
    var d = new Date();
    var date = "`" + d.getDate() + "/" + d.getMonth() + "/" + d.getFullYear() + "-`_`" + d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds() + "`_";
    const prefixCheck = message.content.trim().split(/ +/g)[0];
    if (config.get.prefix == prefixCheck) {
        const args = message.content.slice(config.get.prefix.length).trim().split(/ +/g);
        const precommand = args[0];
        var command = args.shift().toLowerCase();
        var lowercasemessage = "";
        for (var i = 0; i < args.length; i++) {
            lowercasemessage += args[i] + " ";
        }
    } else { var command = "unknown" }
    if (command == "rules") {
        message.channel.send({
            embed: {
                color: 439293,
                description: Rules.Rules()
            }
        });
    }

    function getArg(number) {
        return message.content.trim().split(/ /g)[number + 1];
    }

    /* MEDALS */

    if (message.author.id == config.get.ownerID) { // OWNER COMMANDS
        /**
         * !! point (@user) (amount) # Gives amount of points to user
         * 
         * !! setpoints (@user) (amount) # Sets total points of user to set amount.
         * 
         */
        if (command == config.get.addPoints.toLowerCase()) {
            var goodBoiName = getArg(1);
            var goodBoiID = getArg(1).slice(2, getArg(1).length - 1);
            var goodBoiAmnt = Number(getArg(2));
            console.log("addGoodBoi(" + goodBoiID + ", " + goodBoiAmnt + ", " + message.channel + ")")
            DB.addGoodBoi(goodBoiID, goodBoiAmnt, message.channel);
            channel.send("<:medal:460520365026836501> Congratulations to <@" + goodBoiID + "> for gaining " + goodBoiAmnt + " " + config.get.points + "! <:medal:460520365026836501>");

        }
        // !! set(points) userID 0)
        if (command == "set" + config.get.points) {
            DB.setGoodBoi(Number(getArg(2)), message.channel);
        }
    }
    if (command == "avatar") { // Using Discord.js Master

        // Slice '<@341231224142141224>' => '341231224142141224'
        // var userID = getArg(1).slice(2, getArg(1).length - 1); // ex: userID = 341231224142141224
        var regex = /(\d{1,})/;
        var userID = getArg(1).match(regex)[1];
        /**
         * userA : GuildMember
         * message.guild : Guild
         */
        message.guild.fetchMember(userID).then(userA => {

            console.log("showing image of " + userA.user.tag);
            //console.log(userA.user.avatarURL);

            message.channel.send({
                "embed": {
                    "color": 14120349,
                    //"timestamp": "2018-07-10T01:38:22.294Z",
                    "image": {
                        "url": userA.user.avatarURL
                    },
                    "author": {
                        "name": userA.user.tag
                    }
                }
            });
        }).catch(reason => {
            console.error('[Mimsy] I cannot show(userID), ' + reason);
        });
    }
    if (command == "top" + config.get.points) {
        DB.getBestBois(message.channel);
    }
    if (command == "get" + config.get.points) {
        DB.getGoodBoi(message.author.id, message.channel);
    }
    if (command == "getall" + config.get.points) {
        DB.getAllBois(message.channel);
    }
    if (command == "hangman") {
        message.author.send(Hangman.help());
        message.delete(1000).catch(O_o => {});
    }

    //PRIVATE MESSAGES
    if (message.channel.type == "dm") {

        for (var i = 20; i > message.author.username.length; i--) {
            spacer += " .";
        }
        var loggedMessage = "" + date + " " + "**[PM]** " + spacer + " " + message.author.username + "#" + message.author.discriminator + ": _`" + message.content + "`_";
        logChannel.send(loggedMessage);
        if (command == "respond") { message.author.send("Hello") }

        /** HANGMAN */
        if (command == "hangman") { message.author.send(Hangman.help(config.get.prefix)) }
        if ((command == "hm") && (lowercasemessage == "")) {
            message.author.send(Hangman.help(config.get.prefix))
        }
        if ((command == "hm") && (lowercasemessage.trim() == "start")) {
            DB.hangmanStart(message.author.id, message.author)
        }
        if ((command == "hm") && (lowercasemessage.trim() == "status")) {
            DB.hangmanStatus(message.author.id, message.author);
        }
        if ((command == "hm") && (lowercasemessage.trim() == "help")) {
            message.author.send(Hangman.help());
        }
        if ((command == "hmg") && (Hangman.isLetter(lowercasemessage.trim()))) {
            DB.hangmanGuess(message.author.id, message.author, lowercasemessage.trim());
        }
        if ((command == "hm") && (lowercasemessage.trim() == "points")) {
            DB.hangmanGetPoints(message.author.id, message.author);
        }

        return;
    }

    // AUTOMATIC ACTIONS
    for (var i = 18; i > message.channel.name.length; i--) {
        spacer += " .";
    }
    var loggedMessage = "" + date + " " + "**[" + message.channel.name + "]** " + spacer + " " + message.author.username + "#" + message.author.discriminator + ': _`' + message.content + '`_';
    logChannel.send(loggedMessage);

    if (message.content.length > 30) {

        //Pasta's reaction
        if (message.author.id == 265440082457001984) {
            message.react(":spaghet: 402526491935768576");
        }

        //Keanu's reaction
        if (message.author.id == 285762732823805954) {
            message.react("\uD83E\uDD5C");
        }

        //Gainy's reaction
        if (message.author.id == 244643111580598292) {
            message.react(":gainfullterrorsuspicious: 326260376339611649");
        }

        //Shamel's reaction
        if (message.author.id == 273901841723686912) {
            message.react(":trollshamel: 377086697004990474");
        }
    }

    //Daily Greetings
    function hasRank() { hasNoRank = false; }
    if (isLoggedIn(message.author.id) == false) {
        loggedInList.push(message.author.id);
        var hasNoRank = true;
        if (message.member.roles.has(config.get.flowerRoleID)) {
            message.react(Actions.randomFlowerShortcut());
            hasRank();
        }
        if (message.member.roles.has(config.get.bananaRoleID)) {
            message.react('\uD83C\uDF4C');
            hasRank();
        }
        if (hasNoRank == true) {
            message.react(Actions.randomEmojiShortcut());
        }
    }

    // Cleverbot Integration
    if (Actions.mimsyVerify(lowercaseMessage) == true) {
        if (message.channel.id == config.get.mimsyTalkChannelID) {
            Cbot.create(function(err, MimsyAI) {
                Cbot.ask(lowercaseMessage, function(err, response) {
                    message.channel.send(response); // Will likely be: "Living in a lonely world"
                });
            });
        }
    }

    //Remove Youtube links from unwanted channels
    if (Actions.containsYoutube(lowercaseMessage) == true) {
        if (Actions.allowedYoutube(message.channel.id, config.get.allowedYTChannelIDs) == false) {
            message.delete(1000).catch(O_o => {}); //Supposed to delete message
            message.author.sendMessage("I see you tried to post a video in the wrong section.\nPlease only post youtube links in the #media section of Lezappen's discord here:\n\n https://discord.gg/ZDHUfWH")
        }
    }

    //Stop players with the no tag role from tagging Lezappen.
    if (Actions.containsLezTag(lowercaseMessage)) {
        if (message.member.roles.has(config.get.noTagRoleID)) {
            message.delete(1000).catch(O_o => {}); //Supposed to delete message
            message.author.sendMessage("I see you tried to tag Lezappen? How about no?")
        }
    }

    //Random Mimsy reaction
    if (Actions.shouldReact(message.channel.id, lowercaseMessage) == true) {
        message.channel.send(Actions.makeMimsyReact(lowercaseMessage, message.author));
    }

    // NO PREFIX COMMANDS
    if (lowercaseMessage == ('ping')) {
        message.channel.send(Actions.pong()); // "<@273901841723686912>" + message.author 
    }

    if (lowercaseMessage == 'mimsy') {
        var helpMsg = 'Hi! So far you can only use these commands: ``` ping ```\n';
        helpMsg += 'Commands followed by my prefix => `' + config.get.prefix + '`:``` ';
        helpMsg += '\nCommands:\n ';
        helpMsg += config.get.prefix + ' Suggest <suggestion for Mimsy development>\n ';
        helpMsg += config.get.prefix + ' (Un)Follow/(un)subscribe |Toggle notifications for new streams, become a subscriber!\n ';
        helpMsg += config.get.prefix + ' FollowDate |Get the date when you first subscribed\n ';
        helpMsg += config.get.prefix + ' Top' + config.get.points + " |Get list of members with most " + config.get.points + "\n ";
        helpMsg += config.get.prefix + ' Get' + config.get.points + " |Get your amount of " + config.get.points + "\n ";
        helpMsg += '\nFun Commands:\n ';
        helpMsg += config.get.prefix + ' RPG | Generates an RPG character\n ';
        //helpMsg += config.get.prefix+' + ai < message directed to the ai > \n ' --Broken--
        helpMsg += config.get.prefix + ' Video\n ';
        helpMsg += config.get.prefix + ' Avatar <@user> | Shows users profile picture\n ';
        helpMsg += config.get.prefix + ' Quote | Shows an inspirational quote\n ';
        helpMsg += config.get.prefix + ' SM <message> (SM = Spongebob Meme: Mockbob) the message for you\n ';
        helpMsg += config.get.prefix + ' Hangman |Start a hangman game!\n ';
        helpMsg += '\nVoice Channel: \n ';
        helpMsg += config.get.prefix + ' Summon\n '
        helpMsg += config.get.prefix + ' Dismissed\n ';
        helpMsg += config.get.prefix + ' Sb <sound> (requires soundboard access)\n ';
        helpMsg += '```';
        message.channel.send(helpMsg);
    }
    if (lowercaseMessage == 'i am dutch') {
        message.channel.send('Ik ben een pannenkoek!');
    }
    if (Actions.containsIceCream(lowercaseMessage) == "true") {
        message.channel.send('I love ICE CREAM!');
    }
    if (Actions.containsBlockMimsy(lowercaseMessage)) {
        message.channel.send('pls don\'t block me ;_;');
    }
    if (Actions.containsHello(lowercaseMessage)) {
        message.react('\uD83D\uDC4B');
    }
    if (Actions.containsPannekoek(lowercaseMessage)) {
        message.react('\uD83E\uDD5E');
    }
    if (Actions.containsFlower(lowercaseMessage) == "true") {
        message.react(Actions.randomFlowerShortcut());;
    }
    if (Actions.tellMeAboutYou(lowercaseMessage) == "true") {
        message.channel.send('I was created by <@238825468864888833> for his discord ;) ');
    }
    if (Actions.areYouBot(lowercaseMessage) == "true") {
        message.channel.send(Actions.iAmNotABot());
    }
    // Get User Info 
    sql.get(`SELECT * FROM users WHERE userId = "${message.author.id}"`).then(row => {
        if (!row) { // Can't find the row.
            sql.run("INSERT INTO users (userId, points, level) VALUES (?, ?, ?)", [message.author.id, 1, 0]);
        } else { // Can find the row.
            /*let curLevel = Math.floor(0.1 * Math.sqrt(row.points + 1));
                if (curLevel > row.level) {
                    row.level = curLevel;
                    sql.run(`UPDATE users SET points = ${row.points + 1}, level = ${row.level} WHERE userId = ${message.author.id}`);
                    message.reply(`You've leveled up to level **${curLevel}**! Ain't that dandy?`);
                }
                sql.run(`UPDATE users SET points = ${row.points + 1} WHERE userId = ${message.author.id}`);
            */
        }
    }).catch(() => { //If user doesn't exist create a new table in his honor!
        console.error; // Gotta log those errors
        sql.run("CREATE TABLE IF NOT EXISTS users (userId TEXT, points INTEGER, level INTEGER)").then(() => {
            sql.run("INSERT INTO users (userId, points, level) VALUES (?, ?, ?)", [message.author.id, 1, 0]);
        });
    });

    //COMMANDS WITH PREFIX
    //Invalid command
    // Build random RPG
    if (command == "rpg") {
        message.channel.send(RPG.generateCharacter("<@" + message.author.id + ">"));
    }
    //Summon Mimsy to channel.
    const Vchannel = message.member.voiceChannel;
    if (command == "summon") {
        message.delete(1000).catch(O_o => {});
        if (!(Vchannel === undefined) && (activeVoiceChannel != Vchannel.id)) {
            activeVoiceChannel = Vchannel.id;
            Vchannel.join()
                .then(connection => {
                    console.log('Connected to voice channel : ' + Vchannel.name);
                    const dispatcher = connection.playFile('./sounds/' + Actions.randomSummonMessage() + '.WAV');
                    dispatcher.on("end", end => { /*channel.leave()*/ });
                })
                .catch(console.error);
        } else {
            message.author.sendMessage('Hello, I wasn\'t able to join you :/\nFor the `' + config.get.prefix + ' Summon` command to work, you need to be in a voice channel.\nYou cannot summon me to a voice channel I\'m already in.');
        }
    }
    //Dismiss Mimsy from channel
    if (command == "dismissed") {
        message.delete(1000).catch(O_o => {});
        if (!(Vchannel === undefined) && (activeVoiceChannel == Vchannel.id)) {
            Vchannel.join()
                .then(connection => {
                    console.log('Connected to voice channel : ' + Vchannel.name);
                    const dispatcher = connection.playFile('./sounds/' + Actions.randomDismissMessage() + '.WAV');
                    dispatcher.on("end", end => { Vchannel.leave() });
                })
                .catch(console.error);
            activeVoiceChannel = "";
        }
    }

    //Soundboard
    if (message.channel.id == config.get.soundboardChannelID) {
        if (command == "sb") {
            if (lowercasemessage == "help") {
                message.author.sendMessage(Soundboard.getTutorial());
            } else if (!(Vchannel === undefined) && (activeVoiceChannel == Vchannel.id)) {
                Vchannel.join()
                    .then(connection => {
                        var dispatcher = connection.playFile('./sounds/soundboard/' + Soundboard.playSound(Number(lowercasemessage)));
                        dispatcher.on("end", end => {});
                    })
                    .catch(console.error);
            }
            if (message.author.id == config.get.ownerID) {
                message.delete(1000).catch(O_o => {});
            }
            message.delete(1000).catch(O_o => {});
        }
        if (message.author.id != config.get.ownerID) {
            message.delete(1000).catch(O_o => {});
        }
    }

    function sleep(milliseconds) {
        var start = new Date().getTime();
        for (var i = 0; i < 1e7; i++) {
            if ((new Date().getTime() - start) > milliseconds) {
                return 0;
            }
        }
    }

    async function sendQuote(channel) {
        request.get('http://inspirobot.me/api?generate=true', function(error, response, body) {
            channel.send({
                "embed": {
                    "color": 14120349,
                    //"timestamp": "2018-07-10T01:38:22.294Z",
                    "image": {
                        "url": body
                    }
                }
            });
        });
    }
    async function sendXMasQuote(channel) {
        request.get('http://inspirobot.me/api?generate=true&season=xmas', function(error, response, body) {
            channel.send({
                "embed": {
                    "color": 14120349,
                    //"timestamp": "2018-07-10T01:38:22.294Z",
                    "image": {
                        "url": body
                    }
                }
            });
        });
    }
    if (command == "quote") {
        sendQuote(bot.channels.get(config.get.quoteChannelID));
    }
    if (command == "xmasquote") {
        sendXMasQuote(bot.channels.get(config.get.quoteChannelID));
    }
    //Sponge Meme
    if (command == "sm") {
        message.delete(1000).catch(O_o => {}); //Supposed to delete message
        message.channel.send(message.author.tag + ": " + config.get.mockbob + Actions.spongeMemify(lowercasemessage) + config.get.mockbob);
    }

    //I have no idea what this does anymore
    if (command == "ban") {
        message.channel.send(Actions.banMessageUser(lowercasemessage));
    }

    // Transform text to minecraft rainbow
    if (command == "rb") {
        message.channel.send(Actions.rainbowText(lowercasemessage));
    }


    // Get Mimsy to send you a video
    if (command == "video") {
        message.delete(1000).catch(O_o => {}); //Supposed to delete message
        message.author.send('Hello, you asked me to send you this random video:\n' + Actions.randomVideoURL());
    }

    if ((command == "test") && (message.channel.id == config.get.testChannelID)) {

    }
    if (command == "merpg") {
        message.channel.send(RPG.generateCharacter("<@" + message.author.id + ">"));
    }


    if (command == "level") {
        sql.get(`SELECT * FROM users WHERE userId ="${message.author.id}"`).then(row => {
            if (!row) return message.reply("Your current level is 0");
            message.reply(`Your current level is ${row.level}`);
        });
    }

    if (command == "messages") {
        sql.get(`SELECT * FROM users WHERE userId ="${message.author.id}"`).then(row => {
            if (!row) return message.reply("sadly you do not have any messages yet!");
            message.reply(`You currently have ${row.points} messages!`);
        });
    }
    if ((command == "follow") || (command == "subscribe")) {
        message.member.addRole(config.get.followerRoleID);
        message.author.send("Thank you for subscribing!");
        message.delete(1000).catch(O_o => {});
        sql.get(`SELECT * FROM subscribers WHERE userId = "${message.author.id}"`).then(row => {
            if (!row) { // Can't find the row.
                sql.run("INSERT INTO subscribers (userId, joinDate, points) VALUES (?, DATETIME DEFAULT CURRENT_TIMESTAMP, ?)", [message.author.id, 10]).then(() => {
                    (bot.channels.get(config.get.YouTubeChannelID)).send({
                        "embed": {
                            "description": "\uD83C\uDF89 Congratulations to **" + message.member.displayName + "#" + message.author.discriminator + "** for becoming a new subscriber! \uD83C\uDF88",
                            "color": 5834442,
                            "timestamp": new Date(),
                            "footer": {
                                "icon_url": message.member.icon_url,
                                "text": "  Subscribed"
                            }
                        }
                    });
                });
            } else {
                if (!row.joinDate) {
                    sql.run(`UPDATE subscribers SET joinDate = (DATETIME('now')) WHERE userId = "${message.author.id}"`).then(() => {});
                }
            }
        }).catch(() => {
            sql.run("CREATE TABLE IF NOT EXISTS subscribers (userId TEXT, joinDate DATETIME DEFAULT CURRENT_TIMESTAMP, points INTEGER)").then(() => {
                sql.run("INSERT INTO subscribers (userId, joinDate, points) VALUES (?, DATETIME DEFAULT CURRENT_TIMESTAMP, ?)", [message.author.id, 10]).then(() => { console.log("added user to table") });
                console.log("created table, adding user");
            });
            console.log("sending message to suggestions channel");
            (bot.channels.get(config.get.YouTubeChannelID)).send({
                "embed": {
                    "description": "\uD83C\uDF89 Congratulations to **" + message.member.displayName + "#" + message.author.discriminator + "** for becoming a new subscriber! \uD83C\uDF88",
                    "color": 5834442,
                    "timestamp": new Date(),
                    "footer": {
                        "icon_url": message.member.icon_url,
                        "text": "  Subscribed"
                    }
                }
            });
        });
    }
    if ((command == "unfollow") || (command == "unsubscribe")) {
        message.member.removeRole(config.get.followerRoleID);
        message.author.send("You are now unsubscribed");
        sql.get(`SELECT * FROM subscribers WHERE userId = "${message.author.id}"`).then(row => {
            if (!row) {
                return 0;
            } else {
                sql.run(`DELETE * FROM subscribers WHERE userId = "${message.author.id}"`);
            }
            message.delete(1000).catch(O_o => {});
        });
    }
    if ((command == "followdate") && (message.member.roles.has(config.get.followerRoleID))) {
        sql.get(`SELECT * FROM subscribers WHERE userId = "${message.author.id}"`).then(row => {
            if (row) {
                var dateSubscribed = row.joinDate;
                console.log(row);
                return message.reply("You have been a subscriber since: " + dateSubscribed);
            } else {}
        })
    }
    if ((command == "clear") && (message.member.hasPermission("MANAGE_MESSAGES"))) {
        try {
            var amount = Number((lowercasemessage.trim().split(/ +/g))[0])
            var userA = (lowercasemessage.trim().split(/ +/g))[1]
            var counter = 0;
            message.delete(1000).catch(O_o => {});
            message.channel.fetchMessages({ limit: 99 }).then(mList => {
                var firstround = mList.find(function(msg) {
                    if (!(msg.author.bot)) {
                        if (counter < amount) {
                            if (msg.author.tag == userA) {
                                msg.delete(1000).catch(O_o => {});
                                counter++;
                                if (counter == amount) {
                                    (bot.channels.get(config.get.moderationChannelID)).send({
                                        "embed": {
                                            "description": message.author.tag + " cleared " + amount + " messages from " + msg.author.tag + "\nChannel: " + msg.channel.name,
                                            "color": 0xe0e0e0,
                                            "timestamp": new Date(),
                                            "footer": {
                                                "icon_url": message.member.icon_url,
                                                "text": "  Date cleared:"
                                            }
                                        }
                                    });
                                }
                            } else {}
                        }
                    }
                    if (counter >= amount) { return false; }
                });
            });
        } catch (error) {
            console.log(error)
            message.author.send(config.get.prefix + " clear **<number>** **<user>**");
        }

    }
    if ((command == "warn") && (message.member.hasPermission("MANAGE_MESSAGES"))) {
        message.delete(1000).catch(O_o => {});
        var userA = (lowercasemessage.trim().split(/ +/g))[0];
        var reason = lowercasemessage.slice(userA.length);

        if (!(bot.users.find('tag', userA)).bot) {
            (bot.channels.get(config.get.moderationChannelID)).send({
                "embed": {
                    "description": "**" + message.author.tag + " warned " + userA + "**\n Reason: ```" + reason + "```\nChannel: " + message.channel.name,
                    "color": 0xFFA500,
                    "timestamp": new Date(),
                    "footer": {
                        "icon_url": message.member.icon_url,
                        "text": "  Date warned:"
                    }
                }
            });
            (bot.users.find('tag', userA)).send({
                "embed": {
                    "description": "**You have been warned: **\n" + message.author.tag + " warned you: ```" + reason + "```\nChannel: " + message.channel.name,
                    "color": 0xff0000,
                    "timestamp": new Date(),
                    "footer": {
                        "icon_url": message.member.icon_url,
                        "text": "  Date warned:"
                    }
                }
            });
        }
    }

    var lastID = " ";
    if (command == "suggest") {
        message.delete(1000).catch(O_o => {});
        var suggestionChannel = bot.channels.get(config.get.suggestionsChannelID);
        //get ID of last message:
        suggestionChannel.fetchMessages({ limit: 5 }).then(messageList => {
            var collection = messageList.find(function(m) {
                var id = m.channel.messages.find(function(ret) {
                    lastID = Number(Actions.getSuggestionID(ret.embeds[0]["title"]));
                    return typeof lastID == "number";
                });
                return true;
            });
            var suggID = lastID + 1;
            suggestionChannel.send({
                embed: {
                    title: "Suggestion: " + suggID,
                    url: "",
                    color: 439293,
                    timestamp: new Date(),
                    footer: {
                        icon_url: message.author.avatarURL,
                        text: "Suggested by " + message.author.username + "#" + message.author.discriminator
                    },
                    description: "```" + lowercasemessage + "```"
                }
            });
        });
        // WITH DATABASE (Problem with saving the table once created)
        /*
        sql.run("INSERT INTO suggestions (userId, messageDiscordID) VALUES (?, ?)", [message.author.id, message.id]).then(row => {
                console.log("New suggestion added!");
                console.log(row);
                var suggestionChannel = bot.channels.get(suggestionsChannelID);
                suggestionChannel.send({
                    embed: {
                        title: "Suggestion: " + row.lastID,
                        url: "",
                        color: 439293,
                        timestamp: new Date(),
                        footer: {
                            icon_url: message.author.avatarURL,
                            text: "Suggested by " + message.author.username + "#" + message.author.discriminator
                        },
                        description: "```" + lowercasemessage + "```"
                    }
                });
                message.delete(1000).catch(O_o => {});
            })
            .catch(() => { //If suggestions doesn't exist create a new table 
                console.error;
                sql.run("CREATE TABLE IF NOT EXISTS suggestions (messageID INTEGER PRIMARY KEY AUTOINCREMENT, userId TEXT, messageDiscordID TEXT)").then(() => {
                    sql.run("INSERT INTO suggestions (userId, messageDiscordID) VALUES (?, ?)", [message.author.id, message.id]);
                    console.log("Added user to newly created table");
                });
                console.log("creating suggestions table");
            });
            */
    }
    /**
     * 
     * const id = Actions.getUserTag(msg.embeds[0].title);
     * const newMsg = messages.find(m => m.id === id);
     */

    if (command == "comment") {
        var args = lowercasemessage.trim().split(/ +/g);
        var messageID = Number(args[0]);
        var comment = "     >   `" + lowercasemessage.slice(args[0].length) + "`";
        (bot.channels.get(config.get.suggestionsChannelID)).fetchMessages({ limit: 99 }).then(messageList => {
            var retrievedMsg = messageList.find(function(m) {
                var msg = m.channel.messages.find(function(ret) {
                    if (Actions.getSuggestionID(ret.embeds[0]["title"]) === messageID) {
                        console.log(ret.embeds[0]["title"]);
                        let newEmbed = new Discord.RichEmbed(ret.embeds[0]).addField(message.author.tag, comment);
                        Object.values(newEmbed).forEach(v => { if (v && v.embed) delete(v.embed) });
                        ret.edit("", { embed: newEmbed });
                    };
                });
            });
        });
    }

    // Tips
    if (command == "tips") {
        message.channel.send({
            embed: {
                color: 439293,
                description: Rules.Tips()
            }
        });
    }

    // TODO make command to get user from name
    if (command == "annoy") {
        var victim = message.mentions.members.first();

        victim.send("hello! Here is a message from " + message.author.tag + ": https://youtu.be/dQw4w9WgXcQ");
        message.delete(1000).catch(O_o => {});
    }

    // Dog
    if (command == "dog") {
        message.channel.send({
            embed: {
                color: 439293,
                description: Animals.Dog()
            }
        });
    }

    // Giraffe with emoji on top
    if (command == "giraffe") {
        message.channel.send({
            embed: {
                color: 439293,
                description: Animals.Giraffe((lowercasemessage.trim().split(/ +/g))[1])
            }
        });
    }


    /**
     * Music Bot Functionality
     */
    if (command == "play") { Playlist.play(message) };
    if (command == "skip") { Playlist.skip(message) };
    if (command == "stop") { Playlist.stop(message) };
    if (command == "volume") { Playlist.volume(message) };
    if (command == "np") { Playlist.np(message) };
    if (command == "queue") { Playlist.queue(message) };
    if (command == "pause") { Playlist.pause(message) };
    if (command == "resume") { Playlist.resume(message) };

    // session is your session name, it will either be as you set it previously, or cleverbot.io will generate one for you
    // Woo, you initialized cleverbot.io.  Insert further code here.
    if (command == "ai") {
        Cbot.create(function(err, MimsyAI) {
            Cbot.ask(lowercasemessage, function(err, response) {
                message.channel.send("node1" + response); // Will likely be: "Living in a lonely world"
            });
        });
    }
    process.on("unhandledRejection", (reason, p) => {
        //console.error("Unhandled Rejection at: Promise", p, "reason:", reason);
    });
    if (!message.content.startsWith(config.get.prefix)) { return 0; }
    var oldmessage = lowercasemessage;
});

/**
 * When the player joins a channel with the VIP role, the bot joins them.
 */
bot.on('voiceStateUpdate', (oldMember, newMember) => {



    /**
     * Connect to voice chat if user has specific role also joins voice chat
     */

    var Vchannel = newMember.voiceChannel;
    if (!(Vchannel === undefined) && (newMember.roles.get(config.get.VIPRoleID) != null)) {
        activeVoiceChannel = Vchannel.id;
        Vchannel.join()
            .then(connection => {
                const dispatcher = connection.playFile('./sounds/' + Actions.randomSummonMessage() + '.WAV');
                dispatcher.on("end", end => { /*channel.leave()*/ });
            })
            .catch(console.error);
    }

    /**
     * Leave voice chat when channel is empty (just the bot, alone)
     */
    if (oldMember.voiceChannel) {
        if (oldMember.voiceChannel.members.size == 1) {
            if ((oldMember.voiceChannel.members.first().user.bot) && (newMember.voiceChannelID == undefined)) {
                Vchannel = oldMember.voiceChannel;
                Vchannel.leave()
            };
        } else {

        };
    }

});
/* TO DO LIST */
/*
- Poll
*/

bot.login(Login.getToken());