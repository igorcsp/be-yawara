const request = require('supertest')
const { Category } = require('../../models/category')
const mongoose = require('mongoose')
const { createMockUser, removeMockUsers } = require('../mocks/users');


describe('/api/categories', () => {
    let server;
    let category;
    let categoryId;
    let adminToken;
    let userToken;

    beforeAll(async () => {
        server = require('../../index')
    })

    beforeEach(async () => {
        category = new Category({ name: 'Test Category' })
        await category.save()

        categoryId = category._id

        const { token: adminAuthToken } = await createMockUser('admin');
        const { token: userAuthToken } = await createMockUser('regular');

        adminToken = adminAuthToken;
        userToken = userAuthToken;
    })

    afterEach(async () => {
        await Category.deleteMany({})
        await removeMockUsers()
    })

    afterAll(async () => {
        await server.close()
    })

    describe('GET /', () => {
        it('should return all categories', async () => {
            await Category.insertMany([
                { name: 'category1' },
                { name: 'category2' }
            ])

            const res = await request(server).get('/api/categories')

            expect(res.status).toBe(200)
            expect(res.body.length).toBe(3)
            expect(res.body.some(c => c.name === 'Test Category')).toBeTruthy()
            expect(res.body.some(c => c.name === 'category1')).toBeTruthy()
            expect(res.body.some(c => c.name === 'category2')).toBeTruthy()
        })
    })

    describe('GET /:id', () => {
        it('should return 404 if invalid id is passed', async () => {
            const res = await request(server).get('/api/categories/1')
            expect(res.status).toBe(404)
        })

        it('should return 404 if no category with the given id exists', async () => {
            const id = new mongoose.Types.ObjectId()
            const res = await request(server).get(`/api/categories/${id}`)
            expect(res.status).toBe(404)
        })

        it('should return the category if valid id is passed', async () => {
            const res = await request(server).get(`/api/categories/${categoryId}`)

            expect(res.status).toBe(200)
            expect(res.body).toHaveProperty('name', category.name)
        })
    })

    describe('POST /', () => {
        let name;

        beforeEach(() => {
            name = 'New Category'
        })

        const exec = (tokenToUse = adminToken) => {
            return request(server)
                .post('/api/categories')
                .set("Authorization", `Bearer ${tokenToUse}`)
                .send({ name })
        }

        it('should return 403 if user is not admin', async () => {
            const res = await exec(userToken)
            expect(res.status).toBe(403)
        })

        it('should return 400 if name is less than required characters', async () => {
            name = 'a'
            const res = await exec()
            expect(res.status).toBe(400)
        })

        it('should save the category if it is valid', async () => {
            await exec()

            const category = await Category.find({ name: 'New Category' })
            expect(category).not.toBeNull()
        })

        it('should return the saved category', async () => {
            const res = await exec()

            expect(res.body).toHaveProperty('_id')
            expect(res.body).toHaveProperty('name', 'New Category')
        })
    })

    describe('PUT /:id', () => {
        let newName;
        let id;

        const exec = (tokenToUse = adminToken) => {
            return request(server)
                .put(`/api/categories/${id}`)
                .set("Authorization", `Bearer ${tokenToUse}`)
                .send({ name: newName })
        }

        beforeEach(() => {
            id = categoryId
            newName = 'Updated Category'
        })

        it('should return 403 if user is not admin', async () => {
            const res = await exec(userToken)
            expect(res.status).toBe(403)
        })

        it('should return 404 if category id is invalid', async () => {
            id = 1
            const res = await exec()
            expect(res.status).toBe(404)
        })

        it('should return 404 if category is not found', async () => {
            id = new mongoose.Types.ObjectId()
            const res = await exec()
            expect(res.status).toBe(404)
        })

        it('should return 400 if name is invalid', async () => {
            newName = 'a'
            const res = await exec()
            expect(res.status).toBe(400)
        })

        it('should update the category if input is valid', async () => {
            await exec()

            const updatedCategory = await Category.findById(categoryId)
            expect(updatedCategory.name).toBe(newName)
        })

        it('should return the updated category', async () => {
            const res = await exec()

            expect(res.body).toHaveProperty('_id')
            expect(res.body).toHaveProperty('name', newName)
        })
    })

    describe('DELETE /:id', () => {
        let id;

        const exec = (tokenToUse = adminToken) => {
            return request(server)
                .delete(`/api/categories/${id}`)
                .set("Authorization", `Bearer ${tokenToUse}`)
                .send()
        }

        beforeEach(() => {
            id = categoryId
        })

        it('should return 403 if user is not admin', async () => {
            const res = await exec(userToken)
            expect(res.status).toBe(403)
        })

        it('should return 404 if category id is invalid', async () => {
            id = 1
            const res = await exec()
            expect(res.status).toBe(404)
        })

        it('should return 404 if category is not found', async () => {
            id = new mongoose.Types.ObjectId()
            const res = await exec()
            expect(res.status).toBe(404)
        })

        it('should delete the category if id is valid', async () => {
            await exec()

            const categoryInDb = await Category.findById(id)
            expect(categoryInDb).toBeNull()
        })

        it('should return the removed category', async () => {
            const res = await exec()

            expect(res.body).toHaveProperty('_id')
            expect(res.body).toHaveProperty('name', category.name)
        })
    })
})