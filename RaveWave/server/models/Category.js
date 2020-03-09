const mongoose = require('mongoose')
const Schema = mongoose.Schema

const SongSchema = require('./Song')

const CategorySchema = new Schema ({
    name : {
        type : String,
        required : true
    },
    songs : {
        type : [SongSchema.schema],
        required : true
    }
});

const Category = mongoose.model('Category', CategorySchema)
module.exports = Category