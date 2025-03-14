const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const { isAuthenticated, isAdmin } = require('../middleware/auth');

// Get all products with pagination and filtering
router.get('/', async (req, res) => {
    try {
        const {
            page = 1,
            limit = 12,
            category,
            minPrice,
            maxPrice,
            sort = 'createdAt',
            order = 'desc'
        } = req.query;

        const query = {};

        // Apply filters if provided
        if (category) query.category = category;
        if (minPrice || maxPrice) {
            query.price = {};
            if (minPrice) query.price.$gte = Number(minPrice);
            if (maxPrice) query.price.$lte = Number(maxPrice);
        }

        // Count total documents for pagination
        const total = await Product.countDocuments(query);

        // Build sort object
        const sortObj = {};
        sortObj[sort] = order === 'asc' ? 1 : -1;

        // Fetch products
        const products = await Product.find(query)
            .sort(sortObj)
            .limit(Number(limit))
            .skip((Number(page) - 1) * Number(limit));

        res.json({
            products,
            totalPages: Math.ceil(total / Number(limit)),
            currentPage: Number(page),
            total
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get featured products
router.get('/featured', async (req, res) => {
    try {
        const featuredProducts = await Product.find({ isFeatured: true })
            .limit(8)
            .select('name description price imageUrl discount');
        res.json(featuredProducts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Search products
router.get('/search', async (req, res) => {
    try {
        const { q } = req.query;
        if (!q) return res.status(400).json({ message: 'Search query is required' });

        const products = await Product.find(
            { $text: { $search: q } },
            { score: { $meta: 'textScore' } }
        )
            .sort({ score: { $meta: 'textScore' } })
            .limit(20);

        res.json(products);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get product by ID
router.get('/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: 'Product not found' });
        res.json(product);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Create new product (admin only)
router.post('/', isAuthenticated, isAdmin, async (req, res) => {
    try {
        const newProduct = new Product(req.body);
        const savedProduct = await newProduct.save();
        res.status(201).json(savedProduct);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Update product (admin only)
router.put('/:id', isAuthenticated, isAdmin, async (req, res) => {
    try {
        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!updatedProduct) return res.status(404).json({ message: 'Product not found' });
        res.json(updatedProduct);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Delete product (admin only)
router.delete('/:id', isAuthenticated, isAdmin, async (req, res) => {
    try {
        const deletedProduct = await Product.findByIdAndDelete(req.params.id);
        if (!deletedProduct) return res.status(404).json({ message: 'Product not found' });
        res.json({ message: 'Product deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router; 