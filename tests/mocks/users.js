const mongoose = require('mongoose');
const { User } = require('../../models/user');

const mockUsers = {
    admin: {
        name: 'Test Admin User',
        email: 'admin@test.com',
        password: 'password123',
        isAdmin: true,
        phone: '1234567890',
        address: {
            street: 'Admin Street',
            city: 'Admin City',
            state: 'SP',
            zipCode: '12345-678'
        }
    },
    regular: {
        name: 'Test Regular User',
        email: 'user@test.com',
        password: 'password123',
        isAdmin: false,
        phone: '1234567890',
        address: {
            street: 'User Street',
            city: 'User City',
            state: 'SP',
            zipCode: '12345-678'
        }
    }
};

async function createMockUser(type = 'regular') {
    const userData = mockUsers[type];
    const user = new User(userData);
    await user.save();
    const token = user.generateAuthToken();
    return { user, token };
}

async function removeMockUsers() {
    await User.deleteMany({});
}

module.exports = {
    mockUsers,
    createMockUser,
    removeMockUsers
};

