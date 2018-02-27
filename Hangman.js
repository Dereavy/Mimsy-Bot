/**
```
    ~ ~ ~ ~  H A N G M A N  ~ ~ ~ ~
   ______
   |    |
   |    O
   |   /|\ 
   |   / \
__/|\__       
            _ R _ _ C _ E
```
 **LETTERS :**  **A B D F G H I J K L M N P Q S T U V W X Y Z** 
 **                     ** *C E O R*
 
*/

var Dictionary = {
    "Minecraft": {
        "food": ["Golden Carrot", "Golden Apple", "Cooked Porkchop", "Steak", "Cooked Mutton", "Cooked Salmon", "Spider Eye", "Cooked Chicken", "Cooked Rabbit", "Rabbit Stew", "Mushroom Stew", "Bread", "Cooked Fish", "Carrot", "Potato", "Baked Potato", "Poisonous Potato", "Beetroot", "Beetroot Soup", "Pumpkin Pie", "Apple", "Raw Beef", "Raw Porkchop", "Raw Mutton", "Raw Chicken", "Raw Rabbit", "Melon", "Chorus Fruit", "Cake", "Cookie", "Rotten Flesh", "Clownfish", "Pufferfish", "Raw Salmon"],
        "biomes": ["Ocean", "Plains", "Desert", "Extreme Hills", "Forest", "Taiga", "Swampland", "River", "Nether", "The End", "Frozen Ocean", "Frozen River", "Ice Plains", "Ice Mountains", "Mushroom Island Shore", "Beach", "Desert Hills", "Forest Hills", "Taiga Hills", "Extreme Hills Edge", "Jungle", "Jungle Hills", "Jungle Edge", "Deep Ocean", "Stone Beach", "Cold Beach", "Birch Forest", "Birch Forest Hills", "Roofed Forest", "Cold Taiga", "Cold Taiga Hills", "Mega Taiga", "Mega Taiga Hills", "Savanna", "Savanna Plateau", "Mesa", "Mesa Plateau", "The Void", "Sunflower Plains", "Flower Forest", "Ice Plains Spikes", "Mega Spruce Taiga"],
        "tools and armor": ["Wood Sword", "Wood Axe", "Wood Hoe", "Wood Pickaxe", "Wood Spade", "Gold Sword", "Gold Axe", "Gold Hoe", "Gold Pickaxe", "Gold Spade", "Stone Sword", "Stone Axe", "Stone Hoe", "Stone Pickaxe", "Stone Spade", "Iron Sword", "Iron Axe", "Iron Hoe", "Iron Pickaxe", "Iron Spade", "Diamond Sword", "Diamond Axe", "Diamond Hoe", "Diamond Pickaxe", "Diamond Spade", "Leather Cap", "Leather Leggings", "Leather Chestplate", "Leather Boots", "Gold Helmet", "Gold Leggings", "Gold Chestplate", "Gold Boots", "Iron Helmet", "Iron Leggings", "Iron Chestplate", "Iron Boots", "Diamond Helmet", "Diamond Leggings", "Diamond Chestplate", "Diamond Boots"],
        "games": ["EggWars", "SkyWars", "BedWars", "CakeWars", "Survival Games", "Hunger Games", "PvP", "Minerware", "Tower Defence", "Parkour", "Archer Assault", "Survival", "Creative", "Factions", "Bingo", "Ultra Hardcore", "Lucky Islands", "Infection", "Spleef", "Hide and Seek", "The Walls", "Build Battle", "Warlords", "Football", "Draw My Thing", "Super Smash Bros", "Capture the Flag", "Control Point", "Skyblock", "Prison"],
        "status effects": ["Absorption Effect", "Bad Luck", "Blindness", "Fire Resistance", "Glowing Effect", "Haste", "Health Boost", "Hunger", "Instant Damage", "Instant Health", "Invisibility", "Jump Boost", "Levitation", "Luck", "Mining Fatigue", "Nausea", "Night Vision", "Poison", "Regeneration", "Resistance", "Saturation", "Slowness", "Speed", "Strength", "Water Breathing", "Weakness", "Wither"],
        "mobs": ["Bat", "Chicken", "Cow", "Donkey", "Horse", "Mooshroom", "Ocelot", "Parrot", "Pig", "Rabbit", "Sheep", "Skeleton Horse", "Squid", "Villager", "Cave Spider", "Enderman", "Iron Golem", "Llama", "Polar Bear", "Spider", "Wolf", "Zombie Pigmen", "Blaze", "Chicken Jockey", "Creeper", "Elder Guardian", "Endermite", "Evoker", "Ghast", "Guardian", "Husk", "Magma Cube", "Shulker", "Silverfish", "Skeleton", "Skeleton Horseman", "Slime", "Spider Jockey", "Stray", "Vex", "Vindicator", "Witch", "Wither Skeleton", "Zombie", "Zombie Villager", "Iron Golem", "Snow Golem"]
    },
    "Human": {
        "instruments": ["Saxophone", "Harp", "Basse", "Violin", "Piano", "Guitar", "Trombone", "Trumpet", "Gong", "Bell", "Triangle", "Cello", "Electric Guitar", "Harp", "Clarinet", "Flute", "Saxophone", "Tuba"],
        "travel": ["Car", "Bus", "Train", "Boat", "Jet", "Shopping Trolley", "Plane", "Aeroplane", "Jetski", "Submarine", "Hang Glider", "Wingsuit", "Space Rocket", "Dune Buggy", "Bike", "Skateboard"],
        "inventions": ["Wheel", "Android", "Computer", "Monitor", "Sundial", "Catapult", "Clock", "Mechanical Clock", "Walkman", "Macintosh", "Victrola Record Player", "Radio", "Camera", "Camcorder", "Calculator", "Game Boy", "Typewriter", "GPS", "Answering Machine", "DVD Player", "PlayStation", "Oculus Rift", "Thermostat", "Raspberry Pi", "Segway"],
        "countries": ["France", "Netherlands", "Germany", "Switzerland"]
    },
    "Natural world": {
        "events": ["Tornado", "Sunrise", "Sunset", "Storm", "Sandstorm", "Tsunami", "Heatwave", "Eclipse", "Flood", "Low Tide", "High Tide", "Earthquake"],
        "animals": ["Duck", "Goose", "Beaver", "Moose", "Fox"]

    }

};
var messageTitle = "    ~ ~ ~ ~  H A N G M A N  ~ ~ ~ ~\n";
var HangmanStages = [
    "\n\n\n\n\n_______\n", //1
    "\n\n\n\n\n__/|\\__\n", //2
    "\n\n\n\n   |\n__/|\\__\n", //3
    "\n\n\n   |\n   |\n__/|\\__\n", //4
    "\n\n   |\n   |\n   |\n__/|\\__\n", //5
    "\n   |\n   |\n   |\n   |\n__/|\\__\n", //6
    "   ______\n   |\n   |\n   |\n   |\n__/|\\__\n", //7
    "   ______\n   |    |\n   |\n   |\n   |\n__/|\\__\n", //8
    "   ______\n   |    |\n   |    O\n   |\n   |\n__/|\\__\n", //9
    "   ______\n   |    |\n   |    O\n   |    | \n   |\n__/|\\__\n", //10
    "   ______\n   |    |\n   |    O\n   |   /|\\\n   |\n__/|\\__\n", //11
    "   ______\n   |    |\n   |    O\n   |   /|\\                    ** GAME OVER **\n   |   / \\ \n__/|\\__\n", //12
];
var alphabet = "abcdefghijklmnopqrstuvwxyz";
var vowels = "aeiouy"
var guessList = "";

