const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const Schema = mongoose.Schema

// import schema for relational data (playlist schema)
const PlaylistSchema =  require('./Playlist')
// Schema for Regiered User 
const RegisteredUserSchema = new Schema ({
    firstName : {
        type: String, 
        required : true
    },
    lastName : {
        type: String, 
        required : true
    },
    userName : {
        type: String, 
        required : true
    },
    password : {
        type: String,
        required : true
    },
    email : {
        type: String, 
        required : true
    },
    playlists : {
        type : [PlaylistSchema.schema],
        required : false
    },
    status : {
        type : String,
        required : true
    },

});


// hash the password 
RegisteredUserSchema.methods.generateHash = function(password){
    return bcrypt.hashSync(password, bcrypt.genSaltSync(7), null)
} 

// validate password with the encrypted version 
RegisteredUserSchema.methods.validPassword = function(password){
    return bcrypt.compareSync(password, this.password)
} 

const RegisteredUser = mongoose.model('registereduser', RegisteredUserSchema)
module.exports = RegisteredUser