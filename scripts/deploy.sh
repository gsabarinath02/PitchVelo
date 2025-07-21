#!/bin/bash

# Production Deployment Script
# Usage: ./scripts/deploy.sh [command]

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
PROJECT_NAME="pitch-analytics"
DOCKER_COMPOSE_FILE="docker-compose.prod.yml"
ENV_FILE=".env"

# Logging function
log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')] $1${NC}"
}

error() {
    echo -e "${RED}[ERROR] $1${NC}" >&2
}

warn() {
    echo -e "${YELLOW}[WARNING] $1${NC}"
}

info() {
    echo -e "${BLUE}[INFO] $1${NC}"
}

# Check if running as root
check_root() {
    if [[ $EUID -eq 0 ]]; then
        error "This script should not be run as root"
        exit 1
    fi
}

# Check prerequisites
check_prerequisites() {
    log "Checking prerequisites..."
    
    # Check Docker
    if ! command -v docker &> /dev/null; then
        error "Docker is not installed"
        exit 1
    fi
    
    # Check Docker Compose
    if ! command -v docker-compose &> /dev/null; then
        error "Docker Compose is not installed"
        exit 1
    fi
    
    # Check if .env file exists
    if [[ ! -f "$ENV_FILE" ]]; then
        error "Environment file $ENV_FILE not found"
        info "Copy env.production.example to .env and configure it"
        exit 1
    fi
    
    log "Prerequisites check passed"
}

# Generate secure secrets
generate_secrets() {
    log "Generating secure secrets..."
    
    # Generate SECRET_KEY if not set
    if ! grep -q "SECRET_KEY=" "$ENV_FILE" || grep -q "your-32-character-secret-key" "$ENV_FILE"; then
        SECRET_KEY=$(openssl rand -base64 32)
        sed -i "s/your-32-character-secret-key-here-minimum-32-characters/$SECRET_KEY/" "$ENV_FILE"
        log "Generated new SECRET_KEY"
    fi
    
    # Generate database password if not set
    if ! grep -q "POSTGRES_PASSWORD=" "$ENV_FILE" || grep -q "your-super-secure-password" "$ENV_FILE"; then
        DB_PASSWORD=$(openssl rand -base64 16)
        sed -i "s/your-super-secure-password-here/$DB_PASSWORD/" "$ENV_FILE"
        log "Generated new database password"
    fi
    
    # Generate Redis password if not set
    if ! grep -q "REDIS_PASSWORD=" "$ENV_FILE" || grep -q "your-redis-password" "$ENV_FILE"; then
        REDIS_PASSWORD=$(openssl rand -base64 16)
        sed -i "s/your-redis-password-here/$REDIS_PASSWORD/" "$ENV_FILE"
        log "Generated new Redis password"
    fi
}

# Backup function
backup() {
    log "Creating backup..."
    
    BACKUP_DIR="backups/$(date +%Y%m%d_%H%M%S)"
    mkdir -p "$BACKUP_DIR"
    
    # Backup database
    docker-compose -f "$DOCKER_COMPOSE_FILE" exec -T postgres pg_dump -U postgres presentation_app > "$BACKUP_DIR/database.sql"
    
    # Backup environment file
    cp "$ENV_FILE" "$BACKUP_DIR/env.backup"
    
    # Backup application files
    tar -czf "$BACKUP_DIR/app.tar.gz" --exclude=node_modules --exclude=.git --exclude=backups .
    
    log "Backup created: $BACKUP_DIR"
}

# Health check function
health_check() {
    log "Performing health checks..."
    
    # Check if services are running
    if ! docker-compose -f "$DOCKER_COMPOSE_FILE" ps | grep -q "Up"; then
        error "Services are not running"
        return 1
    fi
    
    # Check backend health
    if ! curl -f http://localhost:8000/health &> /dev/null; then
        error "Backend health check failed"
        return 1
    fi
    
    # Check frontend health
    if ! curl -f http://localhost:3000 &> /dev/null; then
        error "Frontend health check failed"
        return 1
    fi
    
    log "Health checks passed"
    return 0
}

