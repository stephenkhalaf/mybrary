require('dotenv').config()
const express = require('express')
const app = express()
const port = process.env.PORT || 3000
const path = require('path')
const mongoose = require('mongoose')

mongoose.connect(process.env.MONGO_URL)
.then(()=>console.log('Connected to Database...'))
.catch(err=>console.log(err))

const indexRouter = require("./api/routes/index")

app.use(express.urlencoded({extended:false}))
app.set('views', 'api/views')
app.set('view engine', 'ejs')

app.use('/', express.static(path.join(__dirname, 'public')))

app.use('/',indexRouter)

app.listen(port, ()=>console.log('Listening at port',port))