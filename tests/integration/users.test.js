const request = require('supertest');
const { User } = require('../../models/user');
const server = require('../../index'); // Assuming your server is exported from index.js

describe('User API', () => {
    let token;
    let user;

    beforeAll(async () => {
        user = new User({
            name: 'Test User',
            email: 'test@example.com',
            password: 'password123',
            phone: '1234567890',
            address: '123 Test St'
        });

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
        await user.save();

        // Generate a token for the user
        token = user.generateAuthToken();
    });

    afterAll(async () => {
        // Close the server after tests are done
        await server.close();
        await User.deleteMany({}); // Clean up the database
    });

    describe('GET /me', () => {
        it('should return the current user', async () => {
            const res = await request(server)
                .get('/api/users/me')
                .set('yawara-token', token);

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('_id');
            expect(res.body).toHaveProperty('name', 'Test User');
            expect(res.body).toHaveProperty('email', 'test@example.com');
            expect(res.body).not.toHaveProperty('password'); // Password should not be returned
        });
    });

    describe('POST /', () => {
        it('should return 400 if it is not a valid user', async () => {
            const res = await request(server)
                .post('/api/users')
                .send({
                    name: 'Invalid User',
                    email: 'invalid-email', // Invalid email
                    password: '123'
                });

            expect(res.status).toBe(400);
            expect(res.body).toHaveProperty('error');
        });

        it('should return 400 if user is already registered', async () => {
            const res = await request(server)
                .post('/api/users')
                .send({
                    name: 'Test User',
                    email: 'test@example.com', // Already registered email
                    password: 'password123',
                    phone: '1234567890',
                    address: '123 Test St'
                });

            expect(res.status).toBe(400);
            expect(res.text).toBe('User already registered');
        });

        it('should return user if it is valid', async () => {
            const res = await request(server)
                .post('/api/users')
                .send({
                    name: 'New User',
                    email: 'newuser@example.com',
                    password: 'newpassword123',
                    phone: '0987654321',
                    address: '456 New St'
                });

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('_id');
            expect(res.body).toHaveProperty('name', 'New User');
            expect(res.body).toHaveProperty('email', 'newuser@example.com');
            expect(res.body).not.toHaveProperty('password'); // Password should not be returned
        });
    });
});