"use strict";

/* DEPENDENCIES */
var getJSON = require('get-json');
const util = require('util');
var request = require("request")
const Actions = require("./mimsyactions.js");
const Soundboard = require("./Soundboard.js");
const music = require('discord.js-music-v11');
const Discord = require("discord.js");
const Animals = require("./chatanimals.js");
const Rules = require("./rules.js");
const Login = require('./botToken.js')
const AIntelli = require('ai-chatbot');
var cleverbot = require("better-cleverbot-io");
const commentsStream = require('youtube-comments-stream');

/* INITIALISATION */
var livestreamStatus = true;
var VIDEO_ID = "";
var VIDEO_TITLE = "";
var loggedInList = []; //List of users that have logged in this mimsy day!
var activeVoiceChannel = ""; //Voice Channel the bot is currently in, prevents a user from summoning the bot multiple times to the same channel.
const bot = new Discord.Client();
const Cbot = new cleverbot({ key: Login.getCleverbotKey(), user: Login.getCleverbotUser(), nick: "MimsyAI" });

/* CONFIGURATION */
var logChannelID = "415987090480955392";
const mimsyTalkChannelID = "390243354211909632";
const soundboardChannelID = "414497480928133120";
const testChannelID = "378315211607769089";
const flowerRoleID = "404647452201844736";
const bananaRoleID = "325737032972238850";
const noTagRoleID = "410461710332329985";
const ownerID = "238825468864888833";
var prefix = "!- ";

/* YOUTUBE */
const YT_API_KEY = Login.getYT_API_KEY();
const YT_Channel_ID = Login.getYT_Channel_ID();
const YTAPIVideoURL = ('https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=' + YT_Channel_ID + '&eventType=live&type=video&key=' + YT_API_KEY);
const YTAPIStatusURL = ('https://www.googleapis.com/youtube/v3/liveBroadcasts?part=id%2Csnippet%2Cstatus&mine=true&broadcastStatus=active&key=' + YT_API_KEY);

bot.login(Login.getToken());
console.log(`[Start] ${new Date()}`);
console.log("Discord Bot: Mimsy has launched!");
setInterval(function() {
    console.log('It\'s a new beautifull day!');
    loggedInList = []; //Start a new mimsy day every 12 hours 
}, 43200000);

