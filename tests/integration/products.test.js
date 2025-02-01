const request = require('supertest')
const mongoose = require('mongoose')
const { Product } = require('../../models/product')
const { Category } = require('../../models/category')

describe('/api/products', () => {
    let server
    let product
    let category
    let productId
    let categoryId

    beforeAll(async () => {
        server = require('../../index')

        // Criar categoria para usar nos testes
        category = new Category({ name: 'Test Category' })
        await category.save()
        categoryId = category._id
    })

    beforeEach(async () => {
        // Criar produto para testes
        product = new Product({
            name: 'Test Product',
            description: 'Test description',
            price: 99.99,
            stock: 10,
            category: {
                _id: categoryId,
                name: category.name
            },
            images: ['image1.jpg', 'image2.jpg']
        })
        await product.save()
        productId = product._id
    })

    afterEach(async () => {
        await Product.deleteMany({})
    })

    afterAll(async () => {
        await Category.deleteMany({})
        await server.close()
    })

    describe('GET /', () => {
        it('should return all products', async () => {
            // Criar produtos adicionais
            await Product.insertMany([
                {
                    name: 'Product 1',
                    description: 'Description 1',
                    price: 19.99,
                    stock: 5,
                    category: { _id: categoryId, name: category.name },
                    images: ['img1.jpg']
                },
                {
                    name: 'Product 2',
                    description: 'Description 2',
                    price: 29.99,
                    stock: 8,
                    category: { _id: categoryId, name: category.name },
                    images: ['img2.jpg']
                }
            ])

            const res = await request(server).get('/api/products')

            expect(res.status).toBe(200)
            expect(res.body.length).toBe(3)
            expect(res.body.some(p => p.name === 'Test Product')).toBeTruthy()
            expect(res.body.some(p => p.name === 'Product 1')).toBeTruthy()
            expect(res.body.some(p => p.name === 'Product 2')).toBeTruthy()
        })
    })

    describe('GET /:id', () => {
        it('should return 404 if invalid id is passed', async () => {
            const res = await request(server).get('/api/products/1')
            expect(res.status).toBe(404)
        })

        it('should return 404 if no product with given id exists', async () => {
            const id = new mongoose.Types.ObjectId()
            const res = await request(server).get(`/api/products/${id}`)
            expect(res.status).toBe(404)
        })

        it('should return product if valid id is passed', async () => {
            const res = await request(server).get(`/api/products/${productId}`)

            expect(res.status).toBe(200)
            expect(res.body).toHaveProperty('name', product.name)
            expect(res.body).toHaveProperty('description', product.description)
            expect(res.body).toHaveProperty('price', product.price)
            expect(res.body).toHaveProperty('stock', product.stock)
            expect(res.body.category).toHaveProperty('_id', categoryId.toString())
        })
    })

    describe('POST /', () => {
        let newProduct

        beforeEach(() => {
            newProduct = {
                name: 'New Product',
                description: 'New description',
                price: 49.99,
                stock: 15,
                categoryId: categoryId,
                images: ['new1.jpg', 'new2.jpg']
            }
        })

        const exec = () => {
            return request(server)
                .post('/api/products')
                .send(newProduct)
        }

        it('should return 400 if product validation fails', async () => {
            newProduct.name = 'a' // nome muito curto
            const res = await exec()
            expect(res.status).toBe(400)
        })

        it('should return 400 if category id is invalid', async () => {
            newProduct.categoryId = 'invalid-id'
            const res = await exec()
            expect(res.status).toBe(400)
        })

        it('should save product if it is valid', async () => {
            await exec()

            const product = await Product.findOne({ name: 'New Product' })
            expect(product).not.toBeNull()
            expect(product.category._id.toString()).toBe(categoryId.toString())
        })

        it('should return the product if valid', async () => {
            const res = await exec()

            expect(res.status).toBe(200)
            expect(res.body).toHaveProperty('_id')
            expect(res.body).toHaveProperty('name', 'New Product')
            expect(res.body.category).toHaveProperty('_id', categoryId.toString())
        })
    })

    describe('PUT /:id', () => {
        let updatedProduct
        let id

        beforeEach(() => {
            id = productId
            updatedProduct = {
                name: 'Updated Product',
                description: 'Updated description',
                price: 79.99,
                stock: 20,
                categoryId: categoryId,
                images: ['updated1.jpg', 'updated2.jpg']
            }
        })

        const exec = () => {
            return request(server)
                .put(`/api/products/${id}`)
                .send(updatedProduct)
        }

        it('should return 404 if product id is invalid', async () => {
            id = 1
            const res = await exec()
            expect(res.status).toBe(404)
        })

        it('should return 400 if product validation fails', async () => {
            updatedProduct.name = 'a'
            const res = await exec()
            expect(res.status).toBe(400)
        })

        it('should return 400 if category id is invalid', async () => {
            updatedProduct.categoryId = 'invalid-id'
            const res = await exec()
            expect(res.status).toBe(400)
        })

        it('should update product if input is valid', async () => {
            await exec()

            const updatedProductInDb = await Product.findById(productId)
            expect(updatedProductInDb.name).toBe(updatedProduct.name)
            expect(updatedProductInDb.price).toBe(updatedProduct.price)
            expect(updatedProductInDb.category._id.toString()).toBe(categoryId.toString())
        })

        it('should return updated product', async () => {
            const res = await exec()

            expect(res.status).toBe(200)
            expect(res.body).toHaveProperty('name', updatedProduct.name)
            expect(res.body.category).toHaveProperty('_id', categoryId.toString())
        })
    })

    describe('DELETE /:id', () => {
        let id

        const exec = () => {
            return request(server)
                .delete(`/api/products/${id}`)
        }

        beforeEach(() => {
            id = productId
        })

        it('should return 404 if id is invalid', async () => {
            id = 1
            const res = await exec()
            expect(res.status).toBe(404)
        })

        it('should return 404 if product with given id was not found', async () => {
            id = new mongoose.Types.ObjectId()
            const res = await exec()
            expect(res.status).toBe(404)
        })

        it('should delete product if id is valid', async () => {
            await exec()

            const productInDb = await Product.findById(id)
            expect(productInDb).toBeNull()
        })

        it('should return deleted product', async () => {
            const res = await exec()

            expect(res.status).toBe(200)
            expect(res.body).toHaveProperty('_id', productId.toString())
            expect(res.body).toHaveProperty('name', product.name)
        })
    })
})