require('dotenv').config();
const express = require('express');
const router = express.Router();
const db = require('../models');

// cafeCategories list page
router.get('/', async (req, res) => {
    if (res.locals.currentUser) {
        try {
            const cafeCategories = await db.cafecategory.findAll({
                where: { userId: res.locals.currentUser.id },
            });
            res.render('cafeCategories/index.ejs', { categoryArr: cafeCategories });
        } catch (error) {
            console.log(error);
        }
    } else res.redirect('/')
});

// add new cafecategory
router.post('/', async (req, res) => {
    if (res.locals.currentUser) {
        try {
            const [newCategory, wasCreated] = await db.cafecategory.findOrCreate({
                where: {
                    name: req.body.name,
                    userId: res.locals.currentUser.id,
                },
            });
            console.log(`User ${res.locals.currentUser.name} created a new cafecategory, ${newCategory.name}: ${wasCreated}`.brightCyan);
            if (!wasCreated) {
                res.render('cafeCategories/new.ejs', {error: 'That cafe category already exists'})
            } else res.redirect(`/ccategories/${newCategory.name}`);
        } catch (error) {
            console.log(error);
        }
    } else res.redirect('/')
});
   
// new cafecategory form
router.get('/1new', (req, res) => {
    if (res.locals.currentUser) {
        res.render('cafeCategories/new.ejs', {error: null});
    } else res.redirect('/')
});

// cafecategory details page with list of cafes
router.get('/:name', async (req, res) => {
    if (res.locals.currentUser) {
        try {
            const selectedCategory = await db.cafecategory.findOne({
                where: {
                    name: req.params.name,
                    userId: res.locals.currentUser.id,
                },
                include: [db.cafe]
            });
            const cafes = selectedCategory.caves
            res.render('cafeCategories/show.ejs', {cafeArr: cafes,selectedCategory});
        } catch (error) {
            console.log(error);
        }
    } else res.redirect('/')
});

// delete selected cafecategory
router.delete('/:name', async (req,res) => {
    if(res.locals.currentUser) {
        try {
            await db.cafecategory.destroy({
                where: {
                    name: req.params.name,
                    userId: res.locals.currentUser.id
                }
            })
            res.redirect('/ccategories')
        } catch (error) {
            console.log(error)
        }
    } else res.redirect('/')
})

module.exports = router;
