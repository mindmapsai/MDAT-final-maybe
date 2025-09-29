#!/bin/bash

# Deployment Verification Script for Multi-Department Automation System
# Run this script after deployment to verify everything is working

echo "🚀 Multi-Department Automation System - Deployment Verification"
echo "============================================================"

# Check if required environment variables are set
echo "🔍 Checking environment variables..."

if [ -z "$REACT_APP_API_URL" ]; then
    echo "⚠️  REACT_APP_API_URL is not set. Using default configuration."
else
    echo "✅ REACT_APP_API_URL: $REACT_APP_API_URL"
fi

if [ -z "$NODE_ENV" ]; then
    echo "⚠️  NODE_ENV is not set. Defaulting to development."
else
    echo "✅ NODE_ENV: $NODE_ENV"
fi

echo ""
echo "🔧 Testing backend connectivity..."

# Test health check endpoint
if curl -f -s "$REACT_APP_API_URL/health" > /dev/null 2>&1; then
    echo "✅ Backend health check: PASSED"
else
    echo "❌ Backend health check: FAILED"
    echo "   Please check if the backend server is running."
fi

echo ""
echo "🌐 Testing frontend accessibility..."

# Check if frontend is accessible (this would need to be customized for your domain)
FRONTEND_URL="${REACT_APP_API_URL/api\///}"  # Remove /api from the end
FRONTEND_URL="${FRONTEND_URL%/*}"  # Remove everything after the last /

if [ -n "$FRONTEND_URL" ] && [ "$FRONTEND_URL" != "$REACT_APP_API_URL" ]; then
    if curl -f -s "$FRONTEND_URL" > /dev/null 2>&1; then
        echo "✅ Frontend accessibility: PASSED"
    else
        echo "⚠️  Frontend accessibility: CHECK MANUALLY"
        echo "   Frontend URL: $FRONTEND_URL"
    fi
else
    echo "⚠️  Frontend URL not determined. Please check manually."
fi

echo ""
echo "📊 Testing API endpoints..."

# Test authentication endpoint
if curl -f -s -X POST "$REACT_APP_API_URL/auth/signup" \
    -H "Content-Type: application/json" \
    -d '{"name":"Test User","email":"test@example.com","password":"test123","department":"Tech"}' \
    > /dev/null 2>&1; then
    echo "✅ Authentication endpoint: PASSED"
else
    echo "⚠️  Authentication endpoint: CHECK MANUALLY"
fi

echo ""
echo "🗄️  Database connectivity..."

# This is harder to test without credentials, so we'll just note it
echo "⚠️  Database connectivity: REQUIRES MANUAL VERIFICATION"
echo "   Check MongoDB connection in server logs"

echo ""
echo "🎯 Deployment Summary:"
echo "======================"

if [ "$NODE_ENV" = "production" ]; then
    echo "✅ Environment: PRODUCTION"
else
    echo "⚠️  Environment: DEVELOPMENT (consider setting NODE_ENV=production)"
fi

echo ""
echo "📋 Next Steps:"
echo "1. Test user registration and login"
echo "2. Verify issue creation and routing"
echo "3. Check cross-department communication"
echo "4. Test all department dashboards"
echo "5. Verify real-time updates"
echo "6. Set up monitoring and alerts"

echo ""
echo "🔒 Security Checklist:"
echo "- [ ] SSL certificate configured"
echo "- [ ] Environment variables secured"
echo "- [ ] Database credentials protected"
echo "- [ ] JWT secret is strong and unique"
echo "- [ ] CORS origins configured for production"

echo ""
echo "📈 Performance Checklist:"
echo "- [ ] Database indexes optimized"
echo "- [ ] API response caching configured"
echo "- [ ] Static asset compression enabled"
echo "- [ ] CDN configured for static files"

echo ""
echo "🎉 Deployment verification complete!"
echo "   Check the items above and test the application manually."
