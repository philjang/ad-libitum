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
            res.render('restaurants/index.ejs', {restaurantArr: restaurants, error: null})
        } catch (error) {
            console.log(error)
        }
    } else res.redirect('/')
})

// add new restaurant
router.post('/', async (req,res) => {
    if (res.locals.currentUser) {
        try {
            const defaultPoint = {type: 'Point', coordinates: [135, 85], crs: { type: 'name', properties: { name: 'EPSG:4326'} } }
            const [newRestaurant, wasCreated] = await db.restaurant.findOrCreate({
                where: {
                    name: req.body.name,
                    userId: res.locals.currentUser.id,
                },
                defaults: {
                    address: req.body.address,
                    note: req.body.note,
                    rating: req.body.rating,
                    coordinates: defaultPoint
                }
            })
            console.log(`User ${res.locals.currentUser.name} created a new restaurant, ${newRestaurant.name}: ${wasCreated}`.brightCyan)
            if (!wasCreated) {
                res.render('restaurants/new.ejs', {error: 'That restaurant is already in your list!'})
            } else {
                const retrievedJSON = await axios.get("https://api.mapbox.com/geocoding/v5/mapbox.places/"+newRestaurant.name+" "+newRestaurant.address+".json?types=address%2Cpoi&access_token="+process.env.MAPBOX_API_TOKEN)
                // console.log(retrievedJSON.data.features[0].center)
                const point = await {type: 'Point', coordinates: retrievedJSON.data.features[0].center, crs: { type: 'name', properties: { name: 'EPSG:4326'} } }
                newRestaurant.coordinates = point
                await newRestaurant.save()
                // console.log(newRestaurant.coordinates)
                res.redirect(`/restaurants/${newRestaurant.id}`)
            }
        } catch (error) {
            console.log(error)
        }
    } else res.redirect('/')
})

// new restaurant form
router.get('/new', (req,res)=>{
    if (res.locals.currentUser) {
        res.render('restaurants/new.ejs', {error: null})
    } else res.redirect('/')
})

// edit restaurant PUT
router.put('/:id', async (req,res)=>{
    if (res.locals.currentUser) {
        try {
            await db.restaurant.update({
                name: req.body.name,
                address: req.body.address,
                note: req.body.note,
                rating: req.body.rating
            },{
                where: {id: req.params.id}
            })
            res.redirect(`/restaurants/${req.params.id}`)
        } catch (error) {
            console.log(error)
        }
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

// search for new map
router.get('/:id/map', async (req,res) => {
    if (res.locals.currentUser) {
        const foundRestaurant = await db.restaurant.findOne({
            where: {id: req.params.id}
        })
        res.render('restaurants/map.ejs', {restaurantId: foundRestaurant.id, restaurantName: foundRestaurant.name, restaurantAddress: foundRestaurant.address})
    } else res.redirect('/')
})

// display map search results
router.get('/mapresults', async (req,res) => {
    if (res.locals.currentUser) {
        try {
            const retrievedJSON = await axios.get("https://api.mapbox.com/geocoding/v5/mapbox.places/"+req.query.name+" "+req.query.address+".json?limit=10&types=address%2Cpoi&access_token="+process.env.MAPBOX_API_TOKEN)
            const resultsArr = retrievedJSON.data.features
            // console.log(resultsArr)
            // console.log(retrievedJSON)
            res.render('restaurants/mapresults.ejs', {resultsArr, restaurantId: req.query.id})
        } catch (error) {
            console.log(error)
        }
    } else res.redirect('/')
})

// update coordinates PUT
router.put('/:id/map', async (req,res) => {
    if (res.locals.currentUser) {
        try {
            // const point = {type: 'Point', coordinates: [req.body.lon, req.body.lat]}
            await db.restaurant.update({
                coordinates: {type: 'Point', coordinates: [req.body.lon, req.body.lat], crs: { type: 'name', properties: { name: 'EPSG:4326'} } }
            }, {
                where: {id: req.params.id}
            })
            console.log(`restaurant with id #${req.params.id} updated with new coordinates: ${req.body.lon}, ${req.body.lat}`.brightCyan)
            res.redirect(`/restaurants/${req.params.id}`)
        } catch (error) {
            console.log(error)
        }
    } else res.redirect('/')
})

// add new menu item
router.post('/:id', async (req,res) => {
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
            console.log(`User ${res.locals.currentUser.name} created a new menu item, ${newMenu}:(${wasCreated}), for the restaurant with id #${req.params.id}`.brightCyan)
            // repeat as get route for error message
            const selectedRestaurant = await db.restaurant.findOne({
                where: {
                    id: req.params.id,
                    userId: res.locals.currentUser.id,
                },
                include: [db.menu,db.category]
            })
            const menuItems = selectedRestaurant.menus
            const associatedCategories = selectedRestaurant.categories
            if (!wasCreated) {
                res.render(`restaurants/show.ejs`, {error: `The same item is already in your list!`, menuArr: menuItems, categoryArr: associatedCategories,selectedRestaurant,mapkey: process.env.MAPBOX_API_TOKEN})
            } else res.redirect(`/restaurants/${req.params.id}`)
        } catch (error) {
            console.log(error)
        }
    } else res.redirect('/')
})

// new menu item form
router.get('/:id/newmenu', async (req,res) => {
    if (res.locals.currentUser) {
        try {
            const foundRestaurant = await db.restaurant.findOne({
                where: {id: req.params.id}
            })
            const restaurantName = foundRestaurant.name
            res.render('restaurants/newmenu.ejs', {restaurantId: req.params.id, restaurantName})
        } catch (error) {
            console.log(error)
        }
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
                include: [db.menu,db.category]
            })
            const menuItems = selectedRestaurant.menus
            const associatedCategories = selectedRestaurant.categories
            res.render('restaurants/show.ejs', {error: null, menuArr: menuItems, categoryArr: associatedCategories,selectedRestaurant,mapkey: process.env.MAPBOX_API_TOKEN})
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
                where: {userId: res.locals.currentUser.id},
                include: [db.restaurant]
            })
            // let ejsOption = {async: true}
            res.render('restaurants/addcategory.ejs', {error: null, selectedRestaurant, categoryArr: categories})
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
            if (!wasCreated) {
                // repeat as get route for error message
                const categories = await db.category.findAll({
                    where: {userId: res.locals.currentUser.id},
                    include: [db.restaurant]
                })
                res.render('restaurants/addcategory.ejs', {error: 'That category already exists', selectedRestaurant: foundRestaurant, categoryArr: categories})
            } else {
                await newCategory.addRestaurant(foundRestaurant)
                // const resCat = await foundRestaurant.getCategories()
                console.log(`User ${res.locals.currentUser.name} created a new category, ${newCategory.name}: ${wasCreated} and linked to ${foundRestaurant.name}`.brightCyan);
                // console.log(foundRestaurant,resCat)
                res.redirect(`/categories/${newCategory.name}`);
            }
        } catch (error) {
            console.log(error);
        }
    } else res.redirect('/')
})

// unassociate restaurant from existing category route
router.delete('/:id/rmfrom/:categoryId', async (req,res) => {
    if (res.locals.currentUser) {
        try {
            const selectedCategory = await db.category.findOne({
                where: {id: req.params.categoryId}
            })
            const foundRestaurant = await db.restaurant.findOne({
                where: {id: req.params.id}
            })
            await selectedCategory.removeRestaurant(foundRestaurant)
            const resCat = await foundRestaurant.getCategories()
            console.log(foundRestaurant, resCat)
            res.redirect(`/restaurants/${req.params.id}/addcategory`)
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