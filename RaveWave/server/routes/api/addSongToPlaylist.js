const express = require('express')
const router = express.Router()
const LoginSession = require('../../models/LoginSession')
const RegisteredUser = require('../../models/RegisteredUser')
const Song = require('../../models/Song')
const cors = require('cors')
const ObjectId = require('mongoose').Types.ObjectId; 

//api call to add a song to the database
router.use(cors())

router.post('/addsongtoplaylist', (req, res, next)=> {
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
    }, (err,  validSession) => {
        if (err){
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
        }, (error, validUser) => {
            if (error){
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

                if (!songid) {
                    return res.send({
                        message : 'Error, Select a song to add',
                        success : true
                    })
                }
                // search for the category 
                Song.find({
                    _id : ObjectId(songid),
                },(err3, validSong) => {
                    if (err3){
                        return res.send({
                            message : 'SONG: Server error: ' + err,
                            success : false
                        })
                    } 
                    if (validSong.length < 1){
                        return res.send({
                            message : 'Error, Song does not exist in the database',
                            success : false
                        })   
                    }
                    // get the playlist from the user's account
                    let userPlaylist = validUser[0].playlists.id(playlistid)
                    if (userPlaylist === null) {
                        return res.send({
                            message : "Error, playlist does not exist",
                            success : false
                        })
                    }
                    userPlaylist = userPlaylist.playlistSongs
                    // check if the playlist exists in the user
                    if (userPlaylist.length > 0 ){
                        // if so, check if the current song in the category is in the user playlist
                        var exists = userPlaylist.some(function(el) {
                            return (el._id.toString() == validSong[0]._id.toString());
                        })
                        // if the song does not exist, push it in the array
                        if(!exists){
                            console.log("Song pushed")
                            userPlaylist.push(validSong[0])
                        }
           
                    } else {
                        // if the user has no songs in their playlist, push a song inside
                        userPlaylist.push(validSong[0])
                    }

                    validUser[0].save()
                    return res.send({
                        message : 'Song successfully added to the playlist',
                        success : true
                    })                            
                })    
            }                       
        })
    })
})

module.exports = router
