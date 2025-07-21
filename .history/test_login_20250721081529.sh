#!/bin/bash

# Login Test Script
echo "🔐 Testing Login Functionality..."
echo "================================"

# Test 1: Check if frontend is accessible
echo "1. Testing Frontend Accessibility..."
if curl -s -I "http://localhost:3000/login" | grep -q "200"; then
    echo "✅ Frontend is accessible"
else
    echo "❌ Frontend is not accessible"
    exit 1
fi

# Test 2: Test login API
echo "2. Testing Login API..."
LOGIN_RESPONSE=$(curl -s -X POST "http://localhost:8000/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@example.com", "password": "admin123"}')

TOKEN=$(echo $LOGIN_RESPONSE | jq -r '.access_token')

if [ "$TOKEN" != "null" ] && [ "$TOKEN" != "" ]; then
    echo "✅ Login API is working"
else
    echo "❌ Login API failed"
    exit 1
fi

# Test 3: Test user info API
echo "3. Testing User Info API..."
USER_RESPONSE=$(curl -s -X GET "http://localhost:8000/auth/me" \
  -H "Authorization: Bearer $TOKEN")

USER_ROLE=$(echo $USER_RESPONSE | jq -r '.role')

if [ "$USER_ROLE" == "admin" ]; then
    echo "✅ User info API is working (Admin role confirmed)"
else
    echo "❌ User info API failed or wrong role"
    exit 1
fi

# Test 4: Test admin access
echo "4. Testing Admin Access..."
ADMIN_RESPONSE=$(curl -s -X GET "http://localhost:8000/users/" \
  -H "Authorization: Bearer $TOKEN")

if echo $ADMIN_RESPONSE | jq -e . > /dev/null 2>&1; then
    echo "✅ Admin access is working"
else
    echo "❌ Admin access failed"
    exit 1
fi

echo "================================"
echo "✅ Login functionality is working correctly!"
echo ""
echo "To test in browser:"
echo "1. Go to http://localhost:3000/login"
echo "2. Enter email: admin@example.com"
echo "3. Enter password: admin123"
echo "4. Click 'Sign In'"
echo "5. You should be redirected to dashboard"
echo "6. Click user dropdown → 'Admin Dashboard'" 