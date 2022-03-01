require('dotenv').config()
const express = require('express')
const router = express.Router()
const db = require('../models')
const axios = require('axios')

router.get('/', async (req,res)=>{
    try {
        const restaurants = await db.restaurant.findAll({
            where: {userId: res.locals.currentUser.id}
        })
        res.render('restaurants/index.ejs', {restaurantArr: restaurants})
    } catch (error) {
        console.log(error)
    }
})

router.post('/', async (req,res) => {
    try {
        const [newRestaurant, wasCreated] = await db.restaurant.findOrCreate({
            where: {
                name: req.body.name,
                userId: res.locals.currentUser.id,
            },
            defaults: {
                address: req.body.address,
                note: req.body.note,
                rating: req.body.rating
            }
        })
        console.log(`User ${res.locals.currentUser.name} created a new restaurant, ${newRestaurant.name}: ${wasCreated}`)
        const retrievedJSON = await axios.get("https://api.mapbox.com/geocoding/v5/mapbox.places/"+newRestaurant.name+" "+newRestaurant.address+".json?types=address%2Cpoi&access_token="+process.env.MAPBOX_API_TOKEN)
        // console.log(retrievedJSON.data.features[0].center)
        const point = await {type: 'Point', coordinates: retrievedJSON.data.features[0].center}
        newRestaurant.coordinates = point
        await newRestaurant.save()
        // console.log(newRestaurant.coordinates)
        res.redirect('/restaurants')
    } catch (error) {
        console.log(error)
    }
})

router.get('/new', (req,res)=>{
    res.render('restaurants/new.ejs')
})

router.get('/edit/:id', (req,res)=>{
    try {

        res.render('restaurants/edit.ejs')
    } catch (error) {
        console.log(error)
    }
})

router.get('/:id', (req,res)=>{
    try {

        res.render('restaurants/show.ejs')
    } catch (error) {
        console.log(error)
    }
})




module.exports = router