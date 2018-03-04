/* FUNCTIONS */
function randomAnimal() {
    var theArray = ['Pig', 'Gorilla', 'Cat', 'Chipmunk', 'Snake', 'Dog', 'Chicken', 'Lemur', 'Sloth', 'Monkey', 'Bear', 'Lizard', 'Dragon', 'Human', 'Goose', 'Worm', 'Crab'];
    var choice = Math.floor(Math.random() * theArray.length);
    var myMessage = theArray[choice].toLowerCase();
    return myMessage + " ";
}

function randomItem() {
    var theArray = ['Banana', 'Milk bucket', 'Pencil', 'Birch Block', 'Cucumber', 'Pear', 'Peaches', 'Loo Roll', 'Calculator', 'Tea Bag', 'Mug', 'Book', 'Fried Egg'];
    var choice = Math.floor(Math.random() * theArray.length);
    var myMessage = theArray[choice].toLowerCase();
    return myMessage + " ";
}

function randomPlace() {
    var theArray = ['The Jungle', 'The Desert', 'The Plains', 'The Ocean', 'The White House', 'A Dirt House', 'A Hole', 'A Sewer', 'The City'];
    var choice = Math.floor(Math.random() * theArray.length);
    var myMessage = theArray[choice].toLowerCase();
    return myMessage + " ";
}

function randomColour() {
    var theArray = ['Orange', 'Brown', 'Pink', 'Red', 'Green', 'Blue', 'Yellow', 'Purple', 'Moist', 'Gluey', 'Slimy', 'chocolaty'];
    var choice = Math.floor(Math.random() * theArray.length);
    var myMessage = theArray[choice].toLowerCase();
    return myMessage + " ";
}

function randomAction() {
    var theArray = ['Eating', 'Throwing', 'Humping', 'Scratching', 'Swimming with', 'Listening to', 'Reading', 'Holding'];
    var choice = Math.floor(Math.random() * theArray.length);
    var myMessage = theArray[choice].toLowerCase();
    return myMessage + " ";
}

function randomCharacteristic() {
    var theArray = ['Angry', 'Soulless', 'Happy', 'Spiteful', 'Confused', 'Pleased with himself', 'Victorious', 'Evil'];
    var choice = Math.floor(Math.random() * theArray.length);
    var myMessage = theArray[choice].toLowerCase();
    return myMessage + " ";
}

function randomDescriptor() {
    var theArray = ['Angrily', 'Soullessly', 'Happily', 'Spitefully', 'in a confused manor', 'Pleased with himself', 'Victoriously', 'with much evil'];
    var choice = Math.floor(Math.random() * theArray.length);
    var myMessage = theArray[choice].toLowerCase();
    return myMessage + " ";
}

function randomInsult(input) {
    var choice = Math.floor(Math.random() * 3);
    if (choice == 0) { return input + " is a " + randomCharacteristic() + randomAnimal() + randomAction() + "a " + randomItem() + "and " + randomAction() + "a " + randomColour() + randomAnimal() }
    if (choice == 1) { return input + " was caught " + randomDescriptor() + randomAction() + "a " + randomItem() + "and " + randomAction() + "a " + randomColour() + randomAnimal() }
    if (choice == 2) { return input + " later found out that he was " + randomAction() + "a " + randomAnimal() + "and " + randomAction() + "a " + randomItem() + "in " + randomPlace() }
}

function spongeMeme(text) {
    var ret = "";
    var char = "";
    for (var i = 0; i <= (text.length - 1); i++) {
        char = text[i]
        if ((i % 2) == 0) {
            char = char.toLowerCase();
        } else {
            char = char.toUpperCase();
        }
        ret += char;
    }
    return ret;
}

