require('dotenv').config();
const axios = require('axios');

const createTestUser = async () => {
    try {
        const userData = {
            email: 'test@example.com',
            password: 'Test123!',
            firstName: 'Test',
            lastName: 'User',
            username: 'testuser'
        };

        const response = await axios.post('http://localhost:5000/api/auth/register', userData);
        console.log('Test user created successfully:', response.data);
    } catch (error) {
        console.error('Error creating test user:', error.response?.data || error.message);
    }
};

createTestUser(); 