const express = require('express')
const router = express.Router()
const Author = require('../model/author')
const Book = require('../model/book')
const multer = require('multer')
const fs = require('fs')

function fileFilter(req, file, cb) {
    if (file.mimetype === "image/jpeg" || file.mimetype === "image/jpg" || file.mimetype === "image/png" || file.mimetype === "image/jfif") {
        cb(null, true)
    } else {
        cb(null, false)
    }
    cb(new Error('I don\'t have a clue!'))
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/uploads')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname)      
    }
})

const upload = multer({
    storage: storage, limits: {
        fieldSize: 1024 * 1024 * 5,
        fileFilter: fileFilter
    }
})

router.get('/',async (req,res)=>{
    let query = Book.find()
    if(req.query.title != null && req.query.title.trim() != ''){
        query = query.regex('title', new RegExp(req.query.title, 'i'))
    }
    if(req.query.publishedBefore != null && req.query.publishedBefore.trim() != ''){
        query = query.lte('publishDate', new Date(req.query.publishedBefore))
    }
    if(req.query.publishedAfter != null && req.query.publishedAfter.trim() != ''){
        query = query.gte('publishDate', new Date(req.query.publishedAfter))
    }
    try{
        const books = await query.exec()
        res.render('book/index', {books, searchOptions: req.query})
    }catch(err){
        res.status(400).redirect('/')
    }
})

router.get('/new',async (req,res)=>{
    const authors = await Author.find({})
    res.render('book/new', {authors, book: new Book()})
})

router.post('/',upload.single('image'),async (req,res)=>{
   let filename = req.file == null ? '' : req.file.path
    const book = new Book({
        title: req.body.title,
        author: req.body.author,
        publishDate: req.body.publishDate,
        pageCount: req.body.pageCount,
        description: req.body.description,
        image: filename
    }) 

    const authors = await Author.find({})
    try{
        await book.save()
        res.redirect('/book')
    }catch(err){
        fs.unlink(filename, err=>{
            if(err) console.log(err)
        })
        res.render('book/new', {
            errorMessage: 'An error occurred while posting the book!',
            book,
            authors
        })
    }
})


router.get('/:id', async (req,res)=>{
    const book = await Book.findById({_id:req.params.id})
    const author = await Author.findById({_id:book.author})
    res.render('book/view', {book, author})
})

router.delete('/:id', async (req,res)=>{
    await Book.findByIdAndDelete({_id:req.params.id})
    res.redirect('/book')

})

router.get('/edit/:id',  async (req,res)=>{
    const book = await Book.findById({_id:req.params.id})
    const authors = await Author.find({})
    res.render('book/edit', {book, authors})
})

router.patch('/:id',upload.single('image'), async (req,res)=>{
    try{
        let filename
        const book = await Book.findById({_id:req.params.id})
        if(req.body.image != null || req.body.image != ''){
            filename = req.file == null ? '' : req.file.path
        }
        await Book.findByIdAndUpdate({_id:req.params.id}, {
                title: req.body.title || book.title,
                description: req.body.description || book.description,
                publishDate: new Date(req.body.publishDate) || book.publishDate,
                pageCount: req.body.pageCount || book.pageCount,
                author: req.body.author || book.author,
                image:filename || book.image 

            })
        res.redirect('/book')
    }catch(err){
        res.render('book/edit', {errorMessage: 'An error occurred while editing...'})
    }
})

module.exports = router