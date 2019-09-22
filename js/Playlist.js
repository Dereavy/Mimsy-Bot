// Adapted version of this repository for the music bot :
// https://github.com/DevYukine/Music-Bot/blob/master/MusicBot.js
// https://gabrieltanner.org/blog/dicord-music-bot

const YouTube = require('simple-youtube-api');
const ytdl = require('ytdl-core');
const config = require('../js/config.js');

const ytQueue = new Map();

const youtube = new YouTube(config.get.youtubeAPIKEY);

let args = '';
let searchString = '';
let url = '';
let serverQueue = null;

async function updateConstants(msg) {
    args = msg.content.split(' ');
    searchString = args.slice(1).join(' ');
    url = args[1] ? args[1].replace(/<(.+)>/g, '$1') : '';
    serverQueue = ytQueue.get(msg.guild.id);
}
async function verify(msg) {
    const voiceChannel = msg.member.voiceChannel;
    if (!voiceChannel) return msg.channel.send('I\'m sorry but you need to be in a voice channel to play music!');
    const permissions = voiceChannel.permissionsFor(msg.client.user);
    if (!permissions.has('CONNECT')) {
        return msg.channel.send('I cannot connect to your voice channel, make sure I have the proper permissions!');
    }
    if (!permissions.has('SPEAK')) {
        return msg.channel.send('I cannot speak in this voice channel, make sure I have the proper permissions!');
    }
}
async function ytPlay(msg) {
    await updateConstants(msg)
    verify(msg)
    voiceChannel = msg.member.voiceChannel;
    if (url.match(/^https?:\/\/(www.youtube.com|youtube.com)\/playlist(.*)$/)) {
        console.log("url matches and playlist was found.");

        const playlist = await youtube.getPlaylist(url);
        const videos = await playlist.getVideos();

        for (const video of Object.values(videos)) {
            const video2 = await youtube.getVideoByID(video.id); // eslint-disable-line no-await-in-loop
            await handleVideo(video2, msg, voiceChannel, true); // eslint-disable-line no-await-in-loop
        }
        return msg.channel.send(`✅ Playlist: **${playlist.title}** has been added to the ytQueue!`);
    } else {
        try {
            console.log("no playlist found matching regex, getting video");
            var video = await youtube.getVideo(url);
            console.log("video: ", video);
        } catch (error) {
            try {
                console.log("attempting yt search...");
                var videos = await youtube.searchVideos(searchString, config.get.songSelectionSize);
                let index = 0;
                msg.channel.send(`
__**Song selection:**__
${videos.map(video2 => `**${++index} -** ${video2.title}`).join('\n')}
Please provide a value to select one of the search results ranging from 1-10.
                `);
                // eslint-disable-next-line max-depth
                try {
                    var response = await msg.channel.awaitMessages(msg2 => msg2.content > 0 && msg2.content < config.get.songSelectionSize+1, {
                        maxMatches: 1,
                        time: 10000,
                        errors: ['time']
                    });
                } catch (err) {
                    console.error(err);
                    return msg.channel.send('No or invalid value entered, cancelling video selection.');
                }
                const videoIndex = parseInt(response.first().content);
                console.log("Getting videoIndex: "+ videoIndex+", awaiting youtube get video...");
                var video = await youtube.getVideoByID(videos[videoIndex - 1].id);
                console.log("Got video: ",video.id);
                console.log(video.id, msg.id, voiceChannel.id);
                return handleVideo(video, msg, voiceChannel);
            } catch (err) {
                console.error(err);
                return msg.channel.send('I could not obtain any search results.');
            }
        }
        console.log(video.id, msg.id, voiceChannel.id);
        return handleVideo(video, msg, voiceChannel);
    }
}
async function skip(msg){
    await updateConstants(msg)
    if (!msg.member.voiceChannel) return msg.channel.send('You are not in a voice channel!');
    if (!serverQueue) return msg.channel.send('There is nothing playing that I could skip for you.');
    serverQueue.connection.dispatcher.end('Skip command has been used!');
    return undefined;
}
async function stop(msg){
    await updateConstants(msg)
    if (!msg.member.voiceChannel) return msg.channel.send('You are not in a voice channel!');
    if (!serverQueue) return msg.channel.send('There is nothing playing that I could stop for you.');
    serverQueue.songs = [];
    serverQueue.connection.dispatcher.end('Stop command has been used!');
    return undefined;
}
async function volume(msg){
    await updateConstants(msg)
    if (!msg.member.voiceChannel) return msg.channel.send('You are not in a voice channel!');
    if (!serverQueue) return msg.channel.send('There is nothing playing.');
    if (!args[1]) return msg.channel.send(`The current volume is: **${serverQueue.volume}**`);
    serverQueue.volume = args[1];
    serverQueue.connection.dispatcher.setVolumeLogarithmic(args[1] / 5);
    return msg.channel.send(`I set the volume to: **${args[1]}**`);
}

