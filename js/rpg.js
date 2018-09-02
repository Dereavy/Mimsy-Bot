var Dictionary = {
    "food": ["Golden Carrot", "Golden Apple", "Cooked Porkchop", "Steak", "Cooked Mutton", "Cooked Salmon", "Spider Eye", "Cooked Chicken", "Cooked Rabbit", "Rabbit Stew", "Mushroom Stew", "Bread", "Cooked Fish", "Carrot", "Potato", "Baked Potato", "Poisonous Potato", "Beetroot", "Beetroot Soup", "Pumpkin Pie", "Apple", "Raw Beef", "Raw Porkchop", "Raw Mutton", "Raw Chicken", "Raw Rabbit", "Melon", "Chorus Fruit", "Cake", "Cookie", "Rotten Flesh", "Clownfish", "Pufferfish", "Raw Salmon", "Fish and Chips", "Pancake", "Cheeseburger", "Roast Beef", "French Fries", "Chocolate Mousse", "Burger", "Caesar Salad", "Pasta"],
    "biomes": ["Ocean", "Plains", "Desert", "Extreme Hills", "Forest", "Taiga", "Swampland", "River", "Nether", "The End", "Frozen Ocean", "Frozen River", "Ice Plains", "Ice Mountains", "Mushroom Island Shore", "Beach", "Desert Hills", "Forest Hills", "Taiga Hills", "Extreme Hills Edge", "Jungle", "Jungle Hills", "Jungle Edge", "Deep Ocean", "Stone Beach", "Cold Beach", "Birch Forest", "Birch Forest Hills", "Roofed Forest", "Cold Taiga", "Cold Taiga Hills", "Mega Taiga", "Mega Taiga Hills", "Savanna", "Savanna Plateau", "Mesa", "Mesa Plateau", "The Void", "Sunflower Plains", "Flower Forest", "Ice Plains Spikes", "Mega Spruce Taiga"],
    "armor": ["Leather Cap", "Leather Leggings", "Leather Chestplate", "Leather Boots", "Gold Helmet", "Gold Leggings", "Gold Chestplate", "Gold Boots", "Iron Helmet", "Iron Leggings", "Iron Chestplate", "Iron Boots", "Diamond Helmet", "Diamond Leggings", "Diamond Chestplate", "Diamond Boots"],
    "weapons": ["Wood Sword", "Wood Axe", "Wood Hoe", "Wood Pickaxe", "Wood Spade", "Gold Sword", "Gold Axe", "Gold Hoe", "Gold Pickaxe", "Gold Spade", "Stone Sword", "Stone Axe", "Stone Hoe", "Stone Pickaxe", "Stone Spade", "Iron Sword", "Iron Axe", "Iron Hoe", "Iron Pickaxe", "Iron Spade", "Diamond Sword", "Diamond Axe", "Diamond Hoe", "Diamond Pickaxe", "Diamond Spade"],
    "games": ["EggWars", "SkyWars", "BedWars", "CakeWars", "Survival Games", "Hunger Games", "PvP", "Minerware", "Tower Defence", "Parkour", "Archer Assault", "Survival", "Creative", "Factions", "Bingo", "Ultra Hardcore", "Lucky Islands", "Infection", "Spleef", "Hide and Seek", "The Walls", "Build Battle", "Warlords", "Football", "Draw My Thing", "Super Smash Bros", "Capture the Flag", "Control Point", "Skyblock", "Prison"],
    "status effects": ["Absorption Effect", "Bad Luck", "Blindness", "Fire Resistance", "Glowing Effect", "Haste", "Health Boost", "Hunger", "Instant Damage", "Instant Health", "Invisibility", "Jump Boost", "Levitation", "Luck", "Mining Fatigue", "Nausea", "Night Vision", "Poison", "Regeneration", "Resistance", "Saturation", "Slowness", "Speed", "Strength", "Water Breathing", "Weakness", "Wither"],
    "mobs": ["Bat", "Chicken", "Cow", "Donkey", "Horse", "Mooshroom", "Ocelot", "Parrot", "Pig", "Rabbit", "Sheep", "Skeleton Horse", "Squid", "Villager", "Cave Spider", "Enderman", "Iron Golem", "Llama", "Polar Bear", "Spider", "Wolf", "dolphin", "Zombie Pigmen", "Blaze", "Chicken Jockey", "Creeper", "Elder Guardian", "Endermite", "Evoker", "Ghast", "Guardian", "Magma Cube", "Shulker", "Silverfish", "Skeleton", "Skeleton Horseman", "Slime", "Spider Jockey", "Stray", "Vex", "Vindicator", "Witch", "Wither Skeleton", "Zombie", "Zombie Villager", "Iron Golem", "Snow Golem", "Duck", "Goose", "Beaver", "Moose", "Fox", "Fish", "Octopus", "Whale", "Stick Insect", "Penguin", 'Pig', 'Gorilla', 'Cat', 'Chipmunk', 'Snake', 'Dog', 'Chicken', 'Lemur', 'Sloth', 'Monkey', 'Bear', 'Lizard', 'Dragon', 'Human', 'Goose', 'Worm', 'Crab'],
    "instruments": ["Saxophone", "Basse", "Violin", "Piano", "Guitar", "Trombone", "Trumpet", "Gong", "Bell", "Triangle", "Cello", "Electric Guitar", "Harp", "Clarinet", "Flute", "Tuba", "Xylophone"],
    "vehicles": ["Car", "Bus", "Train", "Boat", "Jet", "Shopping Trolley", "Plane", "Aeroplane", "Jetski", "Submarine", "Hang Glider", "Wingsuit", "Space Rocket", "Dune Buggy", "Bike", "Skateboard"],
    "inventions": ["Wheel", "Lighter", "LASER", "Android", "Computer", "Monitor", "Candle", "Sundial", "Catapult", "Clock", "Mechanical Clock", "Walkman", "Macintosh", "Record Player", "Radio", "Camera", "Camcorder", "Calculator", "Game Boy", "Typewriter", "GPS", "Answering Machine", "DVD Player", "PlayStation", "Thermostat", "Segway"],
    "countries": ["France", "Netherlands", "Germany", "Switzerland", "America", "Canada", "United Kingdom", "England", "Scotland", "Ireland", "Wales", "Spain"],
    "events": ["Tornado", "Sunrise", "Sunset", "Storm", "Sandstorm", "Tsunami", "Heatwave", "Eclipse", "Flood", "Low Tide", "High Tide", "Earthquake"],
    "items": ["Shell", "Pebble", "Pinecone", "SeaWeed", "Log", "Fossil", "Cool Mineral", "Heavy Stone", "Stick", "Bag of salt", "Gold coin", "Water bottle", "Door handle"],
    "temperaments": ['Angry', 'Soulless', 'Happy', 'Spiteful', 'Confused', 'Proud', 'Victorious', 'Evil', 'Grumpy', 'Focussed', 'Fast-thinking', 'Talkative', 'Noisy', 'Quiet', 'Shy', 'Heroic', 'Dumb', 'Smart', 'Cheerful', 'Funny', 'Cold-hearted', 'Wholesome', 'Lone', 'Sneaky', 'Heavy-footed', 'Confident']
};
/* Hangmman random word example function
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
*/
function getWordFromCategory(category) {
    var categoryList = Object.keys(Dictionary);
    var categoryIndex = 0;
    categoryList.forEach(categoryName => {
        if (categoryName == category) {
            catIndex = Number(categoryIndex);
        }
        categoryIndex++;
    });
    wordIndex = Math.floor(Math.random() * Object.values(Dictionary)[catIndex].length);
    var word = Object.values(Dictionary)[catIndex][wordIndex];
    return word;
}

