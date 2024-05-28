require('dotenv').config()
const express = require('express')
const app = express()
const port = process.env.PORT || 3000
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')

const indexRouter = require('./router/index')
const authorRouter = require('./router/author')
const bookRouter = require('./router/book')

mongoose.connect(process.env.MONGO_URL)
.then(()=>console.log('Connected to Database...'))
.catch(err=>console.log(err))

app.use(methodOverride('_method'))
app.use(express.json())
app.use(bodyParser.urlencoded({extended:false}))
app.set('view engine', 'ejs')
app.set('views', 'views')
app.use(express.static('public'))
app.use(express.static('public/uploads'))
app.use('/author',express.static('public'))
app.use('/author/new',express.static('public'))
app.use('/author/edit',express.static('public'))

app.use('/book',express.static('public'))
app.use('/book',express.static('public/uploads'))
app.use('/', indexRouter)
app.use('/author', authorRouter)``
app.use('/book', bookRouter)

app.listen(port,()=>console.log('Listening at port',port))