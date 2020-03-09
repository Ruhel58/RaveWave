const express = require('express')
const router = express.Router()
const LoginSession = require('../../models/LoginSession')
const cors = require('cors');

router.use(cors())

router.get('/verify', (req, res, next)=> {
    res.setHeader('Content-Type', 'application/json');
    const { query } = req
    const { token } = query

    // verify that the login session is unique

    /**
     *  get the current token id 
     *  return error if token does not exist in the database or if exists is set to false in the database
     *  
     *  return success if token id is in the database and exists is set to true
     */

    LoginSession.find({
        _id : token,
        exists: true
    }, (err, session) => {
        if (err) {
            return res.send({
                message : "Error, verification failed: " + err,
                userId : '',
                success : false
            })
        }
        
        if (session.length !== 1) {
            if (err) {
                return res.send({
                    message : "Error, verification failed:  " + err,
                    userId : '',
                    success : false
                })
            }
        } else {
            return res.send({
                message : "Token verified ",
                userId : session[0].userId,
                success : true
            })
        }
    })
})

module.exports = router