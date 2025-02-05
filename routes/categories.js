const express = require('express')
const { Category, validateCategory } = require('../models/category')
const validateObjectId = require('../middleware/validateObjectId')
const auth = require('../middleware/auth')
const admin = require('../middleware/admin')
const router = express.Router()

router.get('/', async (req, res) => {
    const categories = await Category.find().sort('name')
    res.send(categories)
})

router.post('/', [auth, admin], async (req, res) => {
    const { error } = validateCategory(req.body)
    if (error) return res.status(400).send(error.details[0].message)

    let category = new Category({ name: req.body.name })
    await category.save()
    res.send(category)
})

router.put('/:id', [auth, admin, validateObjectId], async (req, res) => {
    const { error } = validateCategory(req.body)
    if (error) return res.status(400).send(error.details[0].message)

    const category = await Category.findByIdAndUpdate(
        req.params.id,
        { name: req.body.name },
        { new: true }
    );

    if (!category) return res.status(404).send(`Category id ${req.params.id} was not found`);

    res.send(category);
});

router.delete('/:id', [auth, admin, validateObjectId], async (req, res) => {
    const category = await Category.findByIdAndDelete(req.params.id)

    if (!category) return res.status(404).send(`Category id ${req.params.id} was not found`)

    res.send(category)
})

router.get('/:id', validateObjectId, async (req, res) => {

    const category = await Category.findById(req.params.id)

    if (!category) return res.status(404).send(`Category id ${req.params.id} was not found`)

    res.send(category)
})

module.exports = router

