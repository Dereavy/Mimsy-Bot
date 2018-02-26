var guessList = "fhnlshflee";
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
        "instruments": ["Saxophone", "Harp", "Basse", "Violin", "Piano"],
        "travel": ["Car", "Bus", "Train", "Boat", "Jet", "Shopping Trolley", "Plane", "Aeroplane", "Jetski", "Submarine", "Hang Glider", "Wingsuit", "Space Rocket", "Dune Buggy"],
        "inventions": ["Wheel", "Android", "Computer", "Monitor", "Sundial", "Catapult", "Clock", "Mechanical Clock", "Walkman", "Macintosh", "Victrola Record Player", "Radio", "Camera", "Camcorder", "Calculator", "Game Boy", "Typewriter", "GPS", "Answering Machine", "DVD Player", "PlayStation", "Oculus Rift", "Thermostat", "Raspberry Pi", "Segway"],
        "countries": ["France", "Netherlands", "Germany", "Switzerland"]
    },
    "Natural world": {
        "events": ["Tornado", "Sunrise", "Sunset", "Storm", "Sandstorm", "Tsunami", "Heatwave", "Eclipse", "Flood", "Low Tide", "High Tide", "Earthquake"],
        "animals": ["Duck", "Goose", "Beaver", "Moose", "Fox"]

    }

};

var alphabet = "abcdefghijklmnopqrstuvwxyz";

// Get random word from Dictionary
function randomWord() {
    var version = Math.floor(Math.random() * Object.keys(Dictionary).length);
    randomVersion = Object.values(Dictionary)[version];
    randomVersionName = Object.keys(Dictionary)[version];
    var category = Math.floor(Math.random() * Object.keys(randomVersion).length);
    randomCategory = Object.values(randomVersion)[category];
    randomCategoryName = Object.keys(randomVersion)[category];
    hangmanWord = randomCategory[Math.floor(Math.random() * Object.keys(randomCategory).length)];
    return [randomVersionName, randomCategoryName, hangmanWord];
    //random version == randomWord()[0]
    //random category == randomWord()[1]
    //random item == randomWord()[2]
}
module.exports = {
    test: function() {
        var word = randomWord()
        return "The word theme is " + word[0] + " " + word[1] + " (" + word[2] + ")";
    },
    randomWord: function() {
        return randomWord();
    },
    getHint: function(randomWord) {
        return "[Hint] The word theme is " + word[0] + " " + word[1];
    }

    /*
    startGame: function() {
        this.guessList = "";
    }
    addGuessList: function(list) {
        this.guessList = list;
    },
    play: function(word, guess) {
        var mess
        for (var i = 0; i < word.length; i++) {
            if (word[i] == guess)
        }
    }
    */
};



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