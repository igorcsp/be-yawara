const express = require('express');
const { Category } = require('../models/category');
const { Product, validateProduct } = require('../models/product');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const validateObjectId = require('../middleware/validateObjectId');
const router = express.Router();
const multer = require('multer');
const upload = multer()

router.get('/', async (req, res) => {
    const products = await Product.find().sort('name');
    res.send(products);
});

router.post("/", [auth, admin], upload.array("images"), async (req, res) => {
    console.log(req.body); 

    const { error } = validateProduct(req.body);
    if (error) return res.status(400).send(error.details);

    const category = await Category.findById(req.body.categoryId);
    if (!category) return res.status(400).send("Invalid category.");

    const product = new Product({
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
        stock: req.body.stock,
        category: {
            _id: category._id,
            name: category.name,
        },
        images: req.files.map((file) => file.buffer.toString("base64")),
    });

    await product.save();
    res.send(product);
});

router.put('/:id', [auth, admin, validateObjectId], async (req, res) => {
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

router.delete('/:id', [auth, admin, validateObjectId], async (req, res) => {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) return res.status(404).send('The product with the given ID was not found.');
    res.send(product);
});

router.get('/:id', validateObjectId, async (req, res) => {
    const product = await Product.findById(req.params.id);

    if (!product) return res.status(404).send('The product with the given ID was not found.');
    res.send(product);
});

module.exports = router;