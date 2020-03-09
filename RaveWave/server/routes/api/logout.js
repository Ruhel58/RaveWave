const express = require('express')
const router = express.Router()
const RegisteredUser = require('../../models/RegisteredUser')
const LoginSession = require('../../models/LoginSession')
const cors = require('cors');
router.use(cors())

router.get('/logout', (req, res, next) => {
    res.setHeader('Content-Type', 'application/json');
    const { query } = req
    const { token } = query

   // find the given loging session based on the token id and set exist to false
    LoginSession.findOneAndUpdate({
        _id : token,
        exists: true
    },{
        $set: {exists: false}
    }, null, (err, session) => {
        if (err) {
            return res.send({
                message : "Logout failed: " + err,
                success : false
            })
        }
        return res.send({
            message : "Logout successful",
            success : true
        })  
    })
})

module.exports = router