# TextileWaste E-commerce Platform

A modern, sustainable e-commerce platform focused on reducing textile waste by offering products made from recycled materials.

## Features

- 🛍️ **Product Catalog**

  - Browse products by category
  - Search functionality
  - Filter by price range
  - Sort by various criteria
  - Featured products section

- 👤 **User Authentication**

  - User registration and login
  - Secure password handling
  - JWT-based authentication

- 🛒 **Shopping Cart**

  - Add/remove items
  - Update quantities
  - Real-time total calculation
  - Persistent cart state

- 💳 **Checkout Process**

  - Multi-step checkout
  - Shipping information collection
  - Payment method selection
  - Order confirmation

- 📱 **Responsive Design**
  - Mobile-friendly interface
  - Modern UI components
  - Smooth transitions and animations

## Technology Stack

### Frontend

- React.js
- React Router for navigation
- Zustand for state management
- Tailwind CSS for styling
- Heroicons for icons
- Axios for API calls

### Backend

- Node.js with Express
- MongoDB with Mongoose
- JWT for authentication
- Morgan for logging
- CORS enabled

## Prerequisites

- Node.js (v14 or higher)
- MongoDB
- npm or yarn

## Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/textile-waste.git
cd textile-waste
```

2. Install dependencies:

```bash
npm run install-all
```

3. Set up environment variables:
   Create a `.env` file in the backend directory with the following variables:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
NODE_ENV=development
```

4. Seed the database with sample products:

```bash
cd backend
npm run seed
```

## Running the Application

1. Start both frontend and backend servers:

```bash
npm start
```

This will start:

- Frontend on http://localhost:3000
- Backend on http://localhost:5000

2. For development:

```bash
# Start backend in development mode
npm run server

# Start frontend in development mode
npm run client
```

## Deployment

This project is ready for deployment to various platforms.

### Vercel Deployment (Frontend)

For detailed instructions, see [VERCEL_DEPLOYMENT.md](VERCEL_DEPLOYMENT.md).

Quick deployment:

```bash
# Prepare and deploy to Vercel
npm run deploy:vercel
```

### Heroku Deployment (Full Stack)

```bash
# Login to Heroku
heroku login

# Create a new Heroku app
heroku create your-app-name

# Set environment variables
heroku config:set MONGODB_URI=your_mongodb_uri
heroku config:set JWT_SECRET=your_jwt_secret
heroku config:set NODE_ENV=production

# Push to Heroku
git push heroku main
```

### Docker Deployment

```bash
# Build and run with Docker Compose
docker-compose up -d
```

## API Endpoints

### Products

- `GET /api/products` - Get all products
- `GET /api/products/featured` - Get featured products
- `GET /api/products/search` - Search products
- `GET /api/products/:id` - Get product by ID

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile

### Orders

- `POST /api/orders` - Create new order
- `GET /api/orders` - Get user orders
- `GET /api/orders/:id` - Get order by ID

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contact

Your Name - your.email@example.com
Project Link: https://github.com/yourusername/textile-waste
