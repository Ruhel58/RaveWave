const express = require('express')
const router = express.Router()
const LoginSession = require('../../models/LoginSession')
const RegisteredUser = require('../../models/RegisteredUser')
const cors = require('cors')
const ObjectId = require('mongoose').Types.ObjectId; 

//api call to add a song to the database
router.use(cors())

router.get('/retrieveuser', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    const { query } = req
    const { token, userid } = query
   
    //verify that the account who is making that call is logged in 
    LoginSession.find({
        _id : ObjectId(token), 
        userId : userid,
        exists : true
    }, (err1,  validSession) => {
            if (err1){
                return res.send({
                    message : 'Server error: ' + err,
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
                                user : null,
                                success : false
                            })
                        }
                        // if there are no results
                        if(userAccount.length < 1){
                            return res.send({
                                message: 'No results found for ' + query,
                                user : null,
                                success : true
                            })
                        } else {
                            // results found and returned
                            
                            return res.send({
                                message: 'User found',
                                user : userAccount[0],
                                success : true
                            })
                        }
                    }
                )       
            }  
        }
    )
})


module.exports = router
