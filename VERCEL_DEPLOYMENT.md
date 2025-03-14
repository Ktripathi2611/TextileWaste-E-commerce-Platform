# Vercel Deployment Guide

This guide provides step-by-step instructions for deploying the TextileWaste E-commerce Platform with Vercel for the frontend and a separate service for the backend.

## Overview

Since Vercel is primarily designed for frontend applications, we'll deploy:

1. The React frontend to Vercel
2. The Node.js backend to a separate service (Heroku, Railway, Render, etc.)

## Prerequisites

- A [Vercel](https://vercel.com) account
- A [GitHub](https://github.com) account (for easy deployment)
- A separate hosting service for the backend (Heroku, Railway, Render, etc.)
- MongoDB Atlas account for the database

## Step 1: Deploy the Backend

Before deploying the frontend, you need to deploy the backend to get the API URL.

### Option 1: Deploy to Heroku

1. Create a Heroku account and install the Heroku CLI
2. Login to Heroku:
   ```bash
   heroku login
   ```
3. Create a new Heroku app:
   ```bash
   heroku create your-backend-app-name
   ```
4. Set environment variables:
   ```bash
   heroku config:set MONGODB_URI=your_mongodb_uri
   heroku config:set JWT_SECRET=your_jwt_secret
   heroku config:set NODE_ENV=production
   ```
5. Deploy only the backend directory:
   ```bash
   git subtree push --prefix backend heroku main
   ```
6. Note your backend URL: `https://your-backend-app-name.herokuapp.com`

### Option 2: Deploy to Railway

1. Create a Railway account and install the Railway CLI
2. Login to Railway:
   ```bash
   railway login
   ```
3. Initialize a new project:
   ```bash
   cd backend
   railway init
   ```
4. Set environment variables in the Railway dashboard
5. Deploy the backend:
   ```bash
   railway up
   ```
6. Note your backend URL from the Railway dashboard

## Step 2: Update Frontend Configuration

1. Update the `.env.production` file in the frontend directory:
   ```
   REACT_APP_API_URL=https://your-backend-url.com/api
   ```

## Step 3: Deploy the Frontend to Vercel

### Option 1: Deploy via Vercel CLI

1. Install Vercel CLI:
   ```bash
   npm i -g vercel
   ```
2. Login to Vercel:
   ```bash
   vercel login
   ```
3. Deploy the frontend:
   ```bash
   cd frontend
   vercel
   ```
4. Follow the prompts to complete the deployment

### Option 2: Deploy via GitHub Integration (Recommended)

1. Push your project to GitHub
2. Login to [Vercel Dashboard](https://vercel.com/dashboard)
3. Click "New Project"
4. Import your GitHub repository
5. Configure the project:
   - Set the Framework Preset to "Create React App"
   - Set the Root Directory to "frontend"
   - Add environment variables:
     - `REACT_APP_API_URL` = `https://your-backend-url.com/api`
6. Click "Deploy"

## Step 4: Configure Vercel Settings

1. Go to your project settings in the Vercel dashboard
2. Under "Build & Development Settings":
   - Build Command: `npm run vercel-build`
   - Output Directory: `build`
3. Under "Environment Variables":
   - Add `REACT_APP_API_URL` with your backend API URL

## Step 5: Test the Deployment

1. Visit your Vercel deployment URL
2. Test all functionality:
   - User registration and login
   - Product browsing and filtering
   - Cart functionality
   - Checkout process

## Troubleshooting

### CORS Issues

If you encounter CORS issues, update your backend CORS configuration:

```javascript
// In backend/server.js
app.use(
  cors({
    origin: ["https://your-vercel-app.vercel.app", "http://localhost:3000"],
    credentials: true,
  })
);
```

### API Connection Issues

If the frontend can't connect to the backend:

1. Check that `REACT_APP_API_URL` is set correctly
2. Ensure your backend is running and accessible
3. Verify that your backend CORS settings allow requests from your Vercel domain

### Build Failures

If the build fails on Vercel:

1. Check the build logs in the Vercel dashboard
2. Ensure all dependencies are correctly listed in package.json
3. Verify that the build command and output directory are correctly set

## Continuous Deployment

Vercel automatically deploys when you push changes to your GitHub repository. To take advantage of this:

1. Make changes to your code
2. Push to GitHub
3. Vercel will automatically deploy the changes

## Custom Domain

To use a custom domain:

1. Go to your project settings in the Vercel dashboard
2. Click on "Domains"
3. Add your custom domain
4. Follow the instructions to configure DNS settings

## Conclusion

Your TextileWaste E-commerce Platform is now deployed with:

- Frontend hosted on Vercel
- Backend hosted on your chosen platform
- Database on MongoDB Atlas

This setup provides a scalable, maintainable architecture for your e-commerce application.
