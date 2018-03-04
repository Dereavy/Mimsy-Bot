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
const Login = require('./botToken.js'); //Not included in the git file, see wiki for details.
const AIntelli = require('ai-chatbot');
const Hangman = require("./Hangman.js");
var cleverbot = require("better-cleverbot-io");
const sql = require("sqlite");
const commentsStream = require('youtube-comments-stream');
// https://discordapp.com/oauth2/authorize?client_id=378266781372121108&scope=bot

/* INITIALISATION */
sql.open("./users.sqlite"); // (userId, points, level)
sql.open("./hangman.sqlite"); // (User_ID, Session_Status, Word, Guess_List, Hint, Difficulty, Total_Points)
sql.open("./subscribers.sqlite"); // (User_ID, loyaltyPoints)
var livestreamStatus = false;
var VIDEO_ID = "";
var VIDEO_TITLE = "";
var loggedInList = []; //List of users that have logged in this mimsy day!
var tempSub = []; // List of people having executed the follow command
var activeVoiceChannel = ""; //Voice Channel the bot is currently in, prevents a user from summoning the bot multiple times to the same channel.
const bot = new Discord.Client();
const Cbot = new cleverbot({ key: Login.getCleverbotKey(), user: Login.getCleverbotUser(), nick: "MimsyAI" });

/* CONFIGURATION */
var logChannelID = "415987090480955392";
const mimsyTalkChannelID = "390243354211909632";
const soundboardChannelID = "414497480928133120";
const testChannelID = "378315211607769089";
const suggestionsChannelID = "418370942356684800";
const YouTubeChannelID = "416757328528932875";
const flowerRoleID = "404647452201844736";
const bananaRoleID = "325737032972238850";
const followerRoleID = "418524770448048129";
const noTagRoleID = "410461710332329985";
const ownerID = "238825468864888833";
//List channels where YT videos are allowed to be posted:
const allowedYTChannelIDs = [378315211607769089, 317066233230917632, 343748288702578689, 311545553198645248];
const updateInterval = 10000; //Milliseconds between Youtube API requests.
var prefix = "!!";

/* YOUTUBE */
const YT_API_KEY = Login.getYT_API_KEY();
const YT_Channel_ID = Login.getYT_Channel_ID();
const YTAPIVideoURL = ('https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=' + YT_Channel_ID + '&eventType=live&type=video&key=' + YT_API_KEY);
const YTAPIStatusURL = ('https://www.googleapis.com/youtube/v3/liveBroadcasts?part=id%2Csnippet%2Cstatus&mine=true&broadcastStatus=active&key=' + YT_API_KEY);

bot.login(Login.getToken());
console.log(`[Start] ${new Date()}`);
console.log("Discord Bot: Mimsy has launched!");
setInterval(function() { //12 hour loop
    console.log('It\'s a new beautifull day!');
    tempSub = []; //Players can reuse the 'follow' command 
}, 43200000);
setInterval(function() { //1 hour loop
    if ((((new Date()).getHours()) == 6) || (((new Date()).getHours()) == 18)) {
        loggedInList = []
    }
}, 3500000);

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
    streamStatus(true);
}

