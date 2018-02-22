var sounds = [
    "1-DamnSon.mp3",
    "2-FinishHim.mp3",
    "3-HeyListen.mp3",
    "4-I_like_what_you_got.wav",
    "5-In_bird_culture__this_is_considered.wav",
    "6-JOJOohnoo.mp3",
    "7-JOOJO.mp3",
    "8-OhBabyATriple.mp3",
    "9-OmaeWaMouShindeiru.wav",
    "10-PrepareToBeAstonished.mp3",
    "11-RiggityRekt.wav",
    "12-SadViolin.mp3",
    "13-thisissparta.swf.mp3",
    "14-JOJOTheme.mp3",
    "15-X Files Theme.mp3",
    "16-DunDunnDunnn.mp3",
    "17-SOMEBODY_TOUCHA_MY_SPAGHET.mp3",
    "18-WOW.mp3",
    "19-BOOMHeadshot.wav",
    "20-FailHorn.mp3",
    "21-SadTrombone.mp3",
    "22-Tada.mp3",
    "23-WhatchaSay.mp3"
];
var notes = {
    "c1": "q",
    "c1s": "w",
    "c2": "e",
    "d1": "r",
    "d1s": "t",
    "e1": "y",
    "f1": "u",
    "f1s": "i",
    "g1": "o",
    "g1s": "p",
    "a1": "a",
    "a1s": "s",
    "b1": "d"
}

function getKeyByValue(object, value) {
    return Object.keys(object).find(key => object[key] === value);
}
module.exports = {
    playSound: function(nb) {
        nb--;
        var message = sounds[nb];
        return message;
    },
    getTutorial: function() {
        var message = "**Soundboard controls**\n";
        message += "*Usage command* `sb <number>`:```\n";
        message += " |  1-  Damn Son!                     |\n";
        message += " |  2-  Finish Him!                   |\n";
        message += " |  3-  Hey! Listen!                  |\n";
        message += " |  4-  I Like What You Got!          |\n";
        message += " |  5-  In Bird Culture...            |\n";
        message += " |  6-  JOJO - OHNOOOOO!              |\n";
        message += " |  7-  JOOOOOOOJO!                   |\n";
        message += " |  8-  Oh Baby a Triple!             |\n";
        message += " |  9-  Omae Wa Mou Shindeiru         |\n";
        message += " |  10- Prepare to be astonished..    |\n";
        message += " |  11- Riggity Recked                |\n";
        message += " |  12- Sad Violin                    |\n";
        message += " |  13- This Is Sparta!               |\n";
        message += " |  14- JOJO Theme                    |\n";
        message += " |  15- X files Theme                 |\n";
        message += " |  16- Dun Dunn Dunnn!!              |\n";
        message += " |  17- SOMEBODY_TOUCHA_MY_SPAGHET    |\n";
        message += " |  18- WOW                           |\n";
        message += " |  19- BOOM!! Headshot!              |\n";
        message += " |  20- Fail Horn                     |\n";
        message += " |  21- Fail Trombone                 |\n";
        message += " |  22- Tada!                         |\n";
        message += " |  23- Whatcha Say                   |\n";
        message += "```";
        return message;
    },
    getPianoTutorial: function() {
        var message = "**How to use the piano in the soundboard**\n";
        message += "*Usage command: * `piano <tune>`:```\n";
        message += "The <tune> is made of different notes, write a line of characters from the first line of your keyboard + asd keys:\n";
        message += "```Keys used:\n ";
        message += "qwertyuiopasd\n";
        message += "```";
        return message;

    },
    playNote: function(letter) {
        var note = getKeyByValue(notes, letter)
        return note + ".wav";
    }


};