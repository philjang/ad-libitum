require('dotenv').config();
const express = require('express');
const router = express.Router();
const db = require('../models');

router.get('/', async (req, res) => {
    try {
        const categories = await db.category.findAll({
            where: { userId: res.locals.currentUser.id },
        });
        res.render('categories/index.ejs', { categoryArr: categories });
    } catch (error) {
        console.log(error);
    }
});

router.post('/', async (req, res) => {
    try {
        const [newCategory, wasCreated] = await db.category.findOrCreate({
            where: {
                name: req.body.name,
                userId: res.locals.currentUser.id,
            },
        });
        console.log(`A new category, ${newCategory.name}, was created: ${wasCreated}`);
        res.redirect('/categories');
    } catch (error) {
        console.log(error);
    }
});

router.get('/new', (req, res) => {
    res.render('categories/new.ejs');
});

router.get('/:name', async (req, res) => {
    try {
        const selectedCategory = await db.category.findOne({
            where: {
                name: req.params.name,
                userId: res.locals.currentUser.id,
            },
            include: [db.restaurant]
        });
        const restaurants = selectedCategory.restaurants
        res.render('categories/show.ejs', {restaurantArr: restaurants,selectedCategory});
    } catch (error) {
        console.log(error);
    }
});

module.exports = router;
