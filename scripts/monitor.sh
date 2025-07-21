#!/bin/bash

# Application Monitoring Script
# Usage: ./scripts/monitor.sh [interval]

set -e

# Configuration
INTERVAL=${1:-60}
COMPOSE_FILE="docker-compose.prod.yml"
LOG_FILE="./monitor.log"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Logging function
log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')] $1${NC}" | tee -a "$LOG_FILE"
}

error() {
    echo -e "${RED}[$(date +'%Y-%m-%d %H:%M:%S')] ERROR: $1${NC}" | tee -a "$LOG_FILE"
}

warning() {
    echo -e "${YELLOW}[$(date +'%Y-%m-%d %H:%M:%S')] WARNING: $1${NC}" | tee -a "$LOG_FILE"
}

info() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')] INFO: $1${NC}" | tee -a "$LOG_FILE"
}

# Check service health
check_service_health() {
    local service=$1
    local url=$2
    
    if curl -f -s "$url" > /dev/null 2>&1; then
        log "✅ $service is healthy"
        return 0
    else
        error "❌ $service is unhealthy"
        return 1
    fi
}

# Check container status
check_container_status() {
    local container=$1
    
    if docker-compose -f "$COMPOSE_FILE" ps | grep -q "$container.*Up"; then
        log "✅ Container $container is running"
        return 0
    else
        error "❌ Container $container is not running"
        return 1
    fi
}

# Get resource usage
get_resource_usage() {
    info "📊 Resource Usage:"
    
    # CPU and Memory usage
    docker stats --no-stream --format "table {{.Container}}\t{{.CPUPerc}}\t{{.MemUsage}}\t{{.MemPerc}}" | head -1
    docker stats --no-stream --format "table {{.Name}}\t{{.CPUPerc}}\t{{.MemUsage}}\t{{.MemPerc}}" | grep -E "(backend|frontend|postgres|redis|nginx)"
    
    # Disk usage
    info "💾 Disk Usage:"
    df -h | grep -E "(Filesystem|/dev)"
}

# Check database performance
check_database_performance() {
    info "🗄️ Database Performance:"
    
    # Check active connections
    local connections=$(docker-compose -f "$COMPOSE_FILE" exec -T postgres psql -U postgres -d presentation_app -t -c "SELECT count(*) FROM pg_stat_activity WHERE state = 'active';" 2>/dev/null | tr -d ' ')
    info "Active connections: $connections"
    
    # Check database size
    local db_size=$(docker-compose -f "$COMPOSE_FILE" exec -T postgres psql -U postgres -d presentation_app -t -c "SELECT pg_size_pretty(pg_database_size('presentation_app'));" 2>/dev/null | tr -d ' ')
    info "Database size: $db_size"
}

# Check API performance
check_api_performance() {
    info "🚀 API Performance:"
    
    # Test API response time
    local start_time=$(date +%s.%N)
    curl -s -o /dev/null -w "%{http_code}" http://localhost:8000/health > /dev/null 2>&1
    local end_time=$(date +%s.%N)
    local response_time=$(echo "$end_time - $start_time" | bc -l 2>/dev/null || echo "0")
    
    info "API response time: ${response_time}s"
    
    # Check API metrics
    if curl -s http://localhost:8000/metrics > /dev/null 2>&1; then
        info "✅ Metrics endpoint accessible"
    else
        warning "⚠️ Metrics endpoint not accessible"
    fi
}

# Check logs for errors
check_logs() {
    info "📋 Recent Logs Analysis:"
    
    # Check for errors in the last 10 minutes
    local error_count=$(docker-compose -f "$COMPOSE_FILE" logs --since=10m 2>&1 | grep -i "error\|exception\|failed" | wc -l)
    
    if [ "$error_count" -gt 0 ]; then
        warning "⚠️ Found $error_count errors in recent logs"
        docker-compose -f "$COMPOSE_FILE" logs --since=10m 2>&1 | grep -i "error\|exception\|failed" | tail -5
    else
        log "✅ No recent errors found"
    fi
}

# Check backup status
check_backup_status() {
    info "💾 Backup Status:"
    
    local backup_dir="./backups"
    if [ -d "$backup_dir" ]; then
        local latest_backup=$(ls -t "$backup_dir"/*.sql 2>/dev/null | head -1)
        if [ -n "$latest_backup" ]; then
            local backup_age=$(($(date +%s) - $(stat -c %Y "$latest_backup")))
            local backup_age_hours=$((backup_age / 3600))
            
            if [ $backup_age_hours -lt 24 ]; then
                log "✅ Latest backup is $backup_age_hours hours old"
            else
                warning "⚠️ Latest backup is $backup_age_hours hours old"
            fi
        else
            warning "⚠️ No backups found"
        fi
    else
        warning "⚠️ Backup directory not found"
    fi
}

# Main monitoring function
monitor() {
    log "🔍 Starting application monitoring..."
    
    # Check container status
    check_container_status "backend"
    check_container_status "frontend"
    check_container_status "postgres"
    check_container_status "redis"
    check_container_status "nginx"
    
    # Check service health
    check_service_health "Backend API" "http://localhost:8000/health"
    check_service_health "Frontend" "http://localhost:3000"
    
    # Get resource usage
    get_resource_usage
    
    # Check database performance
    check_database_performance
    
    # Check API performance
    check_api_performance
    
    # Check logs
    check_logs
    
    # Check backup status
    check_backup_status
    
    log "✅ Monitoring cycle completed"
}

# Continuous monitoring
continuous_monitor() {
    log "🔄 Starting continuous monitoring (interval: ${INTERVAL}s)"
    
    while true; do
        monitor
        sleep "$INTERVAL"
    done
}

# Single monitoring run
single_monitor() {
    log "🔍 Running single monitoring check"
    monitor
}

# Main execution
case "${1:-single}" in
    "continuous")
        continuous_monitor
        ;;
    "single")
        single_monitor
        ;;
    *)
        echo "Usage: $0 {single|continuous} [interval]"
        echo "  single: Run monitoring once"
        echo "  continuous: Run monitoring continuously"
        echo "  interval: Time between checks in seconds (default: 60)"
        exit 1
        ;;
esac 