/* EXPORTS */

const sql = require("sqlite");
const config = require('../js/config.js');

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
    }

    /** HANGMAN */

}