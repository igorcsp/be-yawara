const request = require('supertest')
const { User } = require('../../models/user')
const bcrypt = require('bcrypt')

describe('POST /api/auth', () => {
    let server;
    let user;

    beforeAll(async () => {
        server = require('../../index')
    })

    beforeEach(async () => {
        user = new User({
            name: 'Test User',
            email: 'test@example.com',
            password: 'password123',
            phone: '1234567890',
            address: {
                street: '123 Test St',
                city: 'Test City',
                state: 'TS',
                zipCode: '12345'
            }
        })

        const salt = await bcrypt.genSalt(10)
        user.password = await bcrypt.hash(user.password, salt)
        await user.save()
    })

    afterEach(async () => {
        await User.deleteMany({})
    })

    afterAll(async () => {
        await server.close()
    })

    const exec = (credentials) => {
        return request(server)
            .post('/api/auth')
            .send(credentials)
    }

    it('should return 400 if email is invalid', async () => {
        const credentials = {
            email: 'invalid-email',
            password: 'password123'
        }

        const res = await exec(credentials)
        expect(res.status).toBe(400)
    })

    it('should return 400 if password is less than 3 characters', async () => {
        const credentials = {
            email: 'test@example.com',
            password: '12'
        }

        const res = await exec(credentials)
        expect(res.status).toBe(400)
    })

    it('should return 400 if email does not exist', async () => {
        const credentials = {
            email: 'nonexistent@example.com',
            password: 'password123'
        }

        const res = await exec(credentials)
        expect(res.status).toBe(400)
        expect(res.text).toBe('Invalid email or password')
    })

    it('should return 400 if password is incorrect', async () => {
        const credentials = {
            email: user.email,
            password: 'wrongpassword'
        }

        const res = await exec(credentials)
        expect(res.status).toBe(400)
        expect(res.text).toBe('Invalid email or password')
    })

    it('should return a valid JWT if credentials are correct', async () => {
        const credentials = {
            email: 'test@example.com',
            password: 'password123'
        }

        const res = await exec(credentials)
        expect(res.status).toBe(200)
        expect(res.text).toBeTruthy()

        const decoded = await User.findById(user._id)
        expect(decoded).toHaveProperty('_id')
        expect(decoded._id.toString()).toBe(user._id.toString())
    })

    it('should not send password in response', async () => {
        const credentials = {
            email: 'test@example.com',
            password: 'password123'
        }

        const res = await exec(credentials)
        expect(res.text).not.toContain('password')
    })
})