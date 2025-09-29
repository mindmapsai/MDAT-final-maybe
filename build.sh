#!/bin/bash
# Build script for Vercel deployment

echo "Building React app..."
cd multi-department-system
npm install
npm run build

echo "Copying build output to root level..."
cp -r build ../build

echo "Build completed successfully!"