function randomStatement() {
    var theArray = ['Hello...', 'Gainy is ez', 'I like tea!', "Time to take over the world..."];
    var choice = Math.floor(Math.random() * theArray.length);
    var myMessage = theArray[choice].toLowerCase();
    return myMessage;
}
// 4pXfHLUlZf4 irrelevent
function randomVideoID() {
    var theString = ['r7DQDrRwNgI', 'FU9oiN8x6Y8', 'dQw4w9WgXcQ', 'jofNR_WkoCE', '9bZkp7q19f0', 'OQSNhk5ICTI', 'qrO4YZeyl0I', 'OFzXaFbxDcM', 'oKI-tD0L18A', 'nHlJODYBLKs', 'KmtzQCSh6xk', '3GJOVPjhXMY', 'dMH0bHeiRNg', '4pXfHLUlZf4', 'a1Y73sPHKxw', 'oavMtUWDBTM', 'EwTZ2xpQwpA', '-5x5OXfe9KY', 'kfVsfOSbJY0'];
    var choice = Math.floor(Math.random() * theString.length);
    return theString[choice];
}

/* EXPORTS */
module.exports = {
    mimsyVerify: function(message) {
        var regExKey = new RegExp("(^\/\/.*)|(^.{0,4}$)");
        var regExpTest = regExKey.test(message) ? true : false;
        if (regExpTest == false) {
            return (true);
        }
    },

    formatDate: function(value) {
        return value.getMonth() + 1 + "/" + value.getDate() + "/" + value.getYear();
    },
    /*
        getUserFromString: function(userReason) {
                var regExKey = new RegExp("^<@(d{15,18})>");
                return RegExp.lastMatch('`'+user+'`:'+Reason);
        }client.users.get("id", "USERNAMEHERE"); */
    randomFlowerUnicode: function() {
        var theArray = ['🌻', '🌺', '🌷', '🌹', '💐', '🌸', '🌼', '💠'];
        var choice = Math.floor(Math.random() * theArray.length);
        var myMessage = theArray[choice].toLowerCase();
        return myMessage + " ";
    },
    randomFlowerShortcut: function() {
        var theArray = ['\uD83C\uDF3B', '\uD83C\uDF3A', '\uD83C\uDF37', '\uD83C\uDF39', '\uD83D\uDC90', '\uD83C\uDF38', '\uD83C\uDF3C', '\uD83D\uDCA0', '\uD83D\uDCAE'];
        var choice = Math.floor(Math.random() * theArray.length);
        var myMessage = theArray[choice].toLowerCase();
        return myMessage + "";
    },
    randomEmojiShortcut: function() {
        var theArray = ['\u2665', '\uD83C\uDF4E', '\uD83C\uDF6D', '\uD83C\uDFB7', '\uD83D\uDE00', '\uD83D\uDE03', '\uD83D\uDC4B', '\u270C', '\uD83D\uDC41', '\uD83D\uDCA9', '\uD83C\uDF44'];
        var choice = Math.floor(Math.random() * theArray.length);
        var myMessage = theArray[choice].toLowerCase();
        return myMessage + "";
    },
    randomAnimalShortcut: function() {
        var theArray = ['\uD83D\uDC38', '\uD83E\uDD81', '\uD83D\uDC2F', '\uD83D\uDC28', '\uD83D\uDC3C', '\uD83D\uDC3B', '\uD83D\uDC30', '\uD83D\uDC39', '\uD83D\uDC14', '\uD83D\uDC27', '\uD83D\uDC24', '\uD83D\uDC25', '\uD83D\uDC1C', '\uD83D\uDC1E', '\uD83D\uDC1B', '\uD83D\uDC1D', '\uD83D\uDC20', '\uD83D\uDC1F', '\uD83D\uDC21', '\uD83D\uDC2C', '\uD83D\uDC33', '\uD83D\uDC0B', '\uD83D\uDC0A', '\uD83D\uDC06', '\uD83D\uDC05', '\uD83D\uDC03', '\uD83D\uDC22', '\uD83D\uDC07', '\uD83D\uDC18', '\uD83D\uDC13', '\uD83D\uDC0C', '\uD83D\uDC1D'];
        var choice = Math.floor(Math.random() * theArray.length);
        var myMessage = theArray[choice].toLowerCase();
        return myMessage + "";
    },
    randomFoodShortcut: function() {
        var theArray = ['\u2665', '\uD83C\uDF4E', '\uD83C\uDF54'];
        var choice = Math.floor(Math.random() * theArray.length);
        var myMessage = theArray[choice].toLowerCase();
        return myMessage + "";
    },
    randomSummonMessage: function() {
        var theArray = ['BUNGEE', 'HELLO', 'JUMP1', 'SURPRISE', 'SURPRISE', 'JUMP2', 'HELLO', 'HELLO'];
        var choice = Math.floor(Math.random() * theArray.length);
        var myMessage = theArray[choice].toLowerCase();
        return myMessage;
    },
    randomDismissMessage: function() {
        var theArray = ['BORING', 'BYEBYE', 'JUMP2', 'OUCH', 'RUNAWAY', 'YOULLREGRETTHAT'];
        var choice = Math.floor(Math.random() * theArray.length);
        var myMessage = theArray[choice].toLowerCase();
        return myMessage;
    },
    randomVideoURL: function() {
        return ("https://www.youtube.com/watch?v=" + randomVideoID())
    },
    pong: function() {
        var pongs = ['bang!', 'pong pong', 'poNg', 'PonG!', 'Pong!!!', 'pOng!', 'Pong!', 'Pong!', 'Pong!', 'pOong..', 'Stop pinging your paper balls in my direction!'];
        var choice = Math.floor(Math.random() * pongs.length);
        var myMessage = pongs[choice];
        return myMessage;
    },
    spongeMemify: function(text) {
        return spongeMeme(text);
    },
    filter: function(text) {
        var A_array = ['a', 'A'];
        var B_array = ['b', 'B'];
        var C_array = ['c', 'C'];
        var D_array = ['d', 'D'];
        var E_array = ['e', 'E'];
        var F_array = ['f', 'F'];
        var G_array = ['g', 'G'];
        var H_array = ['h', 'H', 'hh'];
        var I_array = ['i', 'I'];
        var J_array = ['j', 'J'];
        var K_array = ['k', 'K'];
        var L_array = ['l', 'L'];
        var M_array = ['m', 'M'];
        var N_array = ['n', 'N'];
        var O_array = ['o', 'O', 'Ω'];
        var P_array = ['p', 'P'];
        var Q_array = ['q', 'Q'];
        var R_array = ['r', 'R'];
        var S_array = ['s', 'S'];
        var T_array = ['t', 'T'];
        var U_array = ['u', 'U'];
        var V_array = ['v', 'V'];
        var W_array = ['w', 'W'];
        var X_array = ['x', 'X'];
        var Y_array = ['y', 'Y'];
        var Z_array = ['z', 'Z'];
        return "Sorry, not available right now!";
    },
    encodeUTF: function encode_utf8(s) {
        console.log(unescape(encodeURIComponent(s)))
        return unescape(encodeURIComponent(s));
    },
    decodeUTF: function decode_utf8(s) {
        console.log(decodeURIComponent(escape(s)))
        return decodeURIComponent(escape(s));
    },
    iAmNotABot: function() {
        var choice = Math.floor(Math.random() * 11);
        var reply = ['I am not a bot :/', 'ME NOT ROBOT', 'At least I am better at maths!', 'You smell.', 'ROBOT I AM NOT!', 'What a delightful accusation!', 'You are the bot!', 'I am bot a NOT', 'boopity beep...', 'beep boop', 'Prove it!'];
        var myMessage = reply[choice];
        return myMessage;
    },

    containsIceCream: function(text) {
        var regExKey = new RegExp("ice cream");
        var test = regExKey.test(text) ? "true" : "false";
        return test;
    },
    containsFlower: function(text) {
        var regExKey = new RegExp("flower");
        var test = regExKey.test(text) ? "true" : "false";
        return test;
    },
    containsHello: function(message) {
        var regExKey = new RegExp("^(h((ay)|(ola)|(ello)|i))|(ay{1,10}e)");
        var regExpTest = regExKey.test(message) ? true : false;
        return regExpTest;
    },
    containsPannekoek: function(message) {
        var regExKey = new RegExp("pannen?(koek(en)?)");
        var regExpTest = regExKey.test(message) ? true : false;
        return regExpTest;
    },
    containsBlockMimsy: function(message) {
        var regExKey = new RegExp("(mimsy.*(block))|(block.*(mimsy))");
        var regExpTest = regExKey.test(message) ? true : false;
        return regExpTest;
    },
    containsLezTag: function(message) { //238825468864888833
        var regExKey = new RegExp("(238825468864888833)");
        var regExpTest = regExKey.test(message) ? true : false;
        return regExpTest;
    },
    tellMeAboutYou: function(text) {
        var regExKey = new RegExp("(mimsy.*(about))|(about.*(mimsy))");
        var test = regExKey.test(text) ? "true" : "false";
        return test;
    },
    getUserTag: function(text) {
        var args = text.trim().split(/ +/g);
        var regExKey = new RegExp("\\S*#[0-9]{4}");
        for (var i = 0; i < args.length; i++) {
            if (regExKey.test(args[i])) {
                return args[i];
            }
        }
    },
    //(http:|https:)?\/\/(www\.)?(youtube\.com|youtu\.be)\/(watch)?(\?v=)?(\S+)?
    //(http:|https:)?//(www.)?(youtube.com|youtu.be)/(watch)?(?v=)?(S+)?
    //
    containsYoutube: function(text) {
        var regExKey = new RegExp("(www\.)?(youtube\.com|youtu\.be)");
        var test = regExKey.test(text) ? true : false;
        return test;
    },
    allowedYoutube: function(channelID, allowedIDList) {
        for (i = 0; i < allowedID.length; i++) {
            if (channelID == allowedIDList[i]) {
                return true;
                console.log("the video doesn't belong to channel");
            }
        }
        return false;
        console.log("the video does belong to channel");
    },
    areYouBot: function(text) {
        var regExKey = new RegExp("((|is|are)(you|mimsy)(|'re).*(bot))");
        var test = regExKey.test(text) ? "true" : "false";
        return test;
    },
    isValidString: function(text) {
        var regExKey = new RegExp("(.+)");
        var test = regExKey.test(text) ? true : false;
        return test;
    },
    isEven: function(n) {
        n = Number(n);
        return n === 0 || !!(n && !(n % 2));
    },

    isOdd: function(n) {
        return isEven(Number(n) + 1);
    },
    replaceInWord: function(word, toBeReplaced, replacer) {
        var ret = "";
        for (var i = 0; i < word.length; i++) {
            if (word[i] == toBeReplaced) {
                ret += replacer;
            } else {
                ret += word[i];
            }
        }
        return ret
    },
    shouldReact: function(channelID, stringy) {
        if (channelID == 414497480928133120) {
            return false
        }
        var choice = Math.floor(Math.random() * 99)
        if (choice <= 2) {
            return true
        }
        return false;
    },
    makeMimsyReact: function(stringy, talker) {
        var choice = Math.ceil(Math.random() * 10);
        if (choice < 4) { return "<:mockbob:378998241787641866>" + spongeMeme(stringy) + " <:mockbob:378998241787641866>"; }
        if ((choice >= 4) && (choice <= 5)) { return "GENIUS! ☝☝☝"; }
        if ((choice == 6)) { return randomInsult(talker); }
        if ((choice > 6) && (choice <= 8)) { return randomStatement() }
        if (choice == 9) { return "Interesting.."; }
        if (choice == 10) { return "lol..."; }
    },
    randomInsult: function(input) {
        return randomInsult(input);
    },
    getRandomHEXColor: function() {
        var letters = '0123456789ABCDEF';
        var color = '#';
        for (var i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * letters.length)];
        }
        return color;
    },
    getRandomColor: function() {
        var letters = '0123456789';
        var color = '';
        for (var i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * letters.length)];
        }
        return color;
    }
}