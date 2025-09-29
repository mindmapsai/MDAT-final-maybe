# Vercel Deployment Guide

## Quick Setup for Vercel

### 1. Connect Repository
- Go to [vercel.com](https://vercel.com)
- Import your GitHub repository
- Vercel will auto-detect the `vercel.json` configuration

### 2. Root Directory
In Vercel dashboard, set the **Root Directory** to `./` (root of your repository)

### 3. Environment Variables
Add these in Vercel dashboard under **Settings > Environment Variables**:
```
REACT_APP_API_URL=https://your-backend-app.onrender.com
REACT_APP_ENV=production
```

### 4. Build Configuration
Vercel will use the `vercel.json` file which specifies:
- **Build Command**: `npm run build`
- **Output Directory**: `build`
- **Install Command**: `npm install`

## Project Structure
```
Your Repository/
├── multi-department-system/     # React app
│   ├── package.json
│   ├── src/
│   ├── public/
│   └── build/                  # Build output (created during deployment)
├── backend/                    # Node.js backend (deploy to Render)
├── vercel.json                 # Vercel configuration
└── netlify.toml               # Alternative Netlify config
```

## Backend Deployment
Keep your backend deployed on Render:
- Use the existing backend configuration
- Update `REACT_APP_API_URL` in Vercel with your Render backend URL
- Update `ALLOWED_ORIGINS` in Render with your Vercel domain

## Troubleshooting
If you get "No entrypoint found" error:
1. Ensure the **Root Directory** is set to `./` in Vercel
2. Check that the build completes successfully
3. Verify the `build` directory contains `index.html`
