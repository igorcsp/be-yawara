const express = require('express')
const users = require('../routes/users')
const products = require('../routes/products')
const categories = require('../routes/categories')
const auth = require('../routes/auth')
const error = require('../middleware/error')
const cors = require('cors')

module.exports = function (app) {
    app.use(cors({ origin: 'http://localhost:5173' }));
    app.use(express.json())
    app.use('/api/users', users)
    app.use('/api/products', products)
    app.use('/api/categories', categories)
    app.use('/api/auth', auth)
    app.use(error)
}