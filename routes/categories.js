const express = require('express')
const { Category, validateCategory } = require('../models/category')
const validateObjectId = require('../middleware/validateObjectId')
const router = express.Router()

router.get('/', async (req, res) => {
    const categories = await Category.find().sort('name')
    res.send(categories)
})

router.post('/', async (req, res) => {
    let category = new Category({ name: req.body.name })
    await category.save()
    res.send(category)
})

router.put('/:id', async (req, res) => {
    const category = await Category.findByIdAndUpdate(
        req.params.id,
        { name: req.body.name },
        { new: true }
    );

    if (!category) return res.status(404).send(`Category id ${parseInt(req.params.id)} was not found`);

    res.send(category);
});

router.delete('/:id', async (req, res) => {
    const category = await Category.findByIdAndDelete(req.params.id)

    if (!category) return res.status(404).send(`Category id ${parseInt(req.params.id)} was not found`)

    res.send(category)
})

router.get('/:id', validateObjectId, async (req, res) => {
    const category = await Category.findById(req.params.id)

    if (!category) return res.status(404).send(`Category id ${parseInt(req.params.id)} was not found`)

    res.send(category)
})

module.exports = router