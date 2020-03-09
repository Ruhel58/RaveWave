const mongoose = require('mongoose')
const Schema = mongoose.Schema

// Schema for login session. 
// Each user will have a login session when they log in. Session deletes after signing out
const LoginSessionSchema = new Schema ({
    userId : {
        type : String,
        required : true, 
        default : ''
    },
    timestamp : {
        type : Date,
        required : true,
        default : Date.now()
    },
    exists : {
        type : Boolean,
        required : true,
        default : true
    }

});

const LoginSession = mongoose.model('loginSession', LoginSessionSchema)
module.exports = LoginSession