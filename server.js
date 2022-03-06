require('dotenv').config()
const express = require('express')
const ejsLayouts = require('express-ejs-layouts')
const axios = require('axios')
const db = require('./models')
const cryptojs = require('crypto-js')
const cookieParser = require('cookie-parser')
const methodOverride = require('method-override')
const colors = require('colors')


const app = express()
const PORT = process.env.PORT || 8000 

app.set('view engine', 'ejs')
app.use(ejsLayouts)
app.use('/',express.static('public'))
app.use(methodOverride('_method')) // allows PUT AND DELETE using POST form, must be above other middleware using req
app.use(cookieParser()) // req.cookies
app.use(express.urlencoded({extended: false})) // req.body

// login middleware
app.use(async (req,res,next) => {
    if(req.cookies.userId) {
        const decryptedId = cryptojs.AES.decrypt(req.cookies.userId, process.env.SECRET)
        const decryptedIdString = decryptedId.toString(cryptojs.enc.Utf8)
        const user = await db.user.findByPk(decryptedIdString)
        res.locals.currentUser = user
    } else res.locals.currentUser = null
    next()
})

app.use('/users', require('./controllers/users.js'))
app.use('/restaurants', require('./controllers/restaurants.js'))
app.use('/categories', require('./controllers/categories.js'))

app.get('/', (req,res)=> {
    if(res.locals.currentUser) {
        res.redirect('/users/profile')
    } else res.render('home.ejs')
})

app.get('*', (req,res)=> {
    res.send('404 page')
})

app.listen(PORT, () => {
    console.log(`Server is up and running on port ${PORT}`)
})