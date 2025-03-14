const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Product = require('../models/Product');
const { isAuthenticated, isAdmin } = require('../middleware/auth');

// Create new order
router.post('/', isAuthenticated, async (req, res) => {
    try {
        const { items, shippingAddress, paymentMethod } = req.body;

        // Validate items
        if (!items || items.length === 0) {
            return res.status(400).json({ message: 'Order must contain at least one item' });
        }

        // Calculate total amount and validate stock
        let totalAmount = 0;
        const orderItems = [];

        for (const item of items) {
            const product = await Product.findById(item.productId);

            if (!product) {
                return res.status(404).json({ message: `Product ${item.productId} not found` });
            }

            if (product.stock < item.quantity) {
                return res.status(400).json({
                    message: `Not enough stock for ${product.name}. Available: ${product.stock}`
                });
            }

            // Calculate price (considering discounts)
            const price = product.discount > 0
                ? product.price * (1 - product.discount / 100)
                : product.price;

            totalAmount += price * item.quantity;

            orderItems.push({
                product: product._id,
                quantity: item.quantity,
                price
            });

            // Update product stock
            product.stock -= item.quantity;
            await product.save();
        }

        // Create new order
        const newOrder = new Order({
            user: req.user.id,
            items: orderItems,
            totalAmount,
            shippingAddress,
            paymentMethod
        });

        const savedOrder = await newOrder.save();

        // Populate product details for response
        const populatedOrder = await Order.findById(savedOrder._id)
            .populate('items.product', 'name imageUrl');

        res.status(201).json(populatedOrder);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Get user orders
router.get('/', isAuthenticated, async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user.id })
            .populate('items.product', 'name imageUrl')
            .sort({ createdAt: -1 });

        res.json(orders);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get order by ID
router.get('/:id', isAuthenticated, async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate('items.product', 'name imageUrl description');

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Check if the order belongs to the user or user is admin
        if (order.user.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized to access this order' });
        }

        res.json(order);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Update order status (admin only)
router.put('/:id/status', isAuthenticated, isAdmin, async (req, res) => {
    try {
        const { orderStatus } = req.body;

        const updatedOrder = await Order.findByIdAndUpdate(
            req.params.id,
            { orderStatus },
            { new: true, runValidators: true }
        );

        if (!updatedOrder) {
            return res.status(404).json({ message: 'Order not found' });
        }

        res.json(updatedOrder);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Update payment status (admin only)
router.put('/:id/payment', isAuthenticated, isAdmin, async (req, res) => {
    try {
        const { paymentStatus } = req.body;

        const updatedOrder = await Order.findByIdAndUpdate(
            req.params.id,
            { paymentStatus },
            { new: true, runValidators: true }
        );

        if (!updatedOrder) {
            return res.status(404).json({ message: 'Order not found' });
        }

        res.json(updatedOrder);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = router; 