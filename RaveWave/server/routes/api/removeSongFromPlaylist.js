const express = require('express')
const router = express.Router()
const LoginSession = require('../../models/LoginSession')
const RegisteredUser = require('../../models/RegisteredUser')
const cors = require('cors')
const ObjectId = require('mongoose').Types.ObjectId; 

//api call to add a song to the database
router.use(cors())

router.post('/removefromplaylist', (req, res, next)=> {
    res.setHeader('Content-Type', 'application/json');
    const { body } = req
    const {
        userid,
        token,
        playlistid, 
        songid
    } = body

    //verify that the account who is making that call is logged in 
    LoginSession.find({
        _id : ObjectId(token), 
        exists : true
    }, (err1,  validSession) => {
        if (err1){
            return res.send({
                message : 'Server error: ' + err,
                success : false
            })
        } 
        if (validSession.length < 1) {
            return res.send({
                message : 'Error, you need to be logged in to do that',
                success : false
            })
        }
        // search for the user
        RegisteredUser.find({
            _id : ObjectId(userid),
        }, (err2, validUser) => {
            if (err2){
                return res.send({
                    message : 'USER: Server error: ' + err,
                    success : false
                })
            } 

            if (validUser.length < 1){
                return res.send({
                    message : 'Error, user does not exist in the database',
                    success : false
                })
            } else {
            // if the user exists, proceed to find the song and remove it

                // get the playlist from the user's account
                let userPlaylist = validUser[0].playlists.id(playlistid)
                if (userPlaylist === null) {
                    return res.send({
                        message : "Error, playlist does not exist",
                        success : false
                    })
                }
                // access the array of songs in the specific playlist
                userPlaylist = userPlaylist.playlistSongs
                // find the song
                let songToRemove = userPlaylist.id(songid)
                // return error is song is not in the playlist
                if (songToRemove === null) {
                    return res.send({
                        message : "Error, song does not exist ",
                        success : false
                    })
                }
                //remove the song
                songToRemove.remove()
                // update the database
                validUser[0].save(
                    (err3) => {
                        if (err3) {
                            return res.send({
                                message : "Error occured: " + err3,
                                success : false
                            })
                        }
                    }
                )
                return res.send({
                    message : "Song successfully removed",
                    success : true
                })
            }                       
        })
    })
})

module.exports = router
