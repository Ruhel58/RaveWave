const express = require('express')
const router = express.Router()
const RegisteredUser = require('../../models/RegisteredUser')
const cors = require('cors')
const ObjectId = require('mongoose').Types.ObjectId; 

//api call to add a song to the database
router.use(cors())

router.get('/exportplaylist', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    const { query } = req
    const { playlistid, userid } = query
   
    //verify that the account who is making that call is logged in 
   
    // the user is logged in and exists. 
    
    // search for the category. Query does not have to be exact
    RegisteredUser.find({
        _id : ObjectId(userid)
    }, 
        (err2, userAccount) => {
            // any errors, return this
            if(err2){
                return res.send({
                    message : 'Error: ' + err2,
                    success : false,
                    data :''
                })
            }
            // if there are no results
            if(userAccount.length < 1){
                return res.send({
                    message: 'No results found for ' + query,
                    data : '',
                    success : true
                })
            } else {
                // results found and returned
                // find the playlist
                let userPlaylist = userAccount[0].playlists.id(playlistid)
                if (userPlaylist === null) {
                    return res.send({
                        message : "Error, playlist does not exist",
                        success : false,
                        data : '',
                    })
                }
                let songs = []
                for (let i = 0; i < userPlaylist.playlistSongs.size; i++){
                    songs.push(userPlaylist.playlistSongs[i])
                }
                const toPrint = {
                    name : userPlaylist.playlistName,
                    songs: songs
                }

                return res.send({
                    message: 'User found',
                    data : toPrint,
                    success : true
                })
            }
        }
    )       
            
    
    
})


module.exports = router
