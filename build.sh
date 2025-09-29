#!/bin/bash
# Simple build script for Vercel

echo "Current directory: $(pwd)"
echo "Directory contents:"
ls -la

echo "Building React app..."
if [ -d "multi-department-system" ]; then
    echo "Found multi-department-system directory"
    cd multi-department-system
    npm install
    npm run build
    cd ..
    echo "Copying build output..."
    mkdir -p build
    cp -r multi-department-system/build/* build/ 2>/dev/null || echo "Copy completed with warnings"
else
    echo "multi-department-system directory not found"
    exit 1
fi

echo "Build completed!"
