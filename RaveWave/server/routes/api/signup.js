const express = require('express')
const router = express.Router()
const RegisteredUser = require('../../models/RegisteredUser')
const cors = require('cors');

router.use(cors())

router.post('/signup', (req, res, next)=> {
    res.setHeader('Content-Type', 'application/json');
    const {body} = req
    const {
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
    }, (err,  existingUser) => {
        if (err){
            return res.send({
                message : 'Server error: ' + err,
                success : false
            })
        } else if (existingUser.length > 0){
            return res.send({
                message : 'This username is taken',
                success : false
            })
        } else {
            // add new user to the database
            const newUser = new RegisteredUser()
            newUser.firstName = firstName
            newUser.lastName = lastName
            newUser.userName = userName
            newUser.email = email
            newUser.status = "normal"
            newUser.password = newUser.generateHash(password)
            newUser.save((err, registeredUser)=> {
                if (err){
                    return res.send({
                        message : 'Signup failed. Server error: ' + err,
                        success : false
                    })
                }
                return res.send({
                    message : 'Sign up successful',
                    success : true
                })
            })
        }  
    })        
})

module.exports = router