function streamStatus(bool) {
    if (livestreamStatus != bool) {
        livestreamStatus = bool;
        if (livestreamStatus == false) { bot.channels.get(YouTubeChannelID).send("Live stream has gone offline!"); }
        if (livestreamStatus == true) {
            bot.channels.get(YouTubeChannelID).send("  <@&" + followerRoleID + "> - **Live stream is now online!**\nJoin the stream ;)\nVideo: **" + VIDEO_TITLE + "**\nhttps://www.youtube.com/watch?v=" + VIDEO_ID + "Get notified: ` " + prefix + " subscribe `");
        }
    }
}
setInterval(crawl, updateInterval);


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
    bot.user.setGame('with your mind!');
    (bot.channels.get(suggestionsChannelID)).fetchMessages()
});
/* Chat */
/*
bot.on('messageReactionAdd', (reaction, user) => {
    if ((reaction.message.channel.id == suggestionsChannelID) && (user.id == ownerID)) {
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
bot.on('messageReactionAdd', (reaction, user) => {
    if ((reaction.message.channel.id == suggestionsChannelID) && (user.id == ownerID)) {
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
    if ((reaction.message.channel.id == suggestionsChannelID) && (typeof reaction.message.embeds[0] != "undefined")) {
        var suggestionOwnerTag = Actions.getUserTag(reaction.message.embeds[0]["footer"]["text"]);
    }
    if ((reaction.message.channel.id == suggestionsChannelID) && (user.tag == suggestionOwnerTag)) {
        if (reaction.emoji.identifier == "%E2%9D%8C") {
            reaction.message.delete(1000).catch(O_o => {});
        }
    }
});
bot.on('message', (message) => {
    if (message.author.bot) {
        if (message.channel.id == suggestionsChannelID) {}
        return;
    }
    var lowercaseMessage = message.content.toLowerCase();
    var logChannel = bot.channels.get(logChannelID);
    var spacer = "";
    var d = new Date();
    var date = "`" + d.getDate() + "/" + d.getMonth() + "/" + d.getFullYear() + "-`_`" + d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds() + "`_";
    const prefixCheck = message.content.trim().split(/ +/g)[0];
    if (prefix == prefixCheck) {
        const args = message.content.slice(prefix.length).trim().split(/ +/g);
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


    //PRIVATE MESSAGES
    if (message.channel.type == "dm") {

        for (var i = 20; i > message.author.username.length; i--) {
            spacer += " .";
        }
        var loggedMessage = "" + date + " " + "**[PM]** " + spacer + " " + message.author.username + "#" + message.author.discriminator + ": _`" + message.content + "`_";
        logChannel.send(loggedMessage);
        if (command == "respond") { message.author.send("Hello") }
        if (command == "hangman") { message.author.send(Hangman.help(prefix)) }
        if ((command == "hm") && (lowercasemessage == "")) { message.author.send(Hangman.help(prefix)) }

        function hangmanPlayer() {
            return sql.get(
                    `SELECT * FROM hangman WHERE User_ID = "${message.author.id}"`)
                .then(
                    row => {
                        if (!row) {
                            return true;
                        } else {
                            return false;
                        }
                    }
                );
        }


        function hangmanSession() {
            sql.get(`SELECT Session_Status FROM hangman WHERE User_ID = "${message.author.id}"`).then(row => { if (!row) {} else { return row.Session_Status; } });
        }
        var newWord = Actions.replaceInWord(Hangman.randomWord()[2], " ", "_").toLowerCase();
        console.log(newWord)
        if ((command == "hm") && (lowercasemessage == "start")) {
            Hangman.startGame(message.author.id, newWord);
            console.log(Hangman.startGame(message.author.id, newWord)); //doesn't work (not expected to)
            message.author.send(Hangman.getMessage(newWord, "", 2));
        }
        /* new hangman user:
                sql.run(
                    "INSERT INTO hangman (User_ID, Session_Status, Word, Guess_List, Hint, Difficulty, Total_Points) VALUES (?, ?, ?, ?, ?, ?, ?)",
                    [message.author.id, true, Hangman.randomWord()[2], "",false, 2, 0] );
        */
        /*    Hangman
         *
         * Function: hangmanPlayer(userID) -> check if user exists in table (true/false)
         * Function: hangmanSession(userID) -> return Session_Status (true/false)
         *
         * !! hm start (arg)=>  | Check if user exists in "Hangman" table ( User_ID /Session_Status/ Word / Guess_List / Hint / Difficulty / TotalPoints)
         *                      |                                         (example: 23456 / ("Minecraft", "Animals" , "Parrot") / "artesd" / true / "Hard" / 234 )
         *                      | If hangmanPlayer() == false : Generate table for user
         *                      | Set difficulty to "medium" if (arg) is not set (otherwise set to arg: 1=easy, 2=medium, 3=hard, 4=intense)
         *                      | Generate random word for user 
         *                      | Empty Guess List
         *                      | Set Hint to true
         *                      | Set Session_Status to true
         *
         * !! hm guess (arg)=>  | (hangmanPlayer() || hangmanSession()) == false => (throw message "You aren't playing a game atm" then Return;)
         *                      | Add guess to guessList
         *                      | Check for win (Hangman.js)
         *                      |   On Win:
         *                      |         ° getScore(Hangman.js) => add to TotalPoints
         *                      |         ° Display "win message" (requires word/guessList)
         *                      |         ° return
         *                      |   On Lose:
         *                      |         ° Display message
         *                      |         ° set Session_Status to false
         *                      | Display message (Hangman.js) (requires: word, guessList, mode)
         * 
         * 
         * !! hm hint  =>       | If hangmanStatus() == true && Hint in table is true; 
         *                      |         ° Remove hangmanHintCost points from user
         *                      |         ° Set Hint in table to false
         *                      |         ° Display hint to user : getHint(Word) (Hangman.js)
         * 
         * !! hm resume  => if (hangmanStatus() == true): Display message (Hangman.js) else: "No game to resume" message
         * 
         * !! hm points => return hangman total points (0 if user doesn't exist)
         * 
         * !! hm help => return help message (Hangman.js) (requires prefix)
         */

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
    if (Actions.mimsyVerify(lowercaseMessage) == true) {
        if (message.channel.id == mimsyTalkChannelID) {
            Cbot.create(function(err, MimsyAI) {
                Cbot.ask(lowercaseMessage, function(err, response) {
                    message.channel.send(response); // Will likely be: "Living in a lonely world"
                });
            });
        }
    }

    //Remove Youtube links from unwanted channels
    if (Actions.containsYoutube(lowercaseMessage) == true) {
        if (Actions.allowedYoutube(message.channel.id, allowedYTChannelIDs) == false) {
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
        var helpMsg = 'Hi! So far you can only use these commands: ``` ping ```\n';
        helpMsg += 'Commands followed by my prefix => `' + prefix + '`:``` ';
        helpMsg += '\nCommands:\n ';
        helpMsg += prefix + 'suggest <suggestion for Mimsy development>\n ';
        helpMsg += prefix + '(un)follow/(un)subscribe Toggle notifications for new streams, become a subscriber!\n ';
        helpMsg += prefix + 'followDate Get the date when you first subscribed\n ';
        helpMsg += '\nFun Commands:\n ';
        helpMsg += prefix + 'Fact\n ' + prefix + 'ai <message directed to the ai>\n ' + prefix + 'video\n ';
        helpMsg += '\nVoice Channel: \n ';
        helpMsg += prefix + 'Summon\n ' + prefix + 'Dismissed' + '```';
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
        message.delete(1000).catch(O_o => {}); //Supposed to delete message
        message.channel.send(Actions.spongeMemify(lowercasemessage));
    }

    //I have no idea what this does anymore
    if (command == "ban") {
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
        message.author.send('Hello, you asked me to send you this random video:\n' + Actions.randomVideoURL());
    }

    if ((command == "test") && (message.channel.id == testChannelID)) {
        //Function to be tested
        // (`SELECT * FROM subscribers WHERE userId = "${message.author.id}"`) == row == {userId:'string', points:'integer'}
        /*
        sql.run(`DELETE * FROM subscribers WHERE userId = "${message.author.id}"`);
        sql.run("DROP TABLE subscribers");
        sql.run("CREATE TABLE IF NOT EXISTS subscribers (userId TEXT, points INTEGER)");
        sql.get(`SELECT * FROM subscribers WHERE userId = "${message.author.id}"`).then(row => {
            if (!row) { // Can't find the row.
                console.log("this is a test"); // Nothing is logged
                console.error;
            } else {
                console.log(row); // nothing is logged
                console.error;
            }
            console.log(row); // nothing is logged
            console.error;
        }).catch(() => {
            console.error;
            console.log("creating table");
            sql.run("CREATE TABLE IF NOT EXISTS subscribers (userId TEXT, points INTEGER)")
        }); */

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
        message.member.addRole(followerRoleID);
        message.author.send("Thank you for subscribing!");
        message.delete(1000).catch(O_o => {});
        sql.get(`SELECT * FROM subscribers WHERE userId = "${message.author.id}"`).then(row => {
            if (!row) { // Can't find the row.
                sql.run("INSERT INTO subscribers (userId, joinDate, points) VALUES (?, DATETIME DEFAULT CURRENT_TIMESTAMP, ?)", [message.author.id, 10]).then(() => {
                    (bot.channels.get(YouTubeChannelID)).send({
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
            (bot.channels.get(YouTubeChannelID)).send({
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
        message.member.removeRole(followerRoleID);
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
    if ((command == "followdate") && (message.member.roles.has(followerRoleID))) {
        sql.get(`SELECT * FROM subscribers WHERE userId = "${message.author.id}"`).then(row => {
            if (row) {
                var dateSubscribed = row.joinDate;
                return message.reply("You have been a subscriber since: " + dateSubscribed);
            } else {}
        })
    }
    if (command == "suggest") {
        var suggestionChannel = bot.channels.get(suggestionsChannelID);
        suggestionChannel.send({
            embed: {
                title: "Suggestion:",
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
    if (!message.content.startsWith(prefix)) { return 0; }
    var oldmessage = lowercasemessage;
});


/* TO DO LIST */
/*
- Hangman
- Poll
*/
// CODE DUMP
/* Get comments from youtube
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
});*/