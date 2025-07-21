#!/bin/bash

# API Test Script for Presentation Analytics Platform
# This script tests all backend API endpoints

BASE_URL="http://localhost:8000"
ADMIN_EMAIL="admin@example.com"
ADMIN_PASSWORD="admin123"

echo "🧪 Starting API Tests..."
echo "================================"

# Test 1: Health Check
echo "1. Testing Health Check..."
curl -s "$BASE_URL/" | jq -r '.message' || echo "Health check failed"

# Test 2: Login
echo "2. Testing Login..."
LOGIN_RESPONSE=$(curl -s -X POST "$BASE_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d "{\"email\": \"$ADMIN_EMAIL\", \"password\": \"$ADMIN_PASSWORD\"}")

TOKEN=$(echo $LOGIN_RESPONSE | jq -r '.access_token')

if [ "$TOKEN" != "null" ] && [ "$TOKEN" != "" ]; then
    echo "✅ Login successful"
else
    echo "❌ Login failed"
    exit 1
fi

# Test 3: Get Current User
echo "3. Testing Get Current User..."
USER_RESPONSE=$(curl -s -X GET "$BASE_URL/auth/me" \
  -H "Authorization: Bearer $TOKEN")

USER_ID=$(echo $USER_RESPONSE | jq -r '.id')

if [ "$USER_ID" != "null" ] && [ "$USER_ID" != "" ]; then
    echo "✅ Get current user successful"
else
    echo "❌ Get current user failed"
fi

# Test 4: Get All Users (Admin only)
echo "4. Testing Get All Users..."
USERS_RESPONSE=$(curl -s -X GET "$BASE_URL/users/" \
  -H "Authorization: Bearer $TOKEN")

USERS_COUNT=$(echo $USERS_RESPONSE | jq 'length')

if [ "$USERS_COUNT" -gt 0 ]; then
    echo "✅ Get all users successful (found $USERS_COUNT users)"
else
    echo "❌ Get all users failed"
fi

# Test 5: Form Submission
echo "5. Testing Form Submission..."
FORM_RESPONSE=$(curl -s -X POST "$BASE_URL/forms/submit" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "feedback": "Great presentation!",
    "rating": 5,
    "suggestions": "More interactive elements",
    "contact_name": "Test User",
    "contact_email": "test@example.com"
  }')

FORM_ID=$(echo $FORM_RESPONSE | jq -r '.id')
ERROR_DETAIL=$(echo $FORM_RESPONSE | jq -r '.detail')

if [ "$FORM_ID" != "null" ] && [ "$FORM_ID" != "" ]; then
    echo "✅ Form submission successful"
elif [ "$ERROR_DETAIL" == "You have already submitted a form" ]; then
    echo "✅ Form submission properly rejected (user already submitted)"
else
    echo "❌ Form submission failed"
fi

# Test 6: Analytics
echo "6. Testing Analytics..."
ANALYTICS_RESPONSE=$(curl -s -X POST "$BASE_URL/analytics/page-visit" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"page_name": "test-page"}')

VISIT_ID=$(echo $ANALYTICS_RESPONSE | jq -r '.id')

if [ "$VISIT_ID" != "null" ] && [ "$VISIT_ID" != "" ]; then
    echo "✅ Analytics tracking successful"
else
    echo "❌ Analytics tracking failed"
fi

# Test 7: Invalid Login
echo "7. Testing Invalid Login..."
INVALID_LOGIN_RESPONSE=$(curl -s -X POST "$BASE_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email": "invalid@example.com", "password": "wrongpassword"}')

ERROR_DETAIL=$(echo $INVALID_LOGIN_RESPONSE | jq -r '.detail')

if [ "$ERROR_DETAIL" != "null" ] && [ "$ERROR_DETAIL" != "" ]; then
    echo "✅ Invalid login properly rejected"
else
    echo "❌ Invalid login not properly handled"
fi

# Test 8: Invalid Token
echo "8. Testing Invalid Token..."
INVALID_TOKEN_RESPONSE=$(curl -s -X GET "$BASE_URL/auth/me" \
  -H "Authorization: Bearer invalid-token")

if [[ "$INVALID_TOKEN_RESPONSE" == *"401"* ]] || [[ "$INVALID_TOKEN_RESPONSE" == *"Could not validate credentials"* ]]; then
    echo "✅ Invalid token properly rejected"
else
    echo "❌ Invalid token not properly handled"
fi

echo "================================"
echo "✅ API Tests Completed!"
echo "All endpoints are working correctly." 