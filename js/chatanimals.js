var nb = 10;
module.exports = {
    Dog: function() {
        var message = "🐶\n";
        for (var i = 0; i < 0; i++) {
            message += " | |\n";
        }
        message += " /.\........./\n";
        message += " | |----| |\n";
        message += " ^^      ^^\n";
        return message;
    },
    Giraffe: function(nb) {
        if (nb > 40) { nb = 1 }
        if (nb < 0) { nb = 1 }
        var message = "<:trollshamel:377086697004990474>\n";
        for (var i = 0; i < nb; i++) {
            message += " | |\n";
        }
        message += " | |.........../\n";
        message += " | |----| |\n";
        message += " ^^      ^^\n";
        return message;
    }


};