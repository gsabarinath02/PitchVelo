#!/bin/bash

# Production Deployment Script
# Usage: ./scripts/deploy.sh [environment]

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
ENVIRONMENT=${1:-production}
COMPOSE_FILE="docker-compose.prod.yml"
BACKUP_DIR="./backups"
LOG_FILE="./deploy.log"

# Logging function
log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')] $1${NC}" | tee -a "$LOG_FILE"
}

error() {
    echo -e "${RED}[$(date +'%Y-%m-%d %H:%M:%S')] ERROR: $1${NC}" | tee -a "$LOG_FILE"
    exit 1
}

warning() {
    echo -e "${YELLOW}[$(date +'%Y-%m-%d %H:%M:%S')] WARNING: $1${NC}" | tee -a "$LOG_FILE"
}

# Check prerequisites
check_prerequisites() {
    log "Checking prerequisites..."
    
    # Check if Docker is installed
    if ! command -v docker &> /dev/null; then
        error "Docker is not installed"
    fi
    
    # Check if Docker Compose is installed
    if ! command -v docker-compose &> /dev/null; then
        error "Docker Compose is not installed"
    fi
    
    # Check if .env file exists
    if [ ! -f ".env" ]; then
        error "Environment file .env not found. Please copy env.production.example to .env and configure it."
    fi
    
    # Check if SSL certificates exist (for production)
    if [ "$ENVIRONMENT" = "production" ]; then
        if [ ! -f "nginx/ssl/cert.pem" ] || [ ! -f "nginx/ssl/key.pem" ]; then
            warning "SSL certificates not found. HTTPS will not work."
        fi
    fi
    
    log "Prerequisites check passed"
}

# Create backup
create_backup() {
    log "Creating database backup..."
    
    mkdir -p "$BACKUP_DIR"
    BACKUP_FILE="$BACKUP_DIR/backup_$(date +'%Y%m%d_%H%M%S').sql"
    
    if docker-compose -f "$COMPOSE_FILE" exec -T postgres pg_dump -U postgres presentation_app > "$BACKUP_FILE" 2>/dev/null; then
        log "Backup created: $BACKUP_FILE"
    else
        warning "Failed to create backup, continuing anyway..."
    fi
}

# Health check
health_check() {
    log "Performing health checks..."
    
    # Wait for services to be ready
    sleep 30
    
    # Check backend health
    if curl -f http://localhost:8000/health > /dev/null 2>&1; then
        log "Backend health check passed"
    else
        error "Backend health check failed"
    fi
    
    # Check frontend health
    if curl -f http://localhost:3000 > /dev/null 2>&1; then
        log "Frontend health check passed"
    else
        error "Frontend health check failed"
    fi
    
    # Check database
    if docker-compose -f "$COMPOSE_FILE" exec postgres pg_isready -U postgres > /dev/null 2>&1; then
        log "Database health check passed"
    else
        error "Database health check failed"
    fi
    
    log "All health checks passed"
}

# Deploy function
deploy() {
    log "Starting deployment to $ENVIRONMENT environment..."
    
    # Stop existing services
    log "Stopping existing services..."
    docker-compose -f "$COMPOSE_FILE" down --remove-orphans
    
    # Pull latest images
    log "Pulling latest images..."
    docker-compose -f "$COMPOSE_FILE" pull
    
    # Build and start services
    log "Building and starting services..."
    docker-compose -f "$COMPOSE_FILE" up -d --build
    
    # Wait for services to start
    log "Waiting for services to start..."
    sleep 10
    
    # Run database migrations
    log "Running database migrations..."
    docker-compose -f "$COMPOSE_FILE" exec -T backend alembic upgrade head || warning "Migration failed"
    
    # Initialize database if needed
    log "Initializing database..."
    docker-compose -f "$COMPOSE_FILE" exec -T backend python init_db.py || warning "Database initialization failed"
    
    # Health checks
    health_check
    
    log "Deployment completed successfully!"
}

# Rollback function
rollback() {
    log "Rolling back deployment..."
    
    # Stop current services
    docker-compose -f "$COMPOSE_FILE" down
    
    # Start previous version (you would need to implement version management)
    warning "Rollback functionality requires version management implementation"
    
    log "Rollback completed"
}

# Main deployment process
main() {
    log "=== Starting Production Deployment ==="
    
    # Check prerequisites
    check_prerequisites
    
    # Create backup
    create_backup
    
    # Deploy
    deploy
    
    log "=== Deployment Completed Successfully ==="
    log "Application URLs:"
    log "  - Frontend: http://localhost:3000"
    log "  - Backend API: http://localhost:8000"
    log "  - API Documentation: http://localhost:8000/docs"
    log "  - Health Check: http://localhost:8000/health"
    log "  - Metrics: http://localhost:8000/metrics"
}

# Handle command line arguments
case "${1:-deploy}" in
    "deploy")
        main
        ;;
    "rollback")
        rollback
        ;;
    "health")
        health_check
        ;;
    "backup")
        create_backup
        ;;
    *)
        echo "Usage: $0 {deploy|rollback|health|backup}"
        exit 1
        ;;
esac 