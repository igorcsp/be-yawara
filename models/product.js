const mongoose = require('mongoose');
const Joi = require('joi');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minLength: 3,
        maxLength: 100
    },
    description: {
        type: String,
        required: true,
        minLength: 10,
        maxLength: 2000
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    stock: {
        type: Number,
        required: true,
        min: 0
    },
    category: {
        _id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Category',
            required: true
        },
        name: {
            type: String,
            required: true
        }
    },
    images: {
        type: [String],
        validate: {
            validator: (arr) => arr.length > 0,
            message: 'At least one image is required.'
        }
    },
}, { timestamps: true });

const Product = mongoose.model('Product', productSchema);

function validateProduct(product) {
    const schema = Joi.object({
        name: Joi.string().min(3).max(100).required(),
        description: Joi.string().min(10).max(2000).required(),
        price: Joi.number().min(0).required(),
        stock: Joi.number().min(0).required(),
        categoryId: Joi.string().hex().length(24).required(),
        images: Joi.array().items(Joi.string()).min(1).required()
    });

    return schema.validate(product);
}

exports.Product = Product;
exports.validateProduct = validateProduct;