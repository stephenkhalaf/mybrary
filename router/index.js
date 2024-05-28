const express = require('express')
const router = express.Router()
const Book = require('../model/book')

router.get('/',async (req,res)=>{
    const books = await Book.find({}).sort({_id:-1}).limit(5)
    res.status(200).render('index', {books})
})

module.exports = router