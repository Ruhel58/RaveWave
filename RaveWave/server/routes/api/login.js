const express = require('express')
const router = express.Router()
const RegisteredUser = require('../../models/RegisteredUser')
const LoginSession = require('../../models/LoginSession')
const cors = require('cors');

router.use(cors())

router.post('/login', (req, res, next)=> {
    res.setHeader('Content-Type', 'application/json');
    const {body} = req
    const {
        userName,
        password
    } = body

    //check if the fields are empty 
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

    // check if username exists in the database
    RegisteredUser.find({
        userName : userName 
    }, (err, user) => {
        if (err) {
            return res.send({
                message : "Server error: " + err,
                success : false
            })
        }
        if (user.length !=1) {
            return res.send({
                message : "Invalid username or pasword",
                success : false
            })
        }

        /**
         * get the password from the user input
         * hash the password and compare it with the hased password in the database
         * if they do not match, return error
         */
        const currentUser = user[0]
        if (!currentUser.validPassword(password)) {
            return res.send({
                message : "Invalid username or pasword",
                success : false
            })
        }

        // if 2 hashed password match, create a new login session
        const session = new LoginSession()
        session.userId = currentUser._id
        session.save((err, doc) => {
            if(err){
                return res.send({
                    message : "Server error: " + err,
                    success : false
                })
            }
            return res.send({
                success : 'Sign in is successful',
                token : doc._id,
                user_id : session.userId,
                signin_time : session.timestamp
            })
        })
    })
})
module.exports = router