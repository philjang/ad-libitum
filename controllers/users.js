const express = require('express')
const router = express.Router()
const db = require('../models')
const bcrypt = require('bcrypt')
const cryptojs = require('crypto-js')
require('dotenv').config()

// new user form
router.get('/new', (req,res)=>{
    res.render('users/new.ejs', {error: null})
})

// add new user
router.post('/', async (req,res) => {
    try {
        const [newUser, created] = await db.user.findOrCreate({
            where: {
                email: req.body.email
            }
        })
        if(!created) {
            console.log('User already exists'.brightCyan)
            res.render('users/new.ejs', {error: 'Email already taken'})
        } else {
            // hasSync(password, salt rounds)
            const hashedPassword = bcrypt.hashSync(req.body.password, 10)
            newUser.password = hashedPassword
            newUser.name = req.body.name
            await newUser.save()

            // encrypt the user id via AES (advanced encryption standard)
            // .encrypt(userid but changed to string, secret string stored in .env file) takes two arguments
            const encryptedUserId = cryptojs.AES.encrypt(newUser.id.toString(), process.env.SECRET)
            // store the encrypted id in the cookie of the response object
            // res.cookie() also requires string as second argument
            const encryptedUserIdString = encryptedUserId.toString()
            // res.cookie(name of cookie, value)
            res.cookie('userId', encryptedUserIdString)
            // redirect back to home page
            res.redirect('/users/profile')
        }
    } catch (error) {
        console.log(error)
    }
})

// login form
router.get('/login', (req,res) => {
    if (res.locals.currentUser) {
        res.redirect('/users/profile')
    }
    res.render('users/login.ejs', {error: null})
})

// user home page
router.get('/profile', (req,res) => {
    res.render('users/profile', {error: null})
})

// log in user
router.post('/login', async (req,res) =>{
    try {
        const user = await db.user.findOne({where: {email:req.body.email}})
        if(!user) {
            console.log('user not found!')
            res.render('users/login.ejs', {error: 'Invalid email/password'})
        } else if (!bcrypt.compareSync(req.body.password, user.password)) { // found user but password wrong
            console.log('Incorrect Password')
            res.render('users/login.ejs', {error: 'Invalid email/password'})
        } else {
            console.log('logging in the user!')
            // same as new user sign up route
            const encryptedUserId = cryptojs.AES.encrypt(user.id.toString(), process.env.SECRET)
            const encryptedUserIdString = encryptedUserId.toString()
            res.cookie('userId', encryptedUserIdString)
            res.redirect('/users/profile')
        }
    } catch (error) {
        console.log(error)
    }
})

// log out user
router.get('/logout', (req,res) => {
    console.log('logging out')
    res.clearCookie('userId')
    res.redirect('/')
})

module.exports = router