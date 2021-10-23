const express = require('express')
const app = express()

const homeRoute = require('./routes/home')
const userRoute = require('./routes/user')

app.set('view engine', 'ejs')
app.set('views', 'views')

app.use(express.urlencoded({extended: true}))
app.use(express.json())
app.use(userRoute.routes)
app.use(homeRoute.routes)

app.listen(3000)