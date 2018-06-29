/* EXPORTS */

const sql = require("sqlite");
const config = require('../js/config.js');
const hangman = require('../js/Hangman.js');

function DBEncode(word) {
    var ret = "";
    for (var i = 0; i < word.length; i++) {
        if (word[i] == " ") {
            ret += "_";
        } else {
            ret += word[i];
        }
    }
    return ret
}

function DBDecode(word) {
    //console.log("[DEBUG] DBDecode(word) word:" + word);
    var ret = "";
    if (word == null) {
        return "No Hint available";
    }
    for (var i = 0; i < word.length; i++) {
        if (word[i] == "_") {
            ret += " ";
        } else {
            ret += word[i];
        }
    }

    return ret
}

function hangmanStart(messageAuthorID, channel) {
    var difficulty = config.get.hangmanDifficulty;
    var newWordGroup = hangman.randomWord();
    var word = newWordGroup[2].toLowerCase();
    var hint = newWordGroup[0].toLowerCase() + " " + newWordGroup[1].toLowerCase();
    hint = DBEncode(hint);
    word = DBEncode(word);
    sql.get(`SELECT * FROM hangman WHERE User_ID = "${messageAuthorID}"`).then(row => { //grab the row where the user id is the one I want
        if (!row) { // Can't find the row (New user).
            sql.run("INSERT INTO hangman (User_ID, Session_Status, Word, Guess_List, Hint, Difficulty, Total_Points) VALUES (?, ?, ?, ?, ?, ?, ?)", [messageAuthorID, true, word, "", hint, 2, 0]).then(
                //create new row for user with default values
                console.log("[DATABASE] Started first hangman game for " + messageAuthorID + " - Word: " + word + " - Hint: " + hint));
        } else { // Can find the row (Existing user).
            sql.run(`UPDATE hangman SET Session_Status = 1, Word = "` + word + `", Guess_List = "", Hint = "` + hint + `", Difficulty = 2 WHERE User_Id="` + messageAuthorID + `"`).then(
                //Update values for new game.
                console.log("[DATABASE] Started new hangman game for " + messageAuthorID + " - Word:\"" + word + "\" Hint:\"" + hint + "\""));
        }
        channel.send(hangman.getMessage(DBDecode(word), "", row.Difficulty));
    }).catch(err => { //If table doesn't exist create a new table
        sql.run("CREATE TABLE IF NOT EXISTS hangman (User_ID, Session_Status, Word, Guess_List, Hint, Difficulty, Total_Points)").then(() => {
            sql.run("INSERT INTO hangman (User_ID, Session_Status, Word, Guess_List, Hint, Difficulty, Total_Points) VALUES (?, ?, ?, ?, ?, ?, ?)", [messageAuthorID, true, word, "", hint, 2, 0]);
        });
        console.log("[DATABASE] Created hangman table for " + messageAuthorID + " - Word:\"" + word + "\" Hint:\"" + hint + "\"");
    });
}
module.exports = {

    /** MEDALS */
    addGoodBoi: function(userID, amount, channel) {
        var points = Number(amount);
        if (userID[0] == "!") {
            userID = userID.slice(1, userID.length - 1);
        }
        sql.get(`SELECT * FROM medals WHERE userId ="${userID}"`).then(row => {
            if (!row) {
                sql.run("INSERT INTO medals (userId, points) VALUES (?, ?)", [userID, points]);
                console.log(points + ' points added! (new row in existing table)');
            } else {
                sql.run(`UPDATE medals SET points = ${row.points + points} WHERE userId = ${userID}`);
                console.log(points + ' points added! (existing row in existing table)');
            }
        }).catch(() => {
            console.error;
            sql.run("CREATE TABLE IF NOT EXISTS medals (userId TEXT, points INTEGER)").then(() => {
                sql.run("INSERT INTO medals (userId, points) VALUES (?, ?)", [userID, points]);
                console.log(points + ' points added! (new table created)');
            });
        });
    },

    getGoodBoi: function(userID, channel) { //Gets score of user.
        //return new Promise((resolve, reject) => {
        sql.get(`SELECT * FROM medals WHERE userId ="${userID}"`).then(row => {
            if (!row) {
                console.log("No row, retrieving points of user" + userID + "anyways, retrieved:" + row.points);
                channel.send("<@" + userID + "> you have 0 " + config.get.points + "!");
                return 0;
            };
            //console.log("Retrieving points of user " + userID + " retrieved: " + row.points);
            channel.send("<@" + userID + "> you have " + row.points + " " + config.get.points + "!");
            return row.points;
        });
        //});
    },

    getBestBois: function(channel) { //Returns best bois!
        var sndMsg = "";
        sql.all('SELECT userId,points FROM medals ORDER BY points DESC LIMIT ' + config.get.TopPlayers).then(rows => {
            rows.forEach(function(brow) {
                sndMsg += "\n";
                sndMsg += '<@' + brow.userId + '> has ' + brow.points + " " + config.get.points;
                sndMsg += "\n\n";
                for (var i = 0; i < brow.points; i++) {
                    sndMsg += "<:medal:460520365026836501>";
                }
                sndMsg += "\n";
            })
            channel.send(sndMsg);
        });
    },

    getAllBois: function(channel) { //Returns best bois!
        var sndMsg = "";
        sql.all('SELECT userId,points FROM medals ORDER BY points DESC').then(rows => {
            rows.forEach(function(brow) {
                console.log(brow.userId + " - " + brow.points)
            })
        });
    },

    /** HANGMAN */

    hangmanStatus: function(messageAuthorID, channel) {
        sql.get(`SELECT * FROM hangman WHERE User_ID ="${messageAuthorID}"`).then(row => {
            if (!row) {
                return 0;
            };
            if (hangman.gameStatus(DBDecode(row.Word), DBDecode(row.Guess_List), row.Difficulty) == "ongoing") {
                channel.send(hangman.getMessage(DBDecode(row.Word), DBDecode(row.Guess_List), row.Difficulty));
            }
            if (hangman.gameStatus(DBDecode(row.Word), DBDecode(row.Guess_List), row.Difficulty) == "lose") {
                channel.send(hangman.getLoseMessage(channel, DBDecode(row.Word), DBDecode(row.Guess_List), row.Hint, row.Difficulty));
                //Do losey stuff here (nothing)
                hangmanStart(messageAuthorID, channel);
            }
            if (hangman.gameStatus(DBDecode(row.Word), DBDecode(row.Guess_List), row.Difficulty) == "win") {
                channel.send(hangman.getWinMessage(channel, DBDecode(row.Word), DBDecode(row.Hint), row.Total_Points));
                //Add points etc.. here.
                //console.log(DBDecode(row.Word));
                //console.log("" + hangman.getWordScore(DBDecode(row.Word)));
                hangmanStart(messageAuthorID, channel);
            }
            //console.log("[DATABASE] Hangman Status: " + row.User_ID + "|" + row.Session_Status + "|" + DBDecode(row.Word) + "|" + row.Guess_List + "|" + DBDecode(row.Hint) + "|" + row.Difficulty + "|" + row.Total_Points);
        });
    },
    //function startGame => creates new table for new users, resets table values for existing users (except Total_Points)
    hangmanStart: function(messageAuthorID, channel) { // (messageAuthorID is of type: "string", word  is of type: "string", hint is of type "string")
        var difficulty = config.get.hangmanDifficulty;
        var newWordGroup = hangman.randomWord();
        var word = newWordGroup[2].toLowerCase();
        var hint = newWordGroup[0].toLowerCase() + " " + newWordGroup[1].toLowerCase();
        hint = DBEncode(hint);
        word = DBEncode(word);
        sql.get(`SELECT * FROM hangman WHERE User_ID = "${messageAuthorID}"`).then(row => { //grab the row where the user id is the one I want
            if (!row) { // Can't find the row (New user).
                sql.run("INSERT INTO hangman (User_ID, Session_Status, Word, Guess_List, Hint, Difficulty, Total_Points) VALUES (?, ?, ?, ?, ?, ?, ?)", [messageAuthorID, true, word, "", hint, 2, 0]).then(
                    //create new row for user with default values
                    console.log("[DATABASE] Started first hangman game for " + messageAuthorID + " - Word: " + word + " - Hint: " + hint));
            } else { // Can find the row (Existing user).
                sql.run(`UPDATE hangman SET Session_Status = 1, Word = "` + word + `", Guess_List = "", Hint = "` + hint + `", Difficulty = 2 WHERE User_Id="` + messageAuthorID + `"`).then(
                    //Update values for new game.
                    console.log("[DATABASE] Started new hangman game for " + messageAuthorID + " - Word:\"" + word + "\" Hint:\"" + hint + "\""));
            }
            channel.send(hangman.getMessage(DBDecode(word), "", row.Difficulty));
        }).catch(err => { //If table doesn't exist create a new table
            sql.run("CREATE TABLE IF NOT EXISTS hangman (User_ID, Session_Status, Word, Guess_List, Hint, Difficulty, Total_Points)").then(() => {
                sql.run("INSERT INTO hangman (User_ID, Session_Status, Word, Guess_List, Hint, Difficulty, Total_Points) VALUES (?, ?, ?, ?, ?, ?, ?)", [messageAuthorID, true, word, "", hint, 2, 0]);
            });
            console.log("[DATABASE] Created hangman table for " + messageAuthorID + " - Word:\"" + word + "\" Hint:\"" + hint + "\"");
        });
    },

    hangmanGuess: function(messageAuthorID, channel, letter) {
        sql.get(`SELECT * FROM hangman WHERE User_ID = "${messageAuthorID}"`).then(row => {
            if (!row) {
                return 0;
            };
            if (hangman.isLetter(letter)) {
                // Add letter to guess list
                sql.run(`UPDATE hangman SET Guess_List = "` + row.Guess_List + letter + `" WHERE User_Id="` + messageAuthorID + `"`).then(
                    // Display with new guess:
                    sql.get(`SELECT * FROM hangman WHERE User_ID ="${messageAuthorID}"`).then(row => {
                        if (!row) {
                            return 0;
                        };
                        //console.log(hangman.gameStatus(DBDecode(row.Word), DBDecode(row.Guess_List), row.Difficulty));
                        if (hangman.gameStatus(DBDecode(row.Word), DBDecode(row.Guess_List), row.Difficulty) == "ongoing") {
                            channel.send(hangman.getMessage(DBDecode(row.Word), DBDecode(row.Guess_List), row.Difficulty));
                        }
                        if (hangman.gameStatus(DBDecode(row.Word), DBDecode(row.Guess_List), row.Difficulty) == "lose") {
                            channel.send(hangman.getLoseMessage(channel, DBDecode(row.Word), DBDecode(row.Guess_List), row.Hint, row.Difficulty));
                            //Do losey stuff here (nothing)
                            hangmanStart(messageAuthorID, channel);
                        }
                        if (hangman.gameStatus(DBDecode(row.Word), DBDecode(row.Guess_List), row.Difficulty) == "win") {
                            channel.send(hangman.getWinMessage(channel, DBDecode(row.Word), DBDecode(row.Hint), row.Total_Points));
                            //Add points etc.. here.
                            var points = hangman.getWordScore(DBDecode(row.Word));
                            var newPoints = (Number(points) + Number(row.Total_Points));
                            console.log(newPoints);
                            sql.run(`UPDATE hangman SET Total_Points = "` + newPoints + `" WHERE User_Id = "${messageAuthorID}"`);
                            hangmanStart(messageAuthorID, channel);
                        }
                        //console.log("[DATABASE] Hangman Status: " + row.User_ID + "|" + row.Session_Status + "|" + DBDecode(row.Word) + "|" + row.Guess_List + "|" + DBDecode(row.Hint) + "|" + row.Difficulty + "|" + row.Total_Points);
                    })
                    //channel.send(hangmanStatus(messageAuthorID, channel))
                );
            }
            //Add function to determine game over
        });
    },
    hangmanGetWord(messageAuthorID) {
        sql.get(`SELECT * FROM hangman WHERE User_Id = "${messageAuthorID}"`).then(row => {
            return row.Word;
        });
    },
    hangmanGetPoints: function(messageAuthorID, channel) {
        //return number of points user has.
        sql.get(`SELECT * FROM hangman WHERE User_Id = "${messageAuthorID}"`).then(row => {
            if (!row) {
                channel.send("You have 0 hangman points!");
            };
            channel.send("You have " + row.Total_Points + " hangman points!");
        });
    },

    hangmanAddPoints: function(messageAuthorID, channel, amount) {
        //Add points to user
    },

    hangmanRemPoints: function(messageAuthorID, channel, amount) {
        //Remove points from user
    }
}