const express = require('express')
const router = express.Router()
const LoginSession = require('../../models/LoginSession')
const RegisteredUser = require('../../models/RegisteredUser')
const cors = require('cors')
const ObjectId = require('mongoose').Types.ObjectId; 

router.use(cors())

router.post('/updatedetails', (req, res, next)=> {
    res.setHeader('Content-Type', 'application/json');
    const {body} = req
    const {
        userid, 
        token,
        firstName,
        lastName,
        userName,
        password
    } = body
    
    let {
        email
    } = body
    //set email to lowercase
    email = email.toLowerCase()
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

                // verify that the attributes are not empty
                if (!firstName) {
                    return res.send({
                        message : "First name must not be empty",
                        success : false
                    })
                }
                if (!lastName) {
                    return res.send({
                        message : "Last name must not be empty",
                        success : false
                    })
                }
                if (!userName) {
                    return res.send({
                        message : "Username must not be empty",
                        success : false
                    })
                }
                if (!password) {
                    return res.send({
                        message : "password must not be empty",
                        success : false
                    })
                }
                if (!email) {
                    return res.send({
                        message : "Email must not be empty",
                        success : false
                    })
                }

                // check if username already exist in the database
                RegisteredUser.find({
                    userName : userName
                }, (err2,  existingUser) => {
                    if (err2){
                        return res.send({
                            message : 'Server error: ' + err2,
                            success : false
                        })
                    } 
                    // check if the username already exists in the database
                    if (existingUser.length > 0){
                        // also check if the username is not their own username
                        if(existingUser[0]._id !== userid){
                            return res.send({
                                message : 'This username is taken',
                                success : false
                            })
                        }
                    } 
                    
                    // update the user detail
                    RegisteredUser.findOneAndUpdate({
                        _id : ObjectId(userid)
                    }, {
                        $set: { 
                            firstName: firstName,
                            lastName : lastName,
                            userName : userName,
                            email : email
                        }
                    },function (err3, user) {

                        if (err3) {
                            return res.send({
                                message : "failed to update", 
                                success : false
                            })
                        } else {
                            //password has to be hashed, so there is another insertion
                            user.password = user.generateHash(password)
                            user.save((err4, newDets) => {
                                if (err4){
                                    return res.send({
                                        message : "Error, cannot update: " + err4, 
                                        success : false
                                    })
                                } else {
                                    return res.send({
                                        message : "Details updated successfully", 
                                        success : true
                                    })
                                }
                            })
                        }
                    })                    
                })  
            }  
        }
    )      
})

module.exports = router