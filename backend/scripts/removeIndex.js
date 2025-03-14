require('dotenv').config();
const mongoose = require('mongoose');

const removeIndex = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        // Get the users collection
        const usersCollection = mongoose.connection.collection('users');

        // Drop the username index
        await usersCollection.dropIndex('username_1');
        console.log('Successfully removed username index');

        // Close the connection
        await mongoose.connection.close();
        console.log('Database connection closed');
    } catch (error) {
        console.error('Error removing index:', error);
        process.exit(1);
    }
};

removeIndex(); 