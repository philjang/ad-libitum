require('dotenv').config()
const express = require('express')
const router = express.Router()
const db = require('../models')
const axios = require('axios')

// cafe list page
router.get('/', async (req,res)=>{
    if (res.locals.currentUser) {
        try {
            const cafes = await db.cafe.findAll({
                where: {userId: res.locals.currentUser.id}
            })
            res.render('cafes/index.ejs', {cafeArr: cafes})
        } catch (error) {
            console.log(error)
        }
    } else res.redirect('/')
})

// add new cafe
router.post('/', async (req,res) => {
    if (res.locals.currentUser) {
        try {
            const defaultPoint = {type: 'Point', coordinates: [135, 85], crs: { type: 'name', properties: { name: 'EPSG:4326'} } }
            const [newCafe, wasCreated] = await db.cafe.findOrCreate({
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
            console.log(`User ${res.locals.currentUser.name} created a new cafe, ${newCafe.name}: ${wasCreated}`.brightCyan)
            if (!wasCreated) {
                res.render('cafes/new.ejs', {error: 'That cafe is already in your list!'})
            } else {
                const retrievedJSON = await axios.get("https://api.mapbox.com/geocoding/v5/mapbox.places/"+newCafe.name+" "+newCafe.address+".json?types=address%2Cpoi&access_token="+process.env.MAPBOX_API_TOKEN)
                // console.log(retrievedJSON.data.features[0].center)
                const point = await {type: 'Point', coordinates: retrievedJSON.data.features[0].center, crs: { type: 'name', properties: { name: 'EPSG:4326'} } }
                newCafe.coordinates = point
                await newCafe.save()
                // console.log(newCafe.coordinates)
                res.redirect(`/cafes/${newCafe.id}`)
            }
        } catch (error) {
            console.log(error)
        }
    } else res.redirect('/')
})

// new cafe form
router.get('/new', (req,res)=>{
    if (res.locals.currentUser) {
        res.render('cafes/new.ejs', {error: null})
    } else res.redirect('/')
})

// edit cafe PUT
router.put('/:id', async (req,res)=>{
    if (res.locals.currentUser) {
        try {
            await db.cafe.update({
                name: req.body.name,
                address: req.body.address,
                note: req.body.note,
                rating: req.body.rating
            },{
                where: {id: req.params.id,userId:res.locals.currentUser.id}
            })
            res.redirect(`/cafes/${req.params.id}`)
        } catch (error) {
            console.log(error)
        }
    } else res.redirect('/')
})

// edit cafe form
router.get('/edit/:id', async (req,res)=>{
    if (res.locals.currentUser) {
        try {
            const selectedCafe = await db.cafe.findOne({
                where: {
                    id: req.params.id,
                    userId: res.locals.currentUser.id,
                },
                include: [db.cafemenu]
            })
            if (!selectedCafe) {
                res.render('users/profile.ejs', {error: "Unauthorized action"})
            } else {
                const cafeMenuItems = selectedCafe.cafemenus
                res.render('cafes/edit.ejs', {cafeMenuArr: cafeMenuItems, selectedCafe})
            }
        } catch (error) {
            console.log(error)
        }
    } else res.redirect('/')
})

// search for new map
router.get('/:id/map', async (req,res) => {
    if (res.locals.currentUser) {
        const foundCafe = await db.cafe.findOne({
            where: {id: req.params.id,userId:res.locals.currentUser.id}
        })
        if (!foundCafe) {
            res.render('users/profile.ejs', {error: "Unauthorized action"})
        } else {
            res.render('cafes/map.ejs', {cafeId: foundCafe.id, cafeName: foundCafe.name, cafeAddress: foundCafe.address})
        }
    } else res.redirect('/')
})

// display map search results
router.get('/mapresults', async (req,res) => {
    if (res.locals.currentUser) {
        try {
            const foundCafe = await db.cafe.findOne({
                where: {id: req.query.id}
            })
            if(foundCafe.userId !== res.locals.currentUser.id) {
                res.render('users/profile.ejs', {error: "Unauthorized action"})
            } else {
                const retrievedJSON = await axios.get("https://api.mapbox.com/geocoding/v5/mapbox.places/"+req.query.name+" "+req.query.address+".json?limit=10&types=address%2Cpoi&access_token="+process.env.MAPBOX_API_TOKEN)
                const resultsArr = retrievedJSON.data.features
                // console.log(resultsArr)
                // console.log(retrievedJSON)
                res.render('cafes/mapresults.ejs', {resultsArr, cafeId: req.query.id})
            }
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
            await db.cafe.update({
                coordinates: {type: 'Point', coordinates: [req.body.lon, req.body.lat], crs: { type: 'name', properties: { name: 'EPSG:4326'} } }
            }, {
                where: {id: req.params.id, userId: res.locals.currentUser.id}
            })
            console.log(`cafe with id #${req.params.id} updated with new coordinates: ${req.body.lon}, ${req.body.lat}`.brightCyan)
            res.redirect(`/cafes/${req.params.id}`)
        } catch (error) {
            console.log(error)
        }
    } else res.redirect('/')
})

// add new cafemenu item
router.post('/:id', async (req,res) => {
    if (res.locals.currentUser) {
        try {
            const [newCafeMenu, wasCreated] = await db.cafemenu.findOrCreate({
                where: {
                    name: req.body.name,
                    cafeId: req.params.id
                },
                defaults: {
                    description: req.body.description,
                    price: req.body.price
                }
            })
            console.log(`User ${res.locals.currentUser.name} created a new cafemenu item, ${newCafeMenu}:(${wasCreated}), for the cafe with id #${req.params.id}`.brightCyan)
            // repeat as get route for error message
            const selectedCafe = await db.cafe.findOne({
                where: {
                    id: req.params.id,
                    userId: res.locals.currentUser.id,
                },
                include: [db.cafemenu,db.cafecategory]
            })
            const cafeMenuItems = selectedCafe.cafemenus
            const associatedCategories = selectedCafe.categories
            if (!wasCreated) {
                res.render(`cafes/show.ejs`, {error: `The same item is already in your list!`, cafeMenuArr: cafeMenuItems, categoryArr: associatedCategories,selectedCafe,mapkey: process.env.MAPBOX_API_TOKEN})
            } else res.redirect(`/cafes/${req.params.id}`)
        } catch (error) {
            console.log(error)
        }
    } else res.redirect('/')
})

// new cafemenu item form
router.get('/:id/newmenu', async (req,res) => {
    if (res.locals.currentUser) {
        try {
            const foundCafe = await db.cafe.findOne({
                where: {id: req.params.id}
            })
            if(foundCafe.userId !== res.locals.currentUser.id) {
                res.render('users/profile.ejs', {error: "Unauthorized action"})
            } else {
                const cafeName = foundCafe.name
                res.render('cafes/newmenu.ejs', {cafeId: req.params.id, cafeName})
            }
        } catch (error) {
            console.log(error)
        }
    } else res.redirect('/')
})

// cafe details page with list of cafemenu highlights
router.get('/:id', async (req,res)=>{
    if (res.locals.currentUser) {
        try {
            const selectedCafe = await db.cafe.findOne({
                where: {
                    id: req.params.id,
                    userId: res.locals.currentUser.id,
                },
                include: [db.cafemenu,db.cafecategory]
            })
            if(!selectedCafe) {
                res.render('users/profile.ejs', {error: "Unauthorized action"})
            } else {
                const cafeMenuItems = selectedCafe.cafemenus
                const associatedCategories = selectedCafe.cafecategories
                res.render('cafes/show.ejs', {error: null, cafeMenuArr: cafeMenuItems, categoryArr: associatedCategories,selectedCafe,mapkey: process.env.MAPBOX_API_TOKEN})
            }
        } catch (error) {
            console.log(error)
        }
    } else res.redirect('/')
})

// pick or add new cafecategory form
router.get('/:id/addcategory', async (req,res)=>{
    if(res.locals.currentUser) {
        try {
            const selectedCafe = await db.cafe.findOne({
                where: {id: req.params.id}
            })
            if(selectedCafe.userId !== res.locals.currentUser.id) {
                res.render('users/profile.ejs', {error: "Unauthorized action"})
            } else {
                const categories = await db.cafecategory.findAll({
                    where: {userId: res.locals.currentUser.id},
                    include: [db.cafe]
                })
                // let ejsOption = {async: true}
                res.render('cafes/addcategory.ejs', {error: null, selectedCafe, categoryArr: categories})
            }
        } catch (error) {
            console.log(error)
        }
    } else res.redirect('/')
})

// associate cafe to new cafecategory route
router.post('/:id/addcategory', async (req,res)=>{
    if (res.locals.currentUser) {
        try {
            const [newCafeCategory, wasCreated] = await db.cafecategory.findOrCreate({
                where: {
                    name: req.body.name,
                    userId: res.locals.currentUser.id,
                },
            });
            const foundCafe = await db.cafe.findOne({
                where: {id: req.params.id}
            })
            if (!wasCreated) {
                // repeat as get route for error message
                const categories = await db.cafecategory.findAll({
                    where: {userId: res.locals.currentUser.id},
                    include: [db.cafe]
                })
                res.render('cafes/addcategory.ejs', {error: 'That cafecategory already exists', selectedCafe: foundCafe, categoryArr: categories})
            } else {
                await newCafeCategory.addCafe(foundCafe)
                // const cafeCat = await foundCafe.getCafecategories()
                console.log(`User ${res.locals.currentUser.name} created a new cafecategory, ${newCafeCategory.name}: ${wasCreated} and linked to ${foundCafe.name}`.brightCyan);
                // console.log(foundCafe,cafeCat)
                res.redirect(`/ccategories/${newCafeCategory.name}`);
            }
        } catch (error) {
            console.log(error);
        }
    } else res.redirect('/')
})

// unassociate cafe from existing cafecategory route
router.post('/:id/rmfrom/:categoryId', async (req,res) => {
    if (res.locals.currentUser) {
        try {
            const selectedCategory = await db.cafecategory.findOne({
                where: {id: req.params.categoryId}
            })
            const foundCafe = await db.cafe.findOne({
                where: {id: req.params.id}
            })
            await selectedCategory.removeCafe(foundCafe)
            const cafeCat = await foundCafe.getCafecategories()
            console.log(foundCafe, cafeCat)
            res.redirect(`/cafes/${req.params.id}/addcategory`)
        } catch (error) {
            console.log(error);
        }
    } else res.redirect('/')
})

// associate cafe to existing cafecategory route
router.post('/:id/addto/:categoryId', async (req,res)=>{
    if (res.locals.currentUser) {
        try {
            const selectedCategory = await db.cafecategory.findOne({
                where: {id: req.params.categoryId}
            })
            const foundCafe = await db.cafe.findOne({
                where: {id: req.params.id}
            })
            await selectedCategory.addCafe(foundCafe)
            const cafeCat = await foundCafe.getCafecategories()
            console.log(foundCafe,cafeCat)
            res.redirect(`/cafes/${req.params.id}/addcategory`)
        } catch (error) {
            console.log(error);
        }
    } else res.redirect('/')
})

// delete selected cafe
router.delete('/:id', async (req,res) => {
    if(res.locals.currentUser) {
        try {
            await db.cafe.destroy({
                where: {id: req.params.id, userId: res.locals.currentUser.id}
            })
            res.redirect('/cafes')
        } catch (error) {
            console.log(error)
        }
    } else res.redirect('/')
})

// delete selected cafemenu item
router.delete('/:cafeId/:menuId', async (req,res) => {
    if(res.locals.currentUser) {
        try {
            await db.cafemenu.destroy({
                where: {id: req.params.menuId}
            })
            res.redirect(`/cafes/edit/${req.params.cafeId}`)
        } catch (error) {
            console.log(error)
        }
    } else res.redirect('/')
})

module.exports = router