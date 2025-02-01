const express = require('express');
const { Category } = require('../models/category');
const { Product, validateProduct } = require('../models/product');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const router = express.Router();

router.get('/', async (req, res) => {
    const products = await Product.find().sort('name');
    res.send(products);
});

router.post('/', [auth, admin], async (req, res) => {
    const { error } = validateProduct(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const category = await Category.findById(req.body.categoryId);
    if (!category) return res.status(400).send('Invalid category.');

    const product = new Product({
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
        stock: req.body.stock,
        category: {
            _id: category._id,
            name: category.name
        },
        images: req.body.images
    });

    await product.save();
    res.send(product);
});

router.put('/:id', [auth, admin], async (req, res) => {
    const { error } = validateProduct(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const category = await Category.findById(req.body.categoryId);
    if (!category) return res.status(400).send('Invalid category.');

    const product = await Product.findByIdAndUpdate(
        req.params.id,
        {
            name: req.body.name,
            description: req.body.description,
            price: req.body.price,
            stock: req.body.stock,
            category: {
                _id: category._id,
                name: category.name
            },
            images: req.body.images
        },
        { new: true }
    );

    if (!product) return res.status(404).send('The product with the given ID was not found.');
    res.send(product);
});

router.delete('/:id', [auth, admin], async (req, res) => {
    const product = await Product.findByIdAndRemove(req.params.id);

    if (!product) return res.status(404).send('The product with the given ID was not found.');
    res.send(product);
});

router.get('/:id', async (req, res) => {
    const product = await Product.findById(req.params.id);

    if (!product) return res.status(404).send('The product with the given ID was not found.');
    res.send(product);
});

module.exports = router;