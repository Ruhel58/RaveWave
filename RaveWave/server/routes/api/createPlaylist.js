const express = require('express')
const router = express.Router()
const Playlist = require('../../models/Playlist')
const LoginSession = require('../../models/LoginSession')
const RegisteredUser = require('../../models/RegisteredUser')
const cors = require('cors')
const ObjectId = require('mongoose').Types.ObjectId; 

//api call to add a song to the database
router.use(cors())

router.post('/createplaylist', (req, res, next)=> {
    res.setHeader('Content-Type', 'application/json');
    const { body } = req
    const {
        userid,
        token,
        playlistName
    } = body
   
    //verify that the account who is making that call is logged in 
    LoginSession.find({
        _id : ObjectId(token), 
        userId : userid,
        exists : true
    }, (err1,  validSession) => {
            if (err1){
                return res.send({
                    message : 'Server error: ' + err,
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
                 * the user is logged in and eists. 
                 * - find the user in the database
                 * - using the body, create an empty playlist and name it 
                 * - update the 'playlists' array in the user profile with the new empty playlist
                 */
                RegisteredUser.find({
                    _id : ObjectId(userid)

                }, (err2,  selectedUser) => {
                        const newPlaylist = new Playlist()
                        newPlaylist.playlistName = playlistName
                        newPlaylist.playlistOwner = selectedUser[0].userName

                        selectedUser[0].update(
                            {$push: {playlists: newPlaylist}},
                            {safe: true, new: true},
                            function(err, playlistArray) {
                                console.log(err);
                            } 
                        )
                        return res.send({
                            message : 'Playlist successfully created',
                            success : true
                        })
                    }
                )       
            }  
        }
    )
})


module.exports = router
