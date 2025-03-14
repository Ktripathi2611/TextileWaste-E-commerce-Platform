const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    comment: {
        type: String,
        required: true
    },
    images: [String],
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const variantSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    options: [{
        name: String,
        price: Number,
        stock: Number,
        sku: String
    }]
});

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    discount: {
        type: Number,
        default: 0,
        min: 0,
        max: 100
    },
    category: {
        type: String,
        required: true,
        enum: ['clothing', 'accessories', 'home', 'crafts', 'materials']
    },
    imageUrl: {
        type: String,
        required: true
    },
    additionalImages: [String],
    stock: {
        type: Number,
        required: true,
        min: 0
    },
    featured: {
        type: Boolean,
        default: false
    },
    rating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5
    },
    reviewCount: {
        type: Number,
        default: 0
    },
    reviews: [reviewSchema],
    tags: [String],
    specifications: {
        type: Map,
        of: String
    },
    variants: [variantSchema],
    sizeGuide: {
        type: String,
        default: ''
    },
    relatedProducts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
    }],
    socialShares: {
        facebook: { type: Number, default: 0 },
        twitter: { type: Number, default: 0 },
        pinterest: { type: Number, default: 0 },
        whatsapp: { type: Number, default: 0 }
    },
    wishlistCount: {
        type: Number,
        default: 0
    },
    viewCount: {
        type: Number,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
    isFeatured: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

// Add text index for search functionality
productSchema.index({ name: 'text', description: 'text', tags: 'text' });

module.exports = mongoose.model('Product', productSchema); 