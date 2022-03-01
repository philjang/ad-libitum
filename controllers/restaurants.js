require('dotenv').config()
const express = require('express')
const router = express.Router()
const db = require('../models')

router.get('/', (req,res)=>{
    res.render('restaurants/index.ejs')
})

router.get('/new', (req,res)=>{
    res.render('restaurants/new.ejs')
})

router.get('/edit/:id', (req,res)=>{
    res.render('restaurants/edit.ejs')
})

router.get('/:id', (req,res)=>{
    res.render('restaurants/show.ejs')
})




module.exports = router