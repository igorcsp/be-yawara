const request = require('supertest');
const mongoose = require('mongoose');
const { Product } = require('../../models/product');
const { Category } = require('../../models/category');
const { createMockUser, removeMockUsers } = require('../mocks/users');
const { createMockProduct, mockProducts, removeMockProducts } = require('../mocks/products');

describe('/api/products', () => {
    let server;
    let product;
    let category;
    let productId;
    let categoryId;
    let token;
    let userToken;

    beforeAll(async () => {
        server = require('../../index');
        category = new Category({ name: 'Test Category' });
        await category.save();
        categoryId = category._id;
    });

    beforeEach(async () => {
        // Create admin user and get token
        const { token: adminAuthToken } = await createMockUser('admin');
        token = adminAuthToken;

        // Create regular user and get token
        const { token: regularUserToken } = await createMockUser('regular');
        userToken = regularUserToken;

        // Create test product
        product = await createMockProduct(categoryId);
        productId = product._id;
    });

    afterEach(async () => {
        await removeMockProducts();
        await removeMockUsers();
    });

    afterAll(async () => {
        await Category.deleteMany({});
        await server.close();
    });

    describe('GET /', () => {
        it('should return all products', async () => {
            const products = [
                mockProducts.product1(categoryId),
                mockProducts.product2(categoryId)
            ];
            await Product.insertMany(products);

            const res = await request(server).get('/api/products');

            expect(res.status).toBe(200);
            expect(res.body.length).toBe(3);
            expect(res.body.some(p => p.name === product.name)).toBeTruthy();
            expect(res.body.some(p => p.name === 'Product 1')).toBeTruthy();
            expect(res.body.some(p => p.name === 'Product 2')).toBeTruthy();
        });
    });

    describe('GET /:id', () => {
        it('should return 404 if invalid id is passed', async () => {
            const res = await request(server).get('/api/products/1');
            expect(res.status).toBe(404);
        });

        it('should return 404 if no product with given id exists', async () => {
            const id = new mongoose.Types.ObjectId();
            const res = await request(server).get(`/api/products/${id}`);
            expect(res.status).toBe(404);
        });

        it('should return product if valid id is passed', async () => {
            const res = await request(server).get(`/api/products/${productId}`);

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('name', product.name);
            expect(res.body).toHaveProperty('description', product.description);
            expect(res.body).toHaveProperty('price', product.price);
            expect(res.body).toHaveProperty('stock', product.stock);
        });
    });

    describe('POST /', () => {
        let newProduct;

        beforeEach(() => {
            newProduct = mockProducts.newProduct(categoryId);
        });

        const exec = (authToken = token) => {
            return request(server)
                .post('/api/products')
                .set('yawara-token', authToken)
                .send(newProduct);
        };

        it('should return 403 if user is not admin', async () => {
            const res = await exec(userToken);
            expect(res.status).toBe(403);
        });

        it('should return 400 if product validation fails', async () => {
            newProduct.name = 'a';
            const res = await exec();
            expect(res.status).toBe(400);
        });

        it('should return 400 if category id is invalid', async () => {
            newProduct.categoryId = 'invalid-id';
            const res = await exec();
            expect(res.status).toBe(400);
        });

        it('should save product if it is valid', async () => {
            await exec();

            const product = await Product.findOne({ name: newProduct.name });
            expect(product).not.toBeNull();
            expect(product.category._id.toString()).toBe(categoryId.toString());
        });

        it('should return the product if valid', async () => {
            const res = await exec();

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('_id');
            expect(res.body).toHaveProperty('name', newProduct.name);
            expect(res.body.category).toHaveProperty('_id', categoryId.toString());
        });
    });

    describe('PUT /:id', () => {
        let updatedProduct;
        let id;

        beforeEach(() => {
            id = productId;
            updatedProduct = mockProducts.updatedProduct(categoryId);
        });

        const exec = (authToken = token) => {
            return request(server)
                .put(`/api/products/${id}`)
                .set('yawara-token', authToken)
                .send(updatedProduct);
        };

        it('should return 403 if user is not admin', async () => {
            const res = await exec(userToken);
            expect(res.status).toBe(403);
        });

        it('should return 404 if product id is invalid', async () => {
            id = 1;
            const res = await exec();
            expect(res.status).toBe(404);
        });

        it('should return 400 if product validation fails', async () => {
            updatedProduct.name = 'a';
            const res = await exec();
            expect(res.status).toBe(400);
        });

        it('should return 400 if category id is invalid', async () => {
            updatedProduct.categoryId = 'invalid-id';
            const res = await exec();
            expect(res.status).toBe(400);
        });

        it('should update product if input is valid', async () => {
            await exec();

            const updatedProductInDb = await Product.findById(productId);
            expect(updatedProductInDb.name).toBe(updatedProduct.name);
            expect(updatedProductInDb.price).toBe(updatedProduct.price);
            expect(updatedProductInDb.category._id.toString()).toBe(categoryId.toString());
        });

        it('should return updated product', async () => {
            const res = await exec();

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('name', updatedProduct.name);
            expect(res.body.category).toHaveProperty('_id', categoryId.toString());
        });
    });

    describe('DELETE /:id', () => {
        let id;

        const exec = (authToken = token) => {
            return request(server)
                .delete(`/api/products/${id}`)
                .set('yawara-token', authToken);
        };

        beforeEach(() => {
            id = productId;
        });

        it('should return 403 if user is not admin', async () => {
            const res = await exec(userToken);
            expect(res.status).toBe(403);
        });

        it('should return 404 if id is invalid', async () => {
            id = 1;
            const res = await exec();
            expect(res.status).toBe(404);
        });

        it('should return 404 if product with given id was not found', async () => {
            id = new mongoose.Types.ObjectId();
            const res = await exec();
            expect(res.status).toBe(404);
        });

        it('should delete product if id is valid', async () => {
            await exec();

            const productInDb = await Product.findById(id);
            expect(productInDb).toBeNull();
        });

        it('should return deleted product', async () => {
            const res = await exec();

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('_id', productId.toString());
            expect(res.body).toHaveProperty('name', product.name);
        });
    });
});