const mongoose = require('mongoose')
const Schema = mongoose.Schema

//Schema for showing searched results

const SearchResultSchema = new Schema ({
    Keyword :{
        type: String,
        required : true

    },
    Result : {
        type : [SongSchema],
        required : true
    },
    Time : {
        type : Date,
        required : true,
        default : Date.now()
    }


})

const SearchResult = moogoose.model('SearchResult',SearchResultSchema)
module.exports = SearchResult