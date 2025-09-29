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
- **Install Command**: `npm install && cd multi-department-system && npm install`
- **Build Command**: `npm run build --prefix multi-department-system && mkdir -p build && cp -r multi-department-system/build/* build/`
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
│   └── build/                  # Temporary build output
├── build/                      # Final build output (root level)
├── backend/                    # Node.js backend (deploy to Render)
└── vercel.json                 # Vercel configuration
```

## Backend Deployment
Keep your backend deployed on Render:
- Use the existing backend configuration
- Update `REACT_APP_API_URL` in Vercel with your Render backend URL
- Update `ALLOWED_ORIGINS` in Render with your Vercel domain

## Troubleshooting
If you get "No such file or directory" error:
1. Ensure the **Root Directory** is set to `./` in Vercel
2. Check that the `multi-department-system/` directory exists in your repository
3. The build command uses `--prefix` to run npm commands in the subdirectory
4. The build process creates `multi-department-system/build/` then copies to root `build/`
5. Verify the build completes successfully in the deployment logs