# Deploy function
deploy() {
    log "Starting deployment..."
    
    # Check prerequisites
    check_prerequisites
    
    # Generate secrets if needed
    generate_secrets
    
    # Create backup before deployment
    backup
    
    # Stop existing services
    log "Stopping existing services..."
    docker-compose -f "$DOCKER_COMPOSE_FILE" down
    
    # Build and start services
    log "Building and starting services..."
    docker-compose -f "$DOCKER_COMPOSE_FILE" up -d --build
    
    # Wait for services to be ready
    log "Waiting for services to be ready..."
    sleep 30
    
    # Run database migrations
    log "Running database migrations..."
    docker-compose -f "$DOCKER_COMPOSE_FILE" exec -T backend alembic upgrade head
    
    # Initialize database if needed
    log "Initializing database..."
    docker-compose -f "$DOCKER_COMPOSE_FILE" exec -T backend python init_db.py
    
    # Health check
    if health_check; then
        log "Deployment completed successfully!"
        info "Frontend: http://localhost:3000"
        info "Backend API: http://localhost:8000"
        info "Health Check: http://localhost:8000/health"
    else
        error "Deployment failed health checks"
        exit 1
    fi
}

# Rollback function
rollback() {
    log "Rolling back to previous version..."
    
    # Stop services
    docker-compose -f "$DOCKER_COMPOSE_FILE" down
    
    # Find latest backup
    LATEST_BACKUP=$(ls -t backups/*/app.tar.gz 2>/dev/null | head -1)
    
    if [[ -z "$LATEST_BACKUP" ]]; then
        error "No backup found for rollback"
        exit 1
    fi
    
    # Extract backup
    log "Restoring from backup: $LATEST_BACKUP"
    tar -xzf "$LATEST_BACKUP"
    
    # Restart services
    docker-compose -f "$DOCKER_COMPOSE_FILE" up -d
    
    log "Rollback completed"
}

# Monitor function
monitor() {
    log "Starting monitoring..."
    
    while true; do
        if health_check; then
            log "All services healthy"
        else
            error "Health check failed"
        fi
        
        # Show resource usage
        docker stats --no-stream
        
        sleep 60
    done
}

# Cleanup function
cleanup() {
    log "Cleaning up old backups..."
    
    # Keep only last 7 backups
    ls -t backups/*/app.tar.gz 2>/dev/null | tail -n +8 | xargs -r rm -rf
    
    # Clean up Docker images
    docker image prune -f
    
    log "Cleanup completed"
}

# Show logs function
logs() {
    docker-compose -f "$DOCKER_COMPOSE_FILE" logs -f "$1"
}

# Main script logic
case "${1:-deploy}" in
    "deploy")
        deploy
        ;;
    "backup")
        backup
        ;;
    "health")
        health_check
        ;;
    "rollback")
        rollback
        ;;
    "monitor")
        monitor
        ;;
    "cleanup")
        cleanup
        ;;
    "logs")
        logs "$2"
        ;;
    "stop")
        log "Stopping services..."
        docker-compose -f "$DOCKER_COMPOSE_FILE" down
        ;;
    "start")
        log "Starting services..."
        docker-compose -f "$DOCKER_COMPOSE_FILE" up -d
        ;;
    "restart")
        log "Restarting services..."
        docker-compose -f "$DOCKER_COMPOSE_FILE" restart
        ;;
    "status")
        docker-compose -f "$DOCKER_COMPOSE_FILE" ps
        ;;
    *)
        echo "Usage: $0 {deploy|backup|health|rollback|monitor|cleanup|logs|stop|start|restart|status}"
        echo ""
        echo "Commands:"
        echo "  deploy    - Deploy the application"
        echo "  backup    - Create a backup"
        echo "  health    - Check application health"
        echo "  rollback  - Rollback to previous version"
        echo "  monitor   - Monitor application continuously"
        echo "  cleanup   - Clean up old backups and images"
        echo "  logs      - Show logs (optional: service name)"
        echo "  stop      - Stop all services"
        echo "  start     - Start all services"
        echo "  restart   - Restart all services"
        echo "  status    - Show service status"
        exit 1
        ;;
esac 