const express = require('express')
const router = express.Router()
const Playlist = require('../../models/Playlist')
const LoginSession = require('../../models/LoginSession')
const RegisteredUser = require('../../models/RegisteredUser')
const cors = require('cors')
const ObjectId = require('mongoose').Types.ObjectId; 

//api call to remove a playlist from the database
router.use(cors())

router.post('/removeplaylist', (req, res, next)=> {
    res.setHeader('Content-Type', 'application/json');
    const { body } = req
    const {
        userid,
        token,
        playlistid
    } = body
   
    //verify that the account who is making that call is logged in 
    LoginSession.find({
        _id : ObjectId(token), 
        userId : userid,
        exists : true
    }, (err1,  validSession) => {
            if (err1){
                return res.send({
                    message : 'Server error: ' + err1,
                    success : false
                })
            } 
            // validsession would be empty if the user is not logged in
            if (validSession.length < 1) {
                return res.send({
                    message : 'USER: Error, you need to be logged in to do that',
                    success : false
                })
            } else {
                /**
                 * the user is logged in and exists. 
                 * - find the user in the database
                 */
                RegisteredUser.update({
                    _id : ObjectId(userid)
                },
                // pull the playlist which matched the id from the array 
                { $pull: { playlists: { _id : ObjectId(playlistid)} }},
                (err2) => {
                    if (err2){
                        return res.send({
                            message : 'Erro occured: ' + err2,
                            success : false
                        })
                    }
                })
                return res.send({
                    message : 'Playlist successfully removed',
                    success : true
                })       
            }  
        }
    )
})


module.exports = router
