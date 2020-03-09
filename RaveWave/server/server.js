const colors = require('colors')
const express = require('express')
const mongoose = require('mongoose')
const bodyparser = require('body-parser')

const signup = require('./routes/api/signup')
const login = require('./routes/api/login')
const verify = require('./routes/api/verify')
const logout = require('./routes/api/logout')
const createPlaylist = require('./routes/api/createPlaylist')
const removePlaylist = require('./routes/api/removePlaylist')
const addCategoryToPlaylist = require('./routes/api/addCategoryToPlaylist')
const removeSongFromPlaylist = require('./routes/api/removeSongFromPlaylist')
const addSongToDatabase = require('./routes/api/AdminUser/addSongToDatabase')
const createCategory = require('./routes/api/AdminUser/createCategory')
const removeCategoryFromDatabase = require('./routes/api/AdminUser/removeCategoryFromDatabase')
const addSongToCategory = require('./routes/api/AdminUser/addSongsToCategory')
const removeSongFromCategory = require('./routes/api/AdminUser/removeSongFromCategory')
const removeSongFromDatabase = require('./routes/api/AdminUser/removeSongFromDatabase')
const removeUser = require('./routes/api/AdminUser/removeUser')
const getUser = require('./routes/api/getUser')
const updateDetails = require('./routes/api/updateDetails')
const search = require('./routes/api/search')
const exportPlaylist = require('./routes/api/createPlaylist')
const addSongToPlaylist = require('./routes/api/addSongToPlaylist')

const cors = require('cors');
const app = express()
const port = 5001

app.use(bodyparser.json())

// configuring the database
const database = require('../config/keys').mongoURI

//connect to the database
mongoose
    .connect(database, { useNewUrlParser: true })
    .then(() => console.log('Database is connected'.green.bold))
    .catch(err => console.log(('Error connecting to the database: ' + err).red.bold.underline));
 
// routes config

app.use('/api/user', 
    signup, 
    login,
    verify,
    logout,
    addSongToDatabase,
    removeSongFromDatabase,
    createCategory,
    removeCategoryFromDatabase,
    createPlaylist,
    removePlaylist,
    addSongToCategory,
    removeSongFromCategory,
    addCategoryToPlaylist,
    removeSongFromPlaylist,
    removeUser,
    getUser,
    search,
    updateDetails,
    exportPlaylist,
    addSongToPlaylist
).mongoURI

app.use(bodyparser.json())
app.use(cors());

// set app to listen to port 
app.listen(port, () => console.log(('Server is connected and listening on port: '+ port).blue.bold.italic ))