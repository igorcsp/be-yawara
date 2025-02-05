const request = require('supertest')
const { User } = require('../../models/user')
const bcrypt = require('bcrypt')

describe('/api/users', () => {
    let server;
    let token;
    let user;

    beforeAll(async () => {
        server = require('../../index')

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
        });

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
        await user.save();

        token = user.generateAuthToken();
    })

    afterAll(async () => {
        await server.close()
        await User.deleteMany({})
    })

    describe('GET /me', () => {
        const exec = () => {
            return request(server)
                .get('/api/users/me')
                .set('yawara-token', token);
        }

        it('should return 401 if user is not logged in', async () => {
            token = '';
            const res = await exec()
            expect(res.status).toBe(401)
        })

        it('should return the current user', async () => {
            token = user.generateAuthToken();
            const res = await exec()
            expect(res.status).toBe(200)
            expect(res.body).toHaveProperty('_id', user._id.toString())
            expect(res.body).toHaveProperty('email', user.email)
        })
    })

    // describe('POST /', () => {
    //     let newUser;

    //     beforeEach(() => {
    //         newUser = {
    //             name: 'New User',
    //             email: 'new@example.com',
    //             password: 'newpass123',
    //             phone: '0987654321',
    //             address: {
    //                 street: '456 New St',
    //                 city: 'New City',
    //                 state: 'NS',
    //                 zipCode: '54321'
    //             }
    //         }
    //     })

    //     const exec = () => {
    //         return request(server)
    //             .post('/api/users')
    //             .send(newUser);
    //     }

    //     it('should return 400 if it is not a valid user', async () => {
    //         newUser.email = 'invalid-email';
    //         const res = await exec();
    //         expect(res.status).toBe(400);
    //     })

    //     it('should return 400 if user is already registered', async () => {
    //         newUser.email = user.email;
    //         const res = await exec();
    //         expect(res.status).toBe(400);
    //     })

    //     it('should save user if it is valid', async () => {
    //         const res = await exec();
    //         expect(res.status).toBe(200);
    //         expect(res.header).toHaveProperty('yawara-token');
    //         expect(res.body).toHaveProperty('_id');
    //         expect(res.body).toHaveProperty('email', newUser.email);

    //         const userInDb = await User.findOne({ email: newUser.email });
    //         expect(userInDb).not.toBeNull();
    //     })
    // })
})