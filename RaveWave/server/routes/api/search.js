const express = require('express')
const router = express.Router()
const LoginSession = require('../../models/LoginSession')
const Category = require('../../models/Category')
const cors = require('cors')
const ObjectId = require('mongoose').Types.ObjectId; 

// api call to add a song to the database
router.use(cors())

router.get('/search', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    const { query } = req
    const { userid, search, token } = query
   
    //verify that the account who is making that call is logged in 
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
                // the user is logged in and exists. 
                // search fields cannot be empty
                if (!search){
                    return res.send({
                        message: "Search field cannot be blank",
                        success : true,
                        results : []
                    })
                }
                // search for the category. Query does not have to be exact
                Category.find({
                    name: {'$regex': search, '$options': 'i'}
                }, 
                    (err2,  results) => {
                        // any errors, return this
                        if(err2){
                            return res.send({
                                message : 'Error: ' + err2,
                                success : false
                            })
                        }
                        // if there are no results
                        if(results.length < 1){
                            return res.send({
                                message: 'No results found for ' + search,
                                count : results.length,
                                results : results,
                                success : true
                            })
                        } else {
                            // results found and returned
                            return res.send({
                                message: 'Results for ' + search + ': ' ,
                                count : results.length,
                                results : results,
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
