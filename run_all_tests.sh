#!/bin/bash

# Master Test Runner for Presentation Analytics Platform
# This script runs all tests and provides a comprehensive report

echo "🚀 Starting Comprehensive Test Suite"
echo "=========================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Test counters
TOTAL_TESTS=0
PASSED_TESTS=0
FAILED_TESTS=0

# Function to run a test suite
run_test_suite() {
    local test_name="$1"
    local test_script="$2"
    
    echo -e "${BLUE}Running $test_name...${NC}"
    echo "----------------------------------------"
    
    if ./"$test_script"; then
        echo -e "${GREEN}✅ $test_name completed successfully${NC}"
        ((PASSED_TESTS++))
    else
        echo -e "${RED}❌ $test_name failed${NC}"
        ((FAILED_TESTS++))
    fi
    
    ((TOTAL_TESTS++))
    echo ""
}

# Check if containers are running
echo -e "${BLUE}Checking container status...${NC}"
if docker compose -f docker-compose.dev.yml ps | grep -q "Up"; then
    echo -e "${GREEN}✅ All containers are running${NC}"
else
    echo -e "${RED}❌ Some containers are not running${NC}"
    echo "Starting containers..."
    docker compose -f docker-compose.dev.yml up -d
    sleep 10
fi
echo ""

# Run all test suites
run_test_suite "API Tests" "test_api.sh"
run_test_suite "Frontend Tests" "test_frontend.sh"
run_test_suite "Database Tests" "test_database.sh"

# Manual test checklist
echo -e "${BLUE}Manual Test Checklist:${NC}"
echo "----------------------------------------"

manual_tests=(
    "Login with admin@example.com / admin123"
    "Navigate through presentation slides"
    "Submit feedback form"
    "Access admin panel"
    "Check API documentation at http://localhost:8000/docs"
    "Verify responsive design on different screen sizes"
    "Test form validation"
    "Check error handling"
)

for test in "${manual_tests[@]}"; do
    echo -e "${YELLOW}⏳ $test${NC}"
done

echo ""
echo "=========================================="
echo -e "${BLUE}Test Results Summary:${NC}"
echo "=========================================="
echo -e "Total Test Suites: $TOTAL_TESTS"
echo -e "${GREEN}Passed: $PASSED_TESTS${NC}"
echo -e "${RED}Failed: $FAILED_TESTS${NC}"

if [ $FAILED_TESTS -eq 0 ]; then
    echo ""
    echo -e "${GREEN}🎉 All tests passed! The application is ready for production.${NC}"
    echo ""
    echo -e "${BLUE}Application URLs:${NC}"
    echo "- Frontend: http://localhost:3000"
    echo "- Backend API: http://localhost:8000"
    echo "- API Documentation: http://localhost:8000/docs"
    echo ""
    echo -e "${BLUE}Default Credentials:${NC}"
    echo "- Email: admin@example.com"
    echo "- Password: admin123"
else
    echo ""
    echo -e "${RED}⚠️  Some tests failed. Please check the logs above.${NC}"
    exit 1
fi 