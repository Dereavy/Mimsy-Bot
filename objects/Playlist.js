function getYTID(youtubeLink) {
    var regExp = "/^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/";
    var match = youtubeLink.match(regExp);
    if (match && match[2].length == 11) {
        return match[2];
    } else {
        //error
    }
}

function isNumber(nb) {
    var regExp = "/^\d+$/";
    var match = nb.match(regExp);
    if (match) {
        return nb;
    } else {
        //error
    }
}

var playlist = {
    //PROPERTIES
    //Playlist ID
    identifier: "undefined",

    //Playlist Title
    title: "undefined",

    //Playlist Description
    description: "undefined",

    //Discord ID of author goes here
    author: "undefined",

    // Whether the playlist is public or not.
    isPublic: false,

    //List of songs as array in the form of youtube video IDs
    songs: [],

    //CONSTRUCTOR
    function Playlist(ID, Title, Description, Author, Public) {
        this.identifier = ID,
            this.title = Title,
            this.description = Description,
            this.author = Author,
            this.isPublic = Public,
    }
    //METHODS
    //Adds song to list. 
    addSong: function(youtubeLink) {
        this.songs.push(getYTID(youtubeLink));
    },
    //Remove a song from the playlist
    removeSong: function(ID) {
        for (var i = this.songs.length - 1; i >= 0; i--) {
            if (this.songs[i] === ID) {
                this.songs.splice(i, 1);
                console.log("Removed {songs[i]} from playlist {this.identifier}");
            }
        }
    },
    clearSongs: function() {
        this.songs = [];
    },
    //Get a song ID from the playlist
    getSong: function(nb) {
        if (isNumber(bn)) {
            return this.songs[nb]
        }
    },
    getSongs: function() {
        return this.songs;
    },
    getAuthor: function() {
        return this.author;
    },
    getID: function() {
        return this.identifier;
    },
    getDescription: function() {
        return this.description;
    },
    setDescription: function(desc) {
        this.description = desc;
    },
    getTitle: function() {
        return this.title;
    },
    setTitle: function(title) {
        this.title = title;
    },
    getPublicStatus: function() {
        return this.isPublic;
    },
    setPublicStatus: function(bool) {
        this.isPublic = bool;
    }

};