async function np(msg){
    await updateConstants(msg)
    if (!serverQueue) return msg.channel.send('There is nothing playing.');
    return msg.channel.send(`🎶 Now playing: **${serverQueue.songs[0].title}**`);
}

async function fnQueue(msg){
    await updateConstants(msg)
    if (!serverQueue) return msg.channel.send('There is nothing playing.');
    return msg.channel.send(`
__**Song ytQueue:**__
${serverQueue.songs.map(song => `**-** ${song.title}`).join('\n')}
**Now playing:** ${serverQueue.songs[0].title}
    `);
}
async function pause(msg){
    await updateConstants(msg)
    if (serverQueue && serverQueue.playing) {
        serverQueue.playing = false;
        serverQueue.connection.dispatcher.pause();
        return msg.channel.send('⏸ Paused the music for you!');
    }
    return msg.channel.send('There is nothing playing.');
}

async function resume(msg){
    await updateConstants(msg)
    if (serverQueue && !serverQueue.playing) {
        serverQueue.playing = true;
        serverQueue.connection.dispatcher.resume();
        return msg.channel.send('▶ Resumed the music for you!');
    }
    return msg.channel.send('There is nothing playing.');
}

async function handleVideo(video, msg, voiceChannel, playlist = false) {
    const serverQueue = ytQueue.get(msg.guild.id);
    
    const song = {
        id: video.id,
        title: video.title,
        url: `https://www.youtube.com/watch?v=${video.id}`
    };
    console.log("playing: "+song.url)
    if (!serverQueue) {
        console.log('no serverQueue, creating queueConstruct');
        const queueConstruct = {
            textChannel: msg.channel,
            voiceChannel: voiceChannel,
            connection: null,
            songs: [],
            volume: 5,
            playing: true
        };
        ytQueue.set(msg.guild.id, queueConstruct);

        queueConstruct.songs.push(song);

        try {
            console.log('Attempting to join voice channel', voiceChannel.id);
            var connection = await voiceChannel.join();
            queueConstruct.connection = connection;
            play(msg.guild, queueConstruct.songs[0]);
        } catch (error) {
            console.error(`I could not join the voice channel: ${error}`);
            ytQueue.delete(msg.guild.id);
            return msg.channel.send(`I could not join the voice channel: ${error}`);
        }
    } else {
        console.log("server queue exists");
        serverQueue.songs.push(song);
        if (playlist) return undefined;
        else return msg.channel.send(`✅ **${song.title}** has been added to the ytQueue!`);
    }
    console.log("returning undefined song")
    return undefined;
}

function play(guild, song) {
    const serverQueue = ytQueue.get(guild.id);

    if (!song) {
        serverQueue.voiceChannel.leave();
        ytQueue.delete(guild.id);
        return;
    }
    console.log(ytdl(song.url));
    const dispatcher = serverQueue.connection.playStream(ytdl(song.url))
        .on('end', reason => {
            if (reason === 'Stream is not generating quickly enough.') console.log('Song ended.');
            else console.log(reason);
            serverQueue.songs.shift();
            play(guild, serverQueue.songs[0]);
        })
        .on('error', error => console.error(error));
    dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);

    serverQueue.textChannel.send(`🎶 Start playing: **${song.title}**`);
}


module.exports = {
    play: function(msg){ytPlay(msg)},
    skip: function(msg){skip(msg)},
    stop: function(msg){stop(msg)},
    volume: function(msg){volume(msg)},
    np: function(msg){np(msg)},
    ytQueue: function(msg){fnQueue(msg)},
    pause: function(msg){pause(msg)},
    resume: function(msg){resume(msg)},
}