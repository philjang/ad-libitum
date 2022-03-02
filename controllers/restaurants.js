require('dotenv').config()
const express = require('express')
const router = express.Router()
const db = require('../models')
const axios = require('axios')

// restaurant list page
router.get('/', async (req,res)=>{
    if (res.locals.currentUser) {
        try {
            const restaurants = await db.restaurant.findAll({
                where: {userId: res.locals.currentUser.id}
            })
            res.render('restaurants/index.ejs', {restaurantArr: restaurants})
        } catch (error) {
            console.log(error)
        }
    } else res.redirect('/')
})

// add new restaurant
router.post('/', async (req,res) => {
    if (res.locals.currentUser) {
        try {
            const [newRestaurant, wasCreated] = await db.restaurant.findOrCreate({
                where: {
                    name: req.body.name,
                    userId: res.locals.currentUser.id,
                },
                defaults: {
                    address: req.body.address,
                    note: req.body.note,
                    rating: req.body.rating,
                    coordinates: {type: 'Point', coordinates: [135,90]}
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
    } else res.redirect('/')
})

// new restaurant form
router.get('/new', (req,res)=>{
    if (res.locals.currentUser) {
        res.render('restaurants/new.ejs')
    } else res.redirect('/')
})

// edit restaurant form
router.get('/edit/:id', async (req,res)=>{
    if (res.locals.currentUser) {
        try {
            const selectedRestaurant = await db.restaurant.findOne({
                where: {
                    id: req.params.id,
                    userId: res.locals.currentUser.id,
                },
                include: [db.menu]
            })
            const menuItems = selectedRestaurant.menus
            res.render('restaurants/edit.ejs', {menuArr: menuItems, selectedRestaurant})
        } catch (error) {
            console.log(error)
        }
    } else res.redirect('/')
})

// add new menu item
router.post('/:id/', async (req,res) => {
    if (res.locals.currentUser) {
        try {
            const [newMenu, wasCreated] = await db.menu.findOrCreate({
                where: {
                    name: req.body.name,
                    restaurantId: req.params.id
                },
                defaults: {
                    description: req.body.description,
                    price: req.body.price
                }
            })
            console.log(`User ${res.locals.currentUser.name} created a new menu item, ${newMenu}:(${wasCreated}), for the restaurant with id #${req.params.id}`)
            res.redirect(`/restaurants/${req.params.id}`)
        } catch (error) {
            console.log(error)
        }
    } else res.redirect('/')
})

// new menu item form
router.get('/:id/new', (req,res) => {
    if (res.locals.currentUser) {
        res.render('restaurants/newmenu.ejs', {restaurantId: req.params.id})
    } else res.redirect('/')
})

// restaurant details page with list of menu highlights
router.get('/:id', async (req,res)=>{
    if (res.locals.currentUser) {
        try {
            const selectedRestaurant = await db.restaurant.findOne({
                where: {
                    id: req.params.id,
                    userId: res.locals.currentUser.id,
                },
                include: [db.menu]
            })
            const menuItems = selectedRestaurant.menus
            res.render('restaurants/show.ejs', {menuArr: menuItems, selectedRestaurant,mapkey: process.env.MAPBOX_API_TOKEN})
        } catch (error) {
            console.log(error)
        }
    } else res.redirect('/')
})

// pick or add new category form
router.get('/:id/addcategory', async (req,res)=>{
    if(res.locals.currentUser) {
        try {
            const selectedRestaurant = await db.restaurant.findOne({
                where: {id: req.params.id}
            })
            const categories = await db.category.findAll({
                where: {userId: res.locals.currentUser.id}
            })
            res.render('restaurants/addcategory.ejs', {selectedRestaurant, categoryArr: categories})
        } catch (error) {
            console.log(error)
        }
    } else res.redirect('/')
})

// associate restaurant to new category route
router.post('/:id/addcategory', async (req,res)=>{
    if (res.locals.currentUser) {
        try {
            const [newCategory, wasCreated] = await db.category.findOrCreate({
                where: {
                    name: req.body.name,
                    userId: res.locals.currentUser.id,
                },
            });
            const foundRestaurant = await db.restaurant.findOne({
                where: {id: req.params.id}
            })
            await newCategory.addRestaurant(foundRestaurant)
            // const resCat = await foundRestaurant.getCategories()
            console.log(`User ${res.locals.currentUser.name} created a new category, ${newCategory.name}: ${wasCreated} and linked to ${foundRestaurant.name}`);
            // console.log(foundRestaurant,resCat)
            res.redirect(`/restaurants/${req.params.id}/addcategory`);
        } catch (error) {
            console.log(error);
        }
    } else res.redirect('/')
})

// associate restaurant to existing category route
router.post('/:id/addto/:categoryId', async (req,res)=>{
    if (res.locals.currentUser) {
        try {
            const selectedCategory = await db.category.findOne({
                where: {id: req.params.categoryId}
            })
            const foundRestaurant = await db.restaurant.findOne({
                where: {id: req.params.id}
            })
            await selectedCategory.addRestaurant(foundRestaurant)
            const resCat = await foundRestaurant.getCategories()
            console.log(foundRestaurant,resCat)
            res.redirect(`/restaurants/${req.params.id}/addcategory`)
        } catch (error) {
            console.log(error);
        }
    } else res.redirect('/')
})

// delete selected restaurant
router.delete('/:id', async (req,res) => {
    if(res.locals.currentUser) {
        try {
            await db.restaurant.destroy({
                where: {id: req.params.id}
            })
            res.redirect('/restaurants')
        } catch (error) {
            console.log(error)
        }
    } else res.redirect('/')
})

// delete selected menu item
router.delete('/:restaurantId/:menuId', async (req,res) => {
    if(res.locals.currentUser) {
        try {
            await db.menu.destroy({
                where: {id: req.params.menuId}
            })
            res.redirect(`/restaurants/edit/${req.params.restaurantId}`)
        } catch (error) {
            console.log(error)
        }
    } else res.redirect('/')
})

module.exports = router