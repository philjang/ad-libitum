require('dotenv').config()
const express = require('express')
const router = express.Router()
const db = require('../models')

router.get('/', (req,res)=>{
    res.render('categories/index.ejs')
})

router.get('/new', (req,res)=>{
    res.render('categories/new.ejs')
})

router.get('/:name', (req,res)=>{
    res.render('categories/show.ejs')
})




module.exports = router