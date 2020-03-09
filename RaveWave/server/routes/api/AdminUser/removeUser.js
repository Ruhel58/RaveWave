const express = require('express')
const router = express.Router()
const LoginSession = require('../../../models/LoginSession')
const RegisteredUser = require('../../../models/RegisteredUser')
const cors = require('cors')
const ObjectId = require('mongoose').Types.ObjectId; 

//api call to add a category to the database
router.use(cors())

router.post('/removeuser', (req, res)=> {
    res.setHeader('Content-Type', 'application/json');
    const { body } = req
    const {
        userid,
        token,
        todeleteid
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
                    if(!todeleteid) {
                        return res.send({
                            message : 'Select a user to delete',
                            success : false
                        })
                    }
                    // prevent Admin user from deleting another Admin user
                    RegisteredUser.find({
                        _id : ObjectId(todeleteid)
                    }, (err3, toDelete) => {
                        if (err3){
                            return res.send({
                                message : 'Error occured: ' + err4,
                                success : false
                            })
                        }
                        if(toDelete){
                            if (toDelete.length > 0 && toDelete[0].status === "admin"){
                                return res.send({
                                    message : 'Error, admin account cannot be deleted by another admin',
                                    success : false
                                })
                            }
                        }
                    })
                    // delete the user from the database
                    RegisteredUser.deleteOne({
                        _id : ObjectId(todeleteid),
                    }, (err4, result) =>{
                        console.log("this far")
                        if (err4){
                            return res.send({
                                message : 'Error occured: ' + err4,
                                success : false
                            })
                        }
                        return res.send({
                            message : 'User no longer exists in the database',
                            success : true
                        })
                    })
                }
            })
        } 
    })
})

module.exports = router