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
    "23-WhatchaSay.mp3",
    "24-SlowClap.wav",
    "25-cheer.mp3",
    "26-hi_my_name_is_Catrina.mp3",
    "27-NootNoot.mp3",
    "28-We_Need_Some_Chicken_Up_In_Here.mp3",
    "29-Leekspin.mp3",
    "30-Whats_gibby_thinking_about.mp3",
    "31-Normies_get_out.mp3",
    "32-That_was_legitness.mp3",
    "33-Im_A_Banana.mp3",
    "34-Fatality.mp3",
    "35-Burns_excellent.mp3",
    "36-Cuek.mp3",
    "37-lalalalala.mp3",
    "38-im_sexy_and_i_know_it.mp3",
    "39-mi3.mp3",
    "40-trollolol.mp3",
    "41-NotReallyFine.wav"
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
        message += " |  24- Slow Clap                     |\n";
        message += " |  25- Cheer                         |\n";
        message += " |  26- Hi my name is Catrina!        |\n";
        message += " |  27- NOOT NOOT!                    |\n";
        message += " |  28- We Need Some Chicken          |\n";
        message += " |  29- Leekspin                      |\n";
        message += " |  30- Whats gibby thinking about    |\n";
        message += " |  31- Normies get out               |\n";
        message += " |  32- That was legitness            |\n";
        message += " |  33- Im a banana                   |\n";
        message += " |  34- Fatality                      |\n";
        message += " |  35- Burns excellent               |\n";
        message += " |  36- Cuek!                         |\n";
        message += " |  37- Lalalalala                    |\n";
        message += " |  38-im_sexy_and_i_know_it          |\n";
        message += " |  39-mi3                            |\n";
        message += " |  40-trollolol                      |\n";
        message += " |  41-NotReallyFine                  |\n";
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