/* DETECT IF I AM STREAMING, OUTPUT NOTIFICATION IF I AM + VIDEO LINK
function getVIDEO_ID() {
    if (!error && response.statusCode == 200) {
        var jsonContent = JSON.parse(body);
        if ((jsonContent["items"][0]) != [""]) {
            VIDEO_TITLE = jsonContent["items"][0]["snippet"]["title"];
            VIDEO_ID = jsonContent["items"][0]["id"]["videoId"];
            console.log("[DEBUG] Response said: VIDEO_TITLE: " + VIDEO_TITLE + " and VIDEO_ID: " + VIDEO_ID);
        } else {
            VIDEO_ID = "false";
            VIDEO_TITLE = "false";
        }
        console.log("RETURN4" + VIDEO_ID);
    } else {
        console.log("[ERROR] " + response.statusCode);
    }
    console.log("RETURN3" + VIDEO_ID);
};

function crawl(anotherCallback) {
    if (livestreamStatus == true) {
        var APIoptions = {
            url: YTAPIVideoURL,
            method: "GET",
            timeout: 10000,
            followRedirect: true,
            maxRedirects: 10
        };

        var callback = function(error, response, body) {
            if (!error && response.statusCode == 200) {
                var jsonContent = JSON.parse(body);
                if ((jsonContent["items"][0]) != [""]) {
                    VIDEO_TITLE = jsonContent["items"][0]["snippet"]["title"];
                    VIDEO_ID = jsonContent["items"][0]["id"]["videoId"];
                    anotherCallback(VIDEO_ID, VIDEO_TITLE);
                } else {
                    VIDEO_ID = "false";
                    VIDEO_TITLE = "false";
                }
            } else {
                console.log("[ERROR] " + response.statusCode);
            }
        };
        request(APIoptions, callback)
    }
};
crawl(function(id, title) {
    VIDEO_ID = id;
    VIDEO_TITLE = title;
    console.log("[DEBUG] Crawl Response said: VIDEO_TITLE: ==" + VIDEO_TITLE + "== and VIDEO_ID: ==" + VIDEO_ID + "==");
    const stream = commentsStream(VIDEO_ID);
    stream.on('data', function(comment) {
        console.log(comment.text);
    });
    stream.on('error', function(err) {
        console.error('ERROR READING COMMENTS:', err);
    });
    stream.on('end', function() {
        console.log('NO MORE COMMENTS');
        process.exit();
    });
});

//setInterval(crawl, 500);


*/
function isLoggedIn(text) {
    for (var i = 0; i < loggedInList.length; i++) {
        if (loggedInList[i] == text) {
            return true;
        }
    }
    return false;
}
bot.on('ready', () => {
    bot.user.setGame('with your mind!')
});
/* Chat */
bot.on('message', (message) => {
    if (message.author.bot) return;
    var logChannel = bot.channels.get(logChannelID);
    var spacer = "";
    var d = new Date();
    var date = "`" + d.getDate() + "/" + d.getMonth() + "/" + d.getFullYear() + "-`_`" + d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds() + "`_";

    //Private Messages
    if (message.channel.type == "dm") {

        for (var i = 20; i > message.author.username.length; i--) {
            spacer += " .";
        }
        var loggedMessage = "" + date + " " + "**[PM]** " + spacer + " " + message.author.username + ": =>  **\"** _" + message.content + "_ **\"**";
        logChannel.send(loggedMessage);
        return;
    }
    for (var i = 18; i > message.channel.name.length; i--) {
        spacer += " .";
    }
    var loggedMessage = "" + date + " " + "**[" + message.channel.name + "]** " + spacer + " " + message.author.username + ': =>  **"** _' + message.content + '_ **"**';
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
        if (message.member.roles.has(flowerRoleID)) {
            message.react(Actions.randomFlowerShortcut());
            hasRank();
        }
        if (message.member.roles.has(bananaRoleID)) {
            message.react('\uD83C\uDF4C');
            hasRank();
        }
        if (hasNoRank == true) {
            message.react(Actions.randomEmojiShortcut());
        }
    }

    // Cleverbot Integration
    var lowercaseMessage = message.content.toLowerCase();
    if (Actions.mimsyVerify(lowercaseMessage) == true) {
        if (message.channel.id == mimsyTalkChannelID) {
            Cbot.create(function(err, MimsyAI) {
                Cbot.ask(lowercasemessage, function(err, response) {
                    message.channel.send(response); // Will likely be: "Living in a lonely world"
                });
            });
        }
    }

    //Remove Youtube links from unwanted channels
    if (Actions.containsYoutube(lowercaseMessage) == true) {
        if (Actions.allowedYoutube(message.channel.id) == false) {
            message.delete(1000).catch(O_o => {}); //Supposed to delete message
            message.author.sendMessage("I see you tried to post a video in the wrong section.\nPlease only post youtube links in the #media section of Lezappen's discord here:\n\n https://discord.gg/ZDHUfWH")
        }
    }
    //Stop players with the no tag role from tagging Lezappen.
    if (Actions.containsLezTag(lowercaseMessage)) {
        if (message.member.roles.has(noTagRoleID)) {
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
        var myMessage = 'Hi! So far you can only use these commands: ``` ping ```\n';
        myMessage += 'Commands followed by my prefix => `' + prefix + '`:``` ';
        myMessage += '\nFun Commands:\n ';
        myMessage += prefix + 'Fact\n ' + prefix + 'ai <message directed to the ai>\n ' + prefix + 'video\n ';
        myMessage += '\nMusic Commands: \n ';
        myMessage += prefix + 'Summon\n ' + prefix + 'Dismissed' + '```';
        message.channel.send(myMessage);
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

    //WITH PREFIX
    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const precommand = args[0];
    const command = args.shift().toLowerCase();
    var lowercasemessage = "";
    for (var i = 0; i < args.length; i++) {
        lowercasemessage += args[i] + " ";
    }
    lowercasemessage = lowercasemessage.trim();
    if (command == "rules") {
        message.channel.send({
            embed: {
                color: 439293,
                description: Rules.Rules()
            }
        });
    }

    // Build random fact
    if (command == "fact") {
        message.channel.send(Actions.randomInsult(message.author));
    }
    //Summon Mimsy to channel.
    const channel = message.member.voiceChannel;
    if (command == "summon") {
        message.delete(1000).catch(O_o => {});
        if (!(channel === undefined) && (activeVoiceChannel != channel.id)) {
            activeVoiceChannel = channel.id;
            channel.join()
                .then(connection => {
                    console.log('Connected to voice channel : ' + channel.name);
                    const dispatcher = connection.playFile('./sounds/' + Actions.randomSummonMessage() + '.WAV');
                    dispatcher.on("end", end => { /*channel.leave()*/ });
                })
                .catch(console.error);
        } else {
            message.author.sendMessage('Hello, I wasn\'t able to join you :/\nFor the `Summon` command to work, you need to be in a voice channel.\nYou cannot summon me to a voice channel I\'m already in.');
        }
    }
    //Dismiss Mimsy from channel
    if (command == "dismissed") {
        message.delete(1000).catch(O_o => {});
        if (!(channel === undefined) && (activeVoiceChannel == channel.id)) {
            channel.join()
                .then(connection => {
                    console.log('Connected to voice channel : ' + channel.name);
                    const dispatcher = connection.playFile('./sounds/' + Actions.randomDismissMessage() + '.WAV');
                    dispatcher.on("end", end => { channel.leave() });
                })
                .catch(console.error);
            activeVoiceChannel = "";
        }
    }

    //Soundboard
    if (message.channel.id == soundboardChannelID) {
        if (command == "sb") {
            if (lowercasemessage == "help") {
                message.author.sendMessage(Soundboard.getTutorial());
            } else if (!(channel === undefined) && (activeVoiceChannel == channel.id)) {
                channel.join()
                    .then(connection => {
                        var dispatcher = connection.playFile('./sounds/soundboard/' + Soundboard.playSound(Number(lowercasemessage)));
                        dispatcher.on("end", end => {});
                    })
                    .catch(console.error);
            }
            if (message.author.id == ownerID) {
                message.delete(1000).catch(O_o => {});
            }
            message.delete(1000).catch(O_o => {});
        }
        if (message.author.id != ownerID) {
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

    /* //Piano [DEPRECATED]
    if (message.channel.id == 414750345110224896) {
        if (command == "piano") {
            if (lowercasemessage == "help") {
                message.delete(1000).catch(O_o => {});
                message.author.sendMessage(Soundboard.getPianoTutorial());
            } else if (!(channel === undefined) && (activeVoiceChannel == channel.id)) {
                for (i = 0; i < lowercasemessage.length; i++) {
                    var file = './sounds/piano/' + Soundboard.playNote(lowercasemessage[i]);
                    console.log(lowercasemessage[i] + "//" + Soundboard.playNote(lowercasemessage[i]) + "//" + file);
                    channel.join()
                        .then(connection => {
                            var dispatcher = connection.playFile(file); //*HERE* CANNOT PLAY MULTIPLE NOTES FOR SOME REASON
                            dispatcher.on("end", end => {});
                        })
                        .catch(console.error);
                }
            }
        } else if (message.author.id != ownerID) {
            message.delete(1000).catch(O_o => {});
        }
    } 
    */

    //Sponge Meme
    if (command == "sm") {
        console.log(lowercasemessage);
        message.channel.send(Actions.spongeMemify(lowercasemessage));
    }

    //I have no idea what this does anymore
    if (command == "ban") {
        console.log(lowercasemessage);
        message.channel.send(Actions.banMessageUser(lowercasemessage));
    }
    //tests
    if (command == "filter") {
        message.channel.send(Actions.filter(lowercasemessage));
    }
    if (command == "filtere") {
        message.channel.send(Actions.encodeUTF(lowercasemessage));
    }
    if (command == "filterd") {
        message.channel.send(Actions.decodeUTF(lowercasemessage));
    }

    // Get Mimsy to send you a video
    if (command == "video") {
        message.delete(1000).catch(O_o => {}); //Supposed to delete message
        message.author.sendMessage('Hello, you asked me to send you this random video:\n' + Actions.randomVideoURL());
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
                description: Animals.Giraffe(args[0])
            }
        });
    }

    // session is your session name, it will either be as you set it previously, or cleverbot.io will generate one for you
    // Woo, you initialized cleverbot.io.  Insert further code here
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
    if (!message.content.startsWith(prefix)) { return 0; }
    var oldmessage = lowercasemessage;
});

//no idea, for future use maybe.
music(bot, {
    prefix: '!m ', // Prefix of '-'.
    global: false, // Server-specific queues.
    maxQueueSize: 10, // Maximum queue size of 10.
    clearInvoker: true, // If permissions applicable, allow the bot to delete the messages that invoke it (start with prefix)
    channel: 'music' // Name of voice channel to join. If omitted, will instead join user's voice channel.
});
/*
 * @param {Client} client - The discord.js client.
 * @param {object} options - (Optional) Options to configure the music bot. Acceptable options are:
 * 		prefix: The prefix to use for the commands (default '!').
 * 		global: Whether to use a global queue instead of a server-specific queue (default false).
 * 		maxQueueSize: The maximum queue size (default 20).
 * 		anyoneCanSkip: Allow anybody to skip the song.
 * 		clearInvoker: Clear the command message.
 * 		volume: The default volume of the player.
 *      channel: Name of voice channel to join. If omitted, will instead join user's voice channel.
 */
//music(bot, options);
/* TO DO LIST */
/*
- !- Poll
*/