function getRandomItem() {
    itemList = Array("food", "instruments", "inventions", "items");
    return getWordFromCategory(itemList[Math.floor(Math.random() * itemList.length)]);
}

function getRandomInventory(size) {
    var inventory = "";
    for (i = 0; i < size; i++) {
        inventory += getRandomItem() + ", ";
    }
    return inventory;
}

function getArmorSet(size) {
    var inventory = ""
    for (i = 0; i < size; i++) {
        inventory += getWordFromCategory("armor") + ", ";
    }
    return inventory;
}

function getSkill() {
    probability = (Math.round(Math.random() * 100));
    if (probability >= 60) {
        var sign = "-";
    } else {
        var sign = "+";
    }
    return sign + (Math.round(Math.random() * 5)) + " " + getWordFromCategory("status effects") + ", ";
}

module.exports = {
    getWordFromCategory: function(category) {
        return getWordFromCategory(category);
    },
    generateCharacter: function(player) {
        character = getWordFromCategory("temperaments") + " " + getWordFromCategory("mobs");
        vehicle = getWordFromCategory("vehicles");
        pet = getWordFromCategory("temperaments") + " " + getWordFromCategory("mobs");
        armor = getArmorSet(3);
        weapon = getWordFromCategory("weapons");
        inventory = getRandomInventory(3);
        var msg = "A new character joined the game: @" + player + "\n```";
        msg += "Character: " + character + "\n";
        msg += "Armor: " + armor + "\n";
        msg += "Weapon: " + weapon + "\n";
        msg += "Inventory: " + inventory + "\n";
        msg += "Skill:" + getSkill() + "\n";
        msg += "Skill:" + getSkill() + "\n";
        msg += "Skill:" + getSkill() + "\n";
        msg += "\n```";
        return msg;
    }
}