const mongoose = require('mongoose')
const bookSchema = mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    description:{
        type: String
    },
    publishDate:{
        type: Date,
        required: true
    },
    pageCount: {
        type: Number,
        required: true
    },
    createdAt:{
        type:Date,
        required: true,
        default: Date.now()
    },
    image:{
        type:String,
        required: true
    },
    author:{
        type: mongoose.Types.ObjectId,
        ref:'Author',
        required:true
    }
})

module.exports = mongoose.model('Book', bookSchema)