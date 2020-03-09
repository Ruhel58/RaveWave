const express = require('express')
const router = express.Router()
const Category = require('../../../models/Category')
const Song = require('../../../models/Song')
const LoginSession = require('../../../models/LoginSession')
const RegisteredUser = require('../../../models/RegisteredUser')
const cors = require('cors')
const ObjectId = require('mongoose').Types.ObjectId; 

//api call to add a category to the database
router.use(cors())

router.post('/createcategory', (req, res, next)=> {
    res.setHeader('Content-Type', 'application/json');
    const { body } = req
    const {
        userid,
        token,
        name,
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
                    if (!name) {
                        return res.send({
                            message : "A category must have a name",
                            success : false
                        })
                    }
                    if (!songid) {
                        return res.send({
                            message : "A category must have one song when creating it",
                            success : false
                        })
                    }

                    // check if a category with that name already exists
                    Category.find({
                        name : name
                    }, (err3,  existingCategory) => {
                        if (err3){
                            return res.send({
                                message : 'Server error: ' + err3,
                                success : false
                            })
                        } else if (existingCategory.length > 0){
                            return res.send({
                                message : 'A category with that name already exists in the database',
                                success : false,
                            })
                        } else {
                            //find the song by the id
                            Song.find({
                                _id : ObjectId(songid)
                            }, (err4, validSong) => {
                                // any errors, return valid message
                                if (err4){
                                    return res.send({
                                        message : 'Failed to add a new category. Error: ' + err4,
                                        success : false
                                    })
                                }

                                if (validSong.length < 1) {
                                    return res.send({
                                        message : 'Song does not existx',
                                        success : false
                                    })
                                }

                                const songToAdd = validSong[0]
                                // add new category to the database
                                const newCategory = new Category()
                                newCategory.name = name
                                newCategory.songs.push(songToAdd)
                                newCategory.save((err5)=> {
                                    if (err5){
                                        return res.send({
                                            message : 'Failed to add a new category. Error: ' + err5,
                                            success : false
                                        })
                                    }
                                    return res.send({
                                        message : 'Category successfully added to the database',
                                        success : true
                                    })
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