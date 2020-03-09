const mongoose = require('mongoose')
const Schema = mongoose.Schema

// Schema for Song 
const SongSchema = new Schema ({
    name : {
        type : String,
        required : true
    },
    artist : {
        type : String,
        required : true
    },
    featuredArtists : {
        type : [String],
        required : false
    },
    albumName : {
        type: String,
        required: true
    },
    year : {
        type: Number,
        required: true
    },
    youtubeUrl : {
        type : String,
        required : false, 
        default : ''
    },
    spotifyUrl : {
        type : String,
        required : false,
        default : ''
    },
    googleMusicUrl : {
        type: String,
        required: false,
        default : ''
    },
    deezerUrl:{
        type:String,
        required: false,
        default : ''
    }
});

const Song = mongoose.model('song', SongSchema)
module.exports = Song