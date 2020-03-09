const express = require('express')
const router = express.Router()
const Song = require('../../../models/Song')
const LoginSession = require('../../../models/LoginSession')
const RegisteredUser = require('../../../models/RegisteredUser')
const cors = require('cors')
const ObjectId = require('mongoose').Types.ObjectId; 

//api call to add a song to the database
router.use(cors())

router.post('/removesong', (req, res, next)=> {
    res.setHeader('Content-Type', 'application/json');
    const { body } = req
    const {
        userid,
        token,
        songid
    } = body

    //verify that the account who is making that call is logged in and an admin
    LoginSession.find({
        _id : ObjectId(token), 
        exists : true
    }, (err1,  validSession) => {
        if (err1){
            return res.send({
                message : 'Server error: ' + err1,
                success : false
            })
        } 
        if (validSession.length < 1) {
            return res.send({
                message : 'SES: Error, you have to be a system admin to do that',
                success : false
            })
        } else {
            RegisteredUser.find({
                _id : ObjectId(userid),
                status: "admin"
            }, (err2, validUser) => {
                if (err2){
                    return res.send({
                        message : 'Server error: ' + err2,
                        success : false
                    })
                } 

                if (validUser.length < 1){
                    return res.send({
                        message : 'USER: Error, you have to be a system admin to do that',
                        success : false
                    })
                } else {
                    // verify that the attributes are not empty
                    if (!songid) {
                        return res.send({
                            message : "Name of the song cannot be empty",
                            success : false
                        })
                    }
                    Song.deleteOne({
                        _id : ObjectId(songid),
                    }, (err3, result) =>{
                        
                        if (err3){
                            return res.send({
                                message : 'Error occured: ' + err3,
                                success : false
                            })
                        }
                        return res.send({
                            message : 'Song no longer exists in the database',
                            success : true
                        })
                    })
                    
                }
            })
        } 
    })
})

module.exports = router