var Difficulty = {
    "easy": [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
    "medium": [0, 1, 2, 6, 7, 8, 9, 10, 11],
    "hard": [0, 2, 6, 8, 9, 10, 11],
    "intense": [0, 1, 5, 7, 11]
};

function randomWord() {
    //Generate random category
    var version = Math.floor(Math.random() * Object.keys(Dictionary).length);
    randomVersion = Object.values(Dictionary)[version];

    //Generate random sub-category from above category
    var category = Math.floor(Math.random() * Object.keys(randomVersion).length);
    randomCategory = Object.values(randomVersion)[category];
    //Generate random word from above sub-category
    hangmanWord = randomCategory[Math.floor(Math.random() * Object.keys(randomCategory).length)];

    randomVersionName = Object.keys(Dictionary)[version];
    randomCategoryName = Object.keys(randomVersion)[category];
    return [randomVersionName, randomCategoryName, hangmanWord];
}

// Functions
function letterInWord(word, letter) {
    for (var i = 0; i < word.length; i++) {
        if (word[i] == letter) {
            return true;
        }
    }
    return false;
}

function isLetter(letter) {
    if ((typeof letter == "string") && (letter.length == 1)) {
        for (var j = 0; j < alphabet.length; j++) {
            if (letter.toLowerCase() == alphabet[j]) {
                return true;
            }
        }
        return false;
    }
}

function isVowel(letter) {
    if (typeof letter == "string") {
        for (var i = 0; i < vowels.length; i++) {
            if (letter == vowels[i]) {
                return true;
            }
        }
        return false;
    }
}

function isWord(word) {
    if (typeof word == "string") {
        for (var i = 0; i < word.length; i++) {
            if (!(isLetter(word[i]))) {
                return false;
            }
        }
        return true;
    }
    return false;
}

function includesLetter(string, letter) {
    for (var j = 0; j < string.length; j++) {
        if (letter.toLowerCase() == string[j].toLowerCase()) { return true; }
    }
    return false;
}

function getUnique(word) {
    var uniq = "";
    for (var i = 0; i < word.length; i++) {
        if (includesLetter(uniq, word[i]) == false) {
            uniq += word[i]
        }
    }
    return uniq;
}

function capFormat(text) {
    var ret = "";
    for (var j = 0; j < text.length; j++) {
        ret += " " + text[j]
    }
    return ret.toUpperCase();
}

//Returns all letters of the alphabet but the ones in text.
function otherLetters(text) {
    var ret = "";
    for (var j = 0; j < alphabet.length; j++) {
        if (!includesLetter(text, alphabet[j])) {
            ret += alphabet[j]
        }
    }
    return ret;
}

function getBlankedWord(word, guessList) {
    var blankedWord = "            ";
    for (var i = 0; i < word.length; i++) {
        if (includesLetter(guessList.toLowerCase(), word[i].toLowerCase())) {
            blankedWord += " " + word[i].toUpperCase();
        } else {
            if (word[i] == " ") {
                blankedWord += "  ";
            } else {
                blankedWord += " _";
            }
        }
    }
    blankedWord += "\n";
    return blankedWord;
}
module.exports = {
    test: function() {

    },

    randomWord: function() {
        return randomWord();
    }, //Returns: array(Category, Sub-category, Word)

    getHint: function(randomWord) { /* requires word array generated by randomWord() */
        return "[Hint] The word theme is \"" + randomWord[0] + " " + randomWord[1] + "\"";
    },

    /** 
     * Check if guess is valid
     */
    isValid: function(guess) {
        if (isWord(guess)) {
            return true;
        }
        return false;
    },
    /* Executes a (deemed valid) guess
     *  USE:
     *     var word = Hangman.randomWord();
     *     return Hangman.guess(randomWord, letter);
     *     Returns => True/False
     *     True => triggers check to see if the game has finished.
     *     Increment the hangman stage automatically if a "wrong" letter is added to the guess list
     */
    guess: function(randomWord, guess) {
        if (letterInWord(randomWord[2], guess)) {
            return true;
        }
        return false;
    },
    getWordScore: function(word) {
        var score = 0;
        if (isWord(word)) {
            var uniq = getUnique(word);
            for (var i = 0; i < uniq.length; i++) {
                if (!isVowel(uniq[i])) {
                    score += 1;
                }
            }
            return score * 0.5;
        }
        return "\"" + word + "\" is not a word"
    },

    //word == "string"
    //guessList == "string"
    //mode == "intense", "hard", "medium", "easy"
    getMessage: function(word, guessList, mode) {

        // Get word with blanks
        var displayedWord = getBlankedWord(word, guessList);

        // Get hangman display
        //Array of hangman displays according to chosen difficulty:
        stages = Object.values(Difficulty)[Object.keys(Difficulty).indexOf(mode)];
        stageIndex = 0;
        for (var i = 0; i < guessList.length; i++) {
            if (!(includesLetter(word, guessList[i])) && (guessList[i] != " ")) { //If the letter in the guesslist is NOT in the word.
                if (stageIndex < stages.length - 1) {
                    stageIndex++;
                } else {
                    stageIndex = stages.length - 1;
                }
            }
            console.log(stageIndex);
        }
        console.log([stageIndex + ":" + stages[stageIndex]]);
        var displayHangman = HangmanStages[stages[stageIndex]];

        // Get used letters display 
        displayLetters = " **LETTERS :**     **" + capFormat(otherLetters(guessList)) + "** \n GUESSES :**   **  " + capFormat(guessList) + "    " + "\n"

        // Return message
        return "```" + messageTitle + displayHangman + displayedWord + "```" + displayLetters;
    }
};

// Make function to determine game status: "win"/"lose"/"ongoing" (input = (word, guessList, mode))
// Make function to display help message with arguments: [ hintCost, ...]
// Make function to display win message, takes in the word + points + difficulty as arguments

/*

object length: var size = Object.keys(myObj).length;

USER || Word ||Guesses    || Mode
Paul || Beef || ajfklsebf || Hard/Easy/Medium

!! hm A
=> Save the guess to the guesses.A
On Win, 

//"fish", "shell", "burger", "pancake", "bookshelf", "cheeseburger", "netherlands"


var mediumWords=[

]

*/