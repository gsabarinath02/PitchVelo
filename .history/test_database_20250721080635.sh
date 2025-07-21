#!/bin/bash

# Database Test Script for Presentation Analytics Platform
# This script tests database connectivity and operations

echo "🗄️ Starting Database Tests..."
echo "================================"

# Test 1: Database Container Status
echo "1. Testing Database Container Status..."
DB_CONTAINER_STATUS=$(docker compose -f docker-compose.dev.yml ps postgres --format "table {{.Status}}")

if [[ "$DB_CONTAINER_STATUS" == *"Up"* ]]; then
    echo "✅ Database container is running"
else
    echo "❌ Database container is not running"
    exit 1
fi

# Test 2: Database Connection
echo "2. Testing Database Connection..."
DB_CONNECTION=$(docker compose -f docker-compose.dev.yml exec -T postgres psql -U postgres -d presentation_app -c "SELECT 1;" 2>/dev/null)

if [[ "$DB_CONNECTION" == *"1"* ]]; then
    echo "✅ Database connection successful"
else
    echo "❌ Database connection failed"
fi

# Test 3: Database Tables
echo "3. Testing Database Tables..."
TABLES=$(docker compose -f docker-compose.dev.yml exec -T postgres psql -U postgres -d presentation_app -c "\dt" 2>/dev/null)

if [[ "$TABLES" == *"users"* ]] && [[ "$TABLES" == *"login_events"* ]]; then
    echo "✅ Database tables exist"
else
    echo "❌ Database tables missing"
fi

# Test 4: User Data
echo "4. Testing User Data..."
USER_COUNT=$(docker compose -f docker-compose.dev.yml exec -T postgres psql -U postgres -d presentation_app -c "SELECT COUNT(*) FROM users;" 2>/dev/null | grep -o '[0-9]' | head -1)

if [[ "$USER_COUNT" != "" ]] && [[ "$USER_COUNT" -gt 0 ]]; then
    echo "✅ User data exists ($USER_COUNT users)"
else
    echo "❌ No user data found"
fi

# Test 5: Admin User
echo "5. Testing Admin User..."
ADMIN_USER=$(docker compose -f docker-compose.dev.yml exec -T postgres psql -U postgres -d presentation_app -c "SELECT email FROM users WHERE email = 'admin@example.com';" 2>/dev/null)

if [[ "$ADMIN_USER" == *"admin@example.com"* ]]; then
    echo "✅ Admin user exists"
else
    echo "❌ Admin user not found"
fi

# Test 6: Database Backup Test
echo "6. Testing Database Backup..."
BACKUP_TEST=$(docker compose -f docker-compose.dev.yml exec -T postgres pg_dump -U postgres presentation_app --schema-only 2>/dev/null | head -5)

if [[ "$BACKUP_TEST" == *"CREATE TABLE"* ]]; then
    echo "✅ Database backup functionality works"
else
    echo "❌ Database backup failed"
fi

echo "================================"
echo "✅ Database Tests Completed!" 