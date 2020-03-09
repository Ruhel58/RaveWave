const mongoose = require('mongoose')
const Schema = mongoose.Schema

// import schema for relational data (SongSchema)
const SongSchema = require('./Song')

// Schema for Playllist 
const PlaylistSchema = new Schema ({
    playlistName : {
        type : String,
        required : true
    },
    playlistOwner : {
        type : String,
        required : true
    },
    playlistSongs : {
        type : [SongSchema.schema],
        required : false
    }
});

const Playlist = mongoose.model('playlist', PlaylistSchema)
module.exports = Playlist
