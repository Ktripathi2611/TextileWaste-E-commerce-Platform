const express = require('express');
const router = express.Router();
const SupportTicket = require('../models/SupportTicket');
const { isAuthenticated, isAdmin } = require('../middleware/auth');

// Create new support ticket
router.post('/', isAuthenticated, async (req, res) => {
    try {
        const { subject, description, category, order, product } = req.body;
        const newTicket = new SupportTicket({
            user: req.user.id,
            subject,
            description,
            category,
            order,
            product
        });

        const savedTicket = await newTicket.save();
        res.status(201).json(savedTicket);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Get user's tickets
router.get('/my-tickets', isAuthenticated, async (req, res) => {
    try {
        const tickets = await SupportTicket.find({ user: req.user.id })
            .sort({ createdAt: -1 });
        res.json(tickets);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get ticket by ID
router.get('/:id', isAuthenticated, async (req, res) => {
    try {
        const ticket = await SupportTicket.findById(req.params.id)
            .populate('user', 'firstName lastName email')
            .populate('assignedTo', 'firstName lastName email');

        if (!ticket) {
            return res.status(404).json({ message: 'Ticket not found' });
        }

        // Check if user is authorized to view the ticket
        if (ticket.user._id.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized to view this ticket' });
        }

        res.json(ticket);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Add message to ticket
router.post('/:id/messages', isAuthenticated, async (req, res) => {
    try {
        const { message, attachments } = req.body;
        const ticket = await SupportTicket.findById(req.params.id);

        if (!ticket) {
            return res.status(404).json({ message: 'Ticket not found' });
        }

        // Check if user is authorized to add message
        if (ticket.user.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized to add message to this ticket' });
        }

        ticket.messages.push({
            sender: req.user.id,
            message,
            attachments
        });

        const updatedTicket = await ticket.save();
        res.json(updatedTicket);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Update ticket status (admin only)
router.put('/:id/status', isAuthenticated, isAdmin, async (req, res) => {
    try {
        const { status } = req.body;
        const ticket = await SupportTicket.findById(req.params.id);

        if (!ticket) {
            return res.status(404).json({ message: 'Ticket not found' });
        }

        ticket.status = status;
        if (status === 'resolved') {
            ticket.resolvedAt = Date.now();
        }

        const updatedTicket = await ticket.save();
        res.json(updatedTicket);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Assign ticket (admin only)
router.put('/:id/assign', isAuthenticated, isAdmin, async (req, res) => {
    try {
        const { assignedTo } = req.body;
        const ticket = await SupportTicket.findById(req.params.id);

        if (!ticket) {
            return res.status(404).json({ message: 'Ticket not found' });
        }

        ticket.assignedTo = assignedTo;
        const updatedTicket = await ticket.save();
        res.json(updatedTicket);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Get all tickets (admin only)
router.get('/', isAuthenticated, isAdmin, async (req, res) => {
    try {
        const { status, category, priority } = req.query;
        const query = {};

        if (status) query.status = status;
        if (category) query.category = category;
        if (priority) query.priority = priority;

        const tickets = await SupportTicket.find(query)
            .populate('user', 'firstName lastName email')
            .populate('assignedTo', 'firstName lastName email')
            .sort({ createdAt: -1 });

        res.json(tickets);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router; 