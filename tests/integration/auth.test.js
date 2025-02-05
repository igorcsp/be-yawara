const request = require('supertest');
const { User } = require('../../models/user');
const bcrypt = require('bcrypt');

describe('/api/auth', () => {
    let server;
    let user;

    beforeAll(async () => {
        server = require('../../index');


    });

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
        });

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
        await user.save();
    })

    afterEach(async () => {
        await User.deleteMany({});

    })

    afterAll(async () => {
        await server.close();
    });

    describe('POST /login', () => {
        const execLogin = (credentials) => {
            return request(server)
                .post('/api/auth/login')
                .send(credentials);
        };

        it('should return 400 if email is invalid', async () => {
            const credentials = {
                email: 'invalid-email',
                password: 'password123'
            };

            const res = await execLogin(credentials);
            expect(res.status).toBe(400);
        });

        it('should return 400 if password is less than 3 characters', async () => {
            const credentials = {
                email: 'test@example.com',
                password: '12'
            };

            const res = await execLogin(credentials);
            expect(res.status).toBe(400);
        });

        it('should return 400 if email does not exist', async () => {
            const credentials = {
                email: 'nonexistent@example.com',
                password: 'password123'
            };

            const res = await execLogin(credentials);
            expect(res.status).toBe(400);
            expect(res.text).toBe('Invalid email or password');
        });

        it('should return 400 if password is incorrect', async () => {
            const credentials = {
                email: user.email,
                password: 'wrongpassword'
            };

            const res = await execLogin(credentials);
            expect(res.status).toBe(400);
            expect(res.text).toBe('Invalid email or password');
        });

        it('should not send password in response', async () => {
            const credentials = {
                email: 'test@example.com',
                password: 'password123'
            };

            const res = await execLogin(credentials);
            expect(res.text).not.toContain('password');
        });
    });

    describe('POST /register', () => {
        let newUser;

        beforeEach(() => {
            newUser = {
                name: 'New User',
                email: 'new@example.com',
                password: 'newpass123',
                phone: '0987654321',
                address: {
                    street: '456 New St',
                    city: 'New City',
                    state: 'NS',
                    zipCode: '54321'
                }
            };
        });

        const execRegister = () => {
            return request(server)
                .post('/api/auth/register')
                .send(newUser);
        };

        it('should return 400 if it is not a valid user', async () => {
            newUser.email = 'invalid-email';
            const res = await execRegister();
            expect(res.status).toBe(400);
        });

        it('should return 400 if user is already registered', async () => {
            newUser.email = user.email;
            const res = await execRegister();
            expect(res.status).toBe(400);
        });

        it('should save user if it is valid', async () => {
            const res = await execRegister();
            expect(res.status).toBe(200);
            expect(res.header).toHaveProperty('yawara-token');
            expect(res.body).toHaveProperty('_id');
            expect(res.body).toHaveProperty('email', newUser.email);

            const userInDb = await User.findOne({ email: newUser.email });
            expect(userInDb).not.toBeNull();
        });
    });
});