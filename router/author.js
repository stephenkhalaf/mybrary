const express = require('express')
const router = express.Router()
const Author = require('../model/author')
const Book = require('../model/book')

router.get('/',async (req,res)=>{
    const searchOptions = {}
    if(req.query.name != null && req.query.name.trim() != ''){
        searchOptions.name = new RegExp(req.query.name, 'i')
    }
    try{
        const authors = await Author.find(searchOptions).sort({_id:-1})
        res.status(200).render('author/index', {authors, searchOptions:req.query})
    }catch(err){
        res.status(400).render('author/index', {errorMessage:'An error occurred  getting all authors', authors: new Author()})
    }
})


//this new route needs to be on top the id route
router.get('/new',(req,res)=>{
    res.status(200).render('author/new')
})

router.post('/',async (req,res)=>{
    const author = new Author({
        name:req.body.name
    })
    if(req.body.name.trim() == '' ){
        res.status(400).render('author/new' , {
            author: author,
            errorMessage: 'Please input a name!'
        })
    }
    try{
        await author.save()
        res.status(200).redirect('/author')
    }catch(err){
        res.status(400).render('author/new' , {
            author: author,
            errorMessage: 'An error occurred creating author!'
        })
    }
})

router.get('/:id',  async (req,res)=>{
    const books = await Book.find({author:req.params.id})
    const author = await Author.findById({_id:req.params.id})
    res.status(200).render('author/view', {author, books})
})

router.get('/edit/:id',  async (req,res)=>{
    const author = await Author.findById({_id:req.params.id})
    res.render('author/edit', {author})
})

router.patch('/:id',  async(req,res)=>{
    try{
        const author = await Author.findById({_id:req.params.id})
        await Author.findByIdAndUpdate({_id:req.params.id}, {
                name: req.body.name || author.name
            })
        res.redirect('/author')
    }catch(err){
        res.render('author/edit', {errorMessage: 'An error occurred while editing...'})
    }
    
})

router.delete('/:id',  async (req,res)=>{
    const book = await Book.find({author:req.params.id})
    if(book.length == 0){
        await Author.findByIdAndDelete({_id:req.params.id})
        res.redirect('/author')
    }else{
        const author  = await Author.findById({_id:req.params.id})
        const authors = await Author.find({})
        res.render('author/index', {errorMessage:'This author still has books...', searchOptions:author, authors})
    }
})

module.exports = router