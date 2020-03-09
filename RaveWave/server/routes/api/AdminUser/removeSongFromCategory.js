const express = require('express')
const router = express.Router()
const Song = require('../../../models/Song')
const LoginSession = require('../../../models/LoginSession')
const RegisteredUser = require('../../../models/RegisteredUser')
const Category = require('../../../models/Category')
const cors = require('cors')
const ObjectId = require('mongoose').Types.ObjectId; 

//api call to add a song to the database

// to be tested
router.use(cors())

router.post('/removefromcategory', (req, res, next)=> {
    res.setHeader('Content-Type', 'application/json');
    const { body } = req
    const {
        userid,
        token,
        songid,
        categoryid
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
                    // find the selected category
                    Category.find({
                        _id : ObjectId(categoryid)
    
                    }, (err3,  selectedCategory) => {

                        // ensure that the song and category fields are not empty
                        if(!songid) {
                            return res.send({
                                message : 'Select a song to remove',
                                success : false
                            })
                        }

                        if(!categoryid) {
                            return res.send({
                                message : 'Select a category to remove from',
                                success : false
                            })
                        }
                            if (selectedCategory.length < 1){
                                return res.send({
                                    message : 'Error. Category not found',
                                    success : false
                                })
                            } 
                            // check if the song exists in the database
                            Song.find({
                                _id : ObjectId(songid)
            
                            }, (err4, selectedSong) => {
                                    if (selectedSong.length < 1) {
                                        return res.send({
                                            message : 'Error. Song not found',
                                            success : false
                                        })
                                    }   
                                    /**
                                     * the user is:
                                     * - logged in
                                     * - an admin
                                     * and both the category and song exists
                                     */
                                    Category.update({
                                        _id : ObjectId(categoryid)
                                    },
                                    // pull the song from the songs playlist in the Category document
                                    { $pull: { songs: { _id : ObjectId(songid)} }},
                                    (err4) => {
                                        if (err4){
                                            return res.send({
                                                message : 'Error occured: ' + err,
                                                success : false
                                            })
                                        }
                                    })
                                    return res.send({
                                        message : 'Success, song no longer exists in the category',
                                        success : true
                                    }) 
                                }
                            )
                        }
                    ) 
                }
            })
        } 
    })
})

module.exports = router




/** 





*/



