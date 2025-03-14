require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('../models/Product');

const sampleProducts = [
    {
        name: "Recycled Denim Jacket",
        description: "Stylish jacket made from recycled denim, featuring a modern cut and sustainable materials.",
        price: 89.99,
        discount: 10,
        category: "clothing",
        imageUrl: "https://images.unsplash.com/photo-1551028719-00167b16eac5?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        additionalImages: [
            "https://images.unsplash.com/photo-1551028719-00167b16eac5?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1551028719-00167b16eac5?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
        ],
        stock: 50,
        featured: true,
        rating: 4.5,
        reviewCount: 12,
        tags: ["denim", "jacket", "recycled", "sustainable"],
        specifications: {
            "Material": "Recycled Denim",
            "Care Instructions": "Machine wash cold",
            "Origin": "Made in USA"
        }
    },
    {
        name: "Eco-Friendly Tote Bag",
        description: "Handmade tote bag crafted from recycled textiles, perfect for shopping and everyday use.",
        price: 39.99,
        discount: 0,
        category: "accessories",
        imageUrl: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        additionalImages: [
            "https://images.unsplash.com/photo-1584917865442-de89df76afd3?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1584917865442-de89df76afd3?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
        ],
        stock: 100,
        featured: true,
        rating: 4.8,
        reviewCount: 25,
        tags: ["bag", "tote", "recycled", "handmade"],
        specifications: {
            "Material": "Recycled Textiles",
            "Dimensions": "15\" x 12\" x 4\"",
            "Weight": "0.5 lbs"
        }
    },
    {
        name: "Sustainable Throw Pillow",
        description: "Beautiful throw pillow made from recycled fabric scraps, adding eco-friendly style to your home.",
        price: 49.99,
        discount: 15,
        category: "home",
        imageUrl: "https://images.unsplash.com/photo-1584100936595-9f0a89efd63f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        additionalImages: [
            "https://images.unsplash.com/photo-1584100936595-9f0a89efd63f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1584100936595-9f0a89efd63f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
        ],
        stock: 75,
        featured: true,
        rating: 4.6,
        reviewCount: 18,
        tags: ["pillow", "home", "recycled", "decor"],
        specifications: {
            "Material": "Recycled Fabric",
            "Size": "18\" x 18\"",
            "Care Instructions": "Spot clean only"
        }
    },
    {
        name: "Recycled Yarn Set",
        description: "Set of colorful yarns made from recycled textiles, perfect for crafting and DIY projects.",
        price: 29.99,
        discount: 0,
        category: "crafts",
        imageUrl: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        additionalImages: [
            "https://images.unsplash.com/photo-1584917865442-de89df76afd3?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1584917865442-de89df76afd3?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
        ],
        stock: 150,
        featured: false,
        rating: 4.7,
        reviewCount: 30,
        tags: ["yarn", "crafts", "recycled", "DIY"],
        specifications: {
            "Material": "Recycled Textiles",
            "Weight": "100g per skein",
            "Length": "200m per skein"
        }
    },
    {
        name: "Eco-Friendly Fabric Bundle",
        description: "Assorted bundle of recycled fabrics, ideal for sewing and upcycling projects.",
        price: 79.99,
        discount: 20,
        category: "materials",
        imageUrl: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        additionalImages: [
            "https://images.unsplash.com/photo-1584917865442-de89df76afd3?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1584917865442-de89df76afd3?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
        ],
        stock: 40,
        featured: true,
        rating: 4.9,
        reviewCount: 15,
        tags: ["fabric", "materials", "recycled", "sewing"],
        specifications: {
            "Material": "Assorted Recycled Fabrics",
            "Weight": "2 lbs",
            "Contents": "Various patterns and colors"
        }
    },
    {
        name: "Sustainable Summer Dress",
        description: "Light and breezy dress made from recycled cotton, perfect for warm weather.",
        price: 129.99,
        discount: 0,
        category: "clothing",
        imageUrl: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        additionalImages: [
            "https://images.unsplash.com/photo-1584917865442-de89df76afd3?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1584917865442-de89df76afd3?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
        ],
        stock: 35,
        featured: true,
        rating: 4.7,
        reviewCount: 22,
        tags: ["dress", "summer", "recycled", "sustainable"],
        specifications: {
            "Material": "Recycled Cotton",
            "Care Instructions": "Machine wash cold",
            "Origin": "Made in USA"
        }
    },
    {
        name: "Recycled Scarf",
        description: "Stylish scarf made from recycled wool, keeping you warm and eco-conscious.",
        price: 45.99,
        discount: 10,
        category: "accessories",
        imageUrl: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        additionalImages: [
            "https://images.unsplash.com/photo-1584917865442-de89df76afd3?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1584917865442-de89df76afd3?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
        ],
        stock: 60,
        featured: false,
        rating: 4.6,
        reviewCount: 16,
        tags: ["scarf", "accessories", "recycled", "winter"],
        specifications: {
            "Material": "Recycled Wool",
            "Dimensions": "180cm x 30cm",
            "Care Instructions": "Dry clean only"
        }
    },
    {
        name: "Eco-Friendly Table Runner",
        description: "Beautiful table runner crafted from recycled textiles, adding sustainable style to your dining table.",
        price: 59.99,
        discount: 0,
        category: "home",
        imageUrl: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        additionalImages: [
            "https://images.unsplash.com/photo-1584917865442-de89df76afd3?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1584917865442-de89df76afd3?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
        ],
        stock: 45,
        featured: true,
        rating: 4.8,
        reviewCount: 20,
        tags: ["table", "home", "recycled", "decor"],
        specifications: {
            "Material": "Recycled Textiles",
            "Dimensions": "180cm x 40cm",
            "Care Instructions": "Machine wash cold"
        }
    }
];

const seedDatabase = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        // Clear existing products
        await Product.deleteMany({});
        console.log('Cleared existing products');

        // Insert sample products
        const insertedProducts = await Product.insertMany(sampleProducts);
        console.log(`Successfully inserted ${insertedProducts.length} products`);

        // Close the connection
        await mongoose.connection.close();
        console.log('Database connection closed');
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
};

seedDatabase(); 