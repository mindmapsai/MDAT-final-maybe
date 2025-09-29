# Vercel Deployment Guide

## Updated Setup for Vercel

### 1. Connect Repository
- Go to [vercel.com](https://vercel.com)
- Import your GitHub repository
- Vercel will auto-detect the `vercel.json` configuration

### 2. Root Directory
In Vercel dashboard, set the **Root Directory** to `./` (root of your repository)

### 3. Build Configuration
The `vercel.json` file specifies:
- **Build Source**: `multi-department-system/package.json`
- **Build Type**: `@vercel/static-build`
- **Output Directory**: `build` (relative to the source)
- **Rewrites**: Routes all requests to `/build/$1` for SPA support

### 4. Environment Variables
Add these in Vercel dashboard under **Settings > Environment Variables**:
```
REACT_APP_API_URL=https://your-backend-app.onrender.com
REACT_APP_ENV=production
```

## Project Structure
```
Your Repository/
├── multi-department-system/     # React app
│   ├── package.json
│   ├── src/
│   ├── public/
│   └── build/                  # Build output (created during deployment)
├── backend/                    # Node.js backend (deploy to Render)
└── vercel.json                 # Vercel configuration
```

## Backend Deployment
Keep your backend deployed on Render:
- Use the existing backend configuration
- Update `REACT_APP_API_URL` in Vercel with your Render backend URL
- Update `ALLOWED_ORIGINS` in Render with your Vercel domain

## Troubleshooting
If you get "No Output Directory" error:
1. Ensure the **Root Directory** is set to `./` in Vercel
2. Check that the `multi-department-system/build/` directory is created after build
3. Verify the build completes successfully in the deployment logs
4. The `vercel.json` uses rewrites to serve the SPA from the build directory
