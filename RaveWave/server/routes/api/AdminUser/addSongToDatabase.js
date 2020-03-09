const express = require('express')
const router = express.Router()
const Song = require('../../../models/Song')
const LoginSession = require('../../../models/LoginSession')
const RegisteredUser = require('../../../models/RegisteredUser')
const cors = require('cors')
const ObjectId = require('mongoose').Types.ObjectId; 

//api call to add a song to the database
router.use(cors())

router.post('/addsong', (req, res, next)=> {
    res.setHeader('Content-Type', 'application/json');
    const { body } = req
    const {
        userid,
        token,
        name,
        artist,
        featuredArtists,
        albumName,
        year,
        youtubeUrl,
        spotifyUrl,
        googleMusicUrl,
        deezerUrl
    } = body

    //verify that the account who is making that call is logged in and an admin
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
                message : 'SES: Error, you have to be a system admin to do that',
                success : false
            })
        } else {
            RegisteredUser.find({
                _id : ObjectId(userid),
                status: "admin"
            }, (error, validUser) => {
                if (error){
                    return res.send({
                        message : 'Server error: ' + err,
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
                    if (!name) {
                        return res.send({
                            message : "Name of the song cannot be empty",
                            success : false
                        })
                    }
                    if (!artist) {
                        return res.send({
                            message : "Artist cannot be empty",
                            success : false
                        })
                    }
                    if (!albumName) {
                        return res.send({
                            message : "Album cannot be empty",
                            success : false
                        })
                    }
                    if (!year) {
                        return res.send({
                            message : "Year cannot be empty",
                            success : false
                        })
                    }

                    Song.find({
                        name : name,
                        artist : artist
                    }, (err,  existingSong) => {
                        if (err){
                            return res.send({
                                message : 'Server error: ' + err,
                                success : false
                            })
                        } else if (existingSong.length > 0){
                            return res.send({
                                message : 'This song already exists in the database',
                                success : false,
                            })
                        } else {
                            // add new song to the database
                            const newSong = new Song()
                            newSong.name = name
                            newSong.artist = artist
                            newSong.featuredArtists = featuredArtists,
                            newSong.albumName = albumName
                            newSong.year = year
                            newSong.youtubeUrl = youtubeUrl
                            newSong.spotifyUrl = spotifyUrl
                            newSong.googleMusicUrl = googleMusicUrl
                            newSong.deezerUrl = deezerUrl
                            
                            newSong.save((err, registeredUser)=> {
                                if (err){
                                    return res.send({
                                        message : 'Failed to add the song. Error: ' + err,
                                        success : false
                                    })
                                }
                                return res.send({
                                    message : 'Song successfully added to the database',
                                    success : true
                                })
                            })
                        }  
                    })
                }
            })
        } 
    })
})

module.exports = router
