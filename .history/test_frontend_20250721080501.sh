#!/bin/bash

# Frontend Test Script for Presentation Analytics Platform
# This script tests the frontend web interface

FRONTEND_URL="http://localhost:3000"
BACKEND_URL="http://localhost:8000"

echo "🌐 Starting Frontend Tests..."
echo "================================"

# Test 1: Frontend Accessibility
echo "1. Testing Frontend Accessibility..."
FRONTEND_RESPONSE=$(curl -s -I "$FRONTEND_URL")

if [[ "$FRONTEND_RESPONSE" == *"200"* ]]; then
    echo "✅ Frontend is accessible"
else
    echo "❌ Frontend is not accessible"
    exit 1
fi

# Test 2: Login Page
echo "2. Testing Login Page..."
LOGIN_PAGE_RESPONSE=$(curl -s "$FRONTEND_URL/login")

if [[ "$LOGIN_PAGE_RESPONSE" == *"Welcome Back"* ]]; then
    echo "✅ Login page loads correctly"
else
    echo "❌ Login page not loading correctly"
fi

# Test 3: Dashboard Page (should redirect to login if not authenticated)
echo "3. Testing Dashboard Access..."
DASHBOARD_RESPONSE=$(curl -s "$FRONTEND_URL/dashboard")

if [[ "$DASHBOARD_RESPONSE" == *"login"* ]] || [[ "$DASHBOARD_RESPONSE" == *"Login"* ]]; then
    echo "✅ Dashboard properly redirects unauthenticated users"
else
    echo "❌ Dashboard access not properly protected"
fi

# Test 4: API Documentation
echo "4. Testing API Documentation..."
DOCS_RESPONSE=$(curl -s -I "$BACKEND_URL/docs")

if [[ "$DOCS_RESPONSE" == *"200"* ]]; then
    echo "✅ API documentation is accessible"
else
    echo "❌ API documentation not accessible"
fi

# Test 5: CORS Configuration
echo "5. Testing CORS Configuration..."
CORS_RESPONSE=$(curl -s -I -H "Origin: http://localhost:3000" "$BACKEND_URL/auth/login")

if [[ "$CORS_RESPONSE" == *"Access-Control-Allow-Origin"* ]]; then
    echo "✅ CORS is properly configured"
else
    echo "❌ CORS not properly configured"
fi

echo "================================"
echo "✅ Frontend Tests Completed!" 