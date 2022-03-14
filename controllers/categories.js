require('dotenv').config();
const express = require('express');
const router = express.Router();
const db = require('../models');

// categories list page
router.get('/', async (req, res) => {
    if (res.locals.currentUser) {
        try {
            const categories = await db.category.findAll({
                where: { userId: res.locals.currentUser.id },
            });
            res.render('categories/index.ejs', { categoryArr: categories });
        } catch (error) {
            console.log(error);
        }
    } else res.redirect('/')
});

// add new category
router.post('/', async (req, res) => {
    if (res.locals.currentUser) {
        try {
            const [newCategory, wasCreated] = await db.category.findOrCreate({
                where: {
                    name: req.body.name,
                    userId: res.locals.currentUser.id,
                },
            });
            console.log(`User ${res.locals.currentUser.name} created a new category, ${newCategory.name}: ${wasCreated}`.brightCyan);
            if (!wasCreated) {
                res.render('categories/new.ejs', {error: 'That category already exists'})
            } else res.redirect(`/categories/${newCategory.name}`);
        } catch (error) {
            console.log(error);
        }
    } else res.redirect('/')
});
   
// new category form
router.get('/1new', (req, res) => {
    if (res.locals.currentUser) {
        res.render('categories/new.ejs', {error: null});
    } else res.redirect('/')
});

// category details page with list of restaurants
router.get('/:name', async (req, res) => {
    if (res.locals.currentUser) {
        try {
            const selectedCategory = await db.category.findOne({
                where: {
                    name: req.params.name,
                    userId: res.locals.currentUser.id,
                },
                include: [db.restaurant]
            });
            if (!selectedCategory) {
                res.render('users/profile.ejs', {error: "Unauthorized action"})
            } else {
                const restaurants = selectedCategory.restaurants
                res.render('categories/show.ejs', {restaurantArr: restaurants,selectedCategory});
            }
        } catch (error) {
            console.log(error);
        }
    } else res.redirect('/')
});

// delete selected category
router.delete('/:name', async (req,res) => {
    if(res.locals.currentUser) {
        try {
            await db.category.destroy({
                where: {
                    name: req.params.name,
                    userId: res.locals.currentUser.id
                }
            })
            res.redirect('/categories')
        } catch (error) {
            console.log(error)
        }
    } else res.redirect('/')
})

module.exports = router;
