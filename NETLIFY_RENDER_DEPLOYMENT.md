# Deployment Guide

## Netlify + Render Deployment Setup

This project uses a hybrid deployment approach:
- **Frontend (React)** → Deployed to Netlify
- **Backend (Node.js/Express)** → Deployed to Render

## Frontend Deployment (Netlify)

### 1. Connect to Netlify
1. Go to [netlify.com](https://netlify.com)
2. Connect your GitHub repository
3. Select the main branch for automatic deployments

### 2. Set Environment Variables in Netlify
In your Netlify site dashboard:
1. Go to **Site settings** > **Environment variables**
2. Add these variables:
   ```
   REACT_APP_API_URL=https://your-backend-app.onrender.com
   REACT_APP_ENV=production
   ```

### 3. Build Settings
Netlify will automatically use the `netlify.toml` configuration:
- Build command: `npm install && npm run build`
- Publish directory: `build`
- Node version: 18

## Backend Deployment (Render)

### 1. Deploy to Render
1. Connect your repository to Render
2. Create a new **Web Service**
3. Use the `render.yaml` configuration

### 2. Set Environment Variables in Render
In your Render service dashboard:
1. Add these environment variables:
   - `MONGODB_URI` (your MongoDB connection string)
   - `JWT_SECRET` (generate a secure secret)
   - `ALLOWED_ORIGINS` (your Netlify domain)
   - `NODE_ENV=production`
   - `PORT=10000`

## Local Development

1. **Backend:**
   ```bash
   cd backend
   npm install
   cp .env.example .env  # Configure your local environment
   npm run dev
   ```

2. **Frontend:**
   ```bash
   cd multi-department-system
   npm install
   cp .env.example .env  # Configure your local environment
   npm start
   ```

## Important Notes

- Update `REACT_APP_API_URL` in Netlify with your actual Render backend URL
- Update `ALLOWED_ORIGINS` in Render with your actual Netlify domain
- The frontend will make API calls to the backend URL specified in `REACT_APP_API_URL`
- Both services need to be deployed for the full application to work
