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
- **Install Command**: `npm install`
- **Build Command**: `chmod +x build.sh && ./build.sh`
- **Output Directory**: `build` (root level)
- **Rewrites**: Routes all requests to `/index.html` for SPA support

### 4. Environment Variables
Add these in Vercel dashboard under **Settings > Environment Variables**:
```
REACT_APP_API_URL=https://your-backend-app.onrender.com
REACT_APP_ENV=production
```

## Project Structure
```
Your Repository/
├── multi-department-system/     # React app source
│   ├── package.json
│   ├── src/
│   ├── public/
│   └── build.sh               # Build script
├── build/                      # Build output (created during deployment)
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
2. Check that the `build/` directory is created at the root level after build
3. The build script copies the React build output from `multi-department-system/build/` to `build/`
4. Verify the build completes successfully in the deployment logs
