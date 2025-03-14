const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { isAuthenticated } = require('../middleware/auth');

// Helper function to generate a unique username
const generateUniqueUsername = async (firstName, lastName) => {
    const baseUsername = `${firstName.toLowerCase()}${lastName.toLowerCase()}`;
    let username = baseUsername;
    let counter = 1;

    while (true) {
        const existingUser = await User.findOne({ username });
        if (!existingUser) {
            return username;
        }
        username = `${baseUsername}${counter}`;
        counter++;
    }
};

// Register new user
router.post('/register', async (req, res) => {
    try {
        const { email, password, firstName, lastName, username } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ $or: [{ email }, { username }] });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Generate username if not provided
        const finalUsername = username || await generateUniqueUsername(firstName, lastName);

        // Create new user
        const newUser = new User({
            email,
            password,
            firstName,
            lastName,
            username: finalUsername
        });

        await newUser.save();

        // Generate JWT token
        const token = jwt.sign(
            { id: newUser._id, role: newUser.role },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.status(201).json({
            token,
            user: {
                id: newUser._id,
                email: newUser.email,
                username: newUser.username,
                firstName: newUser.firstName,
                lastName: newUser.lastName,
                role: newUser.role
            }
        });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Login user
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Check password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Generate JWT token
        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.json({
            token,
            user: {
                id: user._id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                role: user.role
            }
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get user profile
router.get('/profile', isAuthenticated, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Update user profile
router.put('/profile', isAuthenticated, async (req, res) => {
    try {
        const { firstName, lastName, phoneNumber } = req.body;

        const updatedUser = await User.findByIdAndUpdate(
            req.user.id,
            { firstName, lastName, phoneNumber },
            { new: true, runValidators: true }
        ).select('-password');

        res.json(updatedUser);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Add address to user
router.post('/address', isAuthenticated, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        // If this is the first address, make it default
        const isDefault = user.addresses.length === 0;

        user.addresses.push({
            ...req.body,
            isDefault
        });

        await user.save();

        res.status(201).json(user.addresses);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Set default address
router.put('/address/:addressId/default', isAuthenticated, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        // Reset all addresses to non-default
        user.addresses.forEach(address => {
            address.isDefault = false;
        });

        // Set the specified address as default
        const address = user.addresses.id(req.params.addressId);
        if (!address) {
            return res.status(404).json({ message: 'Address not found' });
        }

        address.isDefault = true;
        await user.save();

        res.json(user.addresses);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = router; 