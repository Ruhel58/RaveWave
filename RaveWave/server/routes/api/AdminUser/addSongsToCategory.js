const express = require('express')
const router = express.Router()
const Song = require('../../../models/Song')
const LoginSession = require('../../../models/LoginSession')
const RegisteredUser = require('../../../models/RegisteredUser')
const Category = require('../../../models/Category')
const cors = require('cors')
const ObjectId = require('mongoose').Types.ObjectId; 

//api call to add a song to the database
router.use(cors())

router.post('/addtocategory', (req, res, next)=> {
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
                            if (selectedCategory.length < 1){
                                return res.send({
                                    message : 'Error. Category not found',
                                    success : false
                                })
                            } 
                            // find the selected song
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
                                     * add the song to the songs array inside category. 
                                     * do not add any duplicates
                                     **/
                                    Category.update(
                                        {_id : categoryid}, 
                                        {$addToSet: {"songs": selectedSong[0]}},
                                        (err5, results) =>{
                                            if (err5){
                                                console.log("Error: " + err5)
                                                return res.send({
                                                    message : 'Error: ' + err5,
                                                    success : false
                                                })
                                            }
                                            return res.send({
                                                message : 'Song successfully added to category',
                                                success : true
                                        })
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



