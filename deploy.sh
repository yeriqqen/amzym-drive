#!/bin/bash

# Enhanced Deployment Script for Food Delivery Platform
set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
COMPOSE_FILES="-f docker-compose.yml"
ENV_FILE=".env"

# Function to display usage
show_usage() {
    echo -e "${GREEN}🚀 Food Delivery Platform Deployment Script${NC}"
    echo "=============================================="
    echo ""
    echo "Usage: $0 <command> [environment] [options]"
    echo ""
    echo -e "${YELLOW}Commands:${NC}"
    echo "  deploy          Deploy the application"
    echo "  start           Start all services"
    echo "  stop            Stop all services"
    echo "  restart         Restart all services"
    echo "  logs            Show logs for all services"
    echo "  status          Show status of all services"
    echo "  migrate         Run database migrations"
    echo "  seed            Seed the database"
    echo "  backup          Backup database"
    echo "  restore         Restore database from backup"
    echo "  ssl             Setup SSL certificates"
    echo "  monitoring      Start monitoring stack"
    echo "  clean           Clean up containers and volumes"
    echo "  build           Build Docker images"
    echo "  health          Run health checks"
    echo ""
    echo -e "${YELLOW}Environments:${NC}"
    echo "  dev             Development environment"
    echo "  prod            Production environment"
    echo ""
    echo -e "${YELLOW}Examples:${NC}"
    echo "  $0 deploy prod                 # Deploy to production"
    echo "  $0 start dev                   # Start development environment"
    echo "  $0 logs backend                # Show backend logs"
    echo "  $0 backup prod                 # Backup production database"
    echo "  $0 ssl localhost               # Setup SSL for localhost"
    echo "  $0 monitoring                  # Start monitoring stack"
}

# Check if Docker is running
check_docker() {
    if ! docker info > /dev/null 2>&1; then
        echo -e "${RED}❌ Docker is not running. Please start Docker first.${NC}"
        exit 1
    fi
}

# Load environment variables
load_env() {
    local env=$1
    case $env in
        "prod")
            ENV_FILE=".env.prod"
            COMPOSE_FILES="-f docker-compose.yml -f docker-compose.prod.yml"
            ;;
        "dev")
            ENV_FILE=".env.dev"
            COMPOSE_FILES="-f docker-compose.yml -f docker-compose.dev.yml"
            ;;
        *)
            ENV_FILE=".env"
            ;;
    esac
    
    if [ -f "$ENV_FILE" ]; then
        echo -e "${BLUE}📋 Loading environment from $ENV_FILE${NC}"
        export $(cat "$ENV_FILE" | grep -v '^#' | xargs)
    fi
}

# Function to run Docker Compose commands
run_compose() {
    docker-compose $COMPOSE_FILES "$@"
}

# Function to deploy the application
deploy() {
    local env=${1:-dev}
    echo -e "${GREEN}🚀 Starting deployment for $env environment...${NC}"
    
    load_env $env
    check_docker
    
    echo -e "${BLUE}📦 Building Docker images...${NC}"
    run_compose build --no-cache
    
    echo -e "${BLUE}🗄️ Running database migrations...${NC}"
    run_compose run --rm backend npx prisma migrate deploy
    
    echo -e "${BLUE}🌱 Seeding database...${NC}"
    run_compose run --rm backend npm run db:seed
    
    echo -e "${BLUE}🔄 Starting services...${NC}"
    run_compose up -d
    
    echo -e "${BLUE}🏥 Waiting for services to be healthy...${NC}"
    sleep 30
    
    health_check
    
    echo -e "${GREEN}🎉 Deployment completed successfully!${NC}"
    status
}

# Function to check health
health_check() {
    echo -e "${BLUE}🔍 Running health checks...${NC}"
    
    # Backend health check
    if curl -f -s http://localhost:3001/health > /dev/null 2>&1; then
        echo -e "${GREEN}✅ Backend health check passed${NC}"
    else
        echo -e "${RED}❌ Backend health check failed${NC}"
        return 1
    fi
    
    # Frontend health check
    if curl -f -s http://localhost:3000 > /dev/null 2>&1; then
        echo -e "${GREEN}✅ Frontend health check passed${NC}"
    else
        echo -e "${RED}❌ Frontend health check failed${NC}"
        return 1
    fi
    
    # Database health check
    if run_compose exec -T postgres pg_isready -U postgres > /dev/null 2>&1; then
        echo -e "${GREEN}✅ Database health check passed${NC}"
    else
        echo -e "${RED}❌ Database health check failed${NC}"
        return 1
    fi
    
    # Redis health check
    if run_compose exec -T redis redis-cli ping > /dev/null 2>&1; then
        echo -e "${GREEN}✅ Redis health check passed${NC}"
    else
        echo -e "${RED}❌ Redis health check failed${NC}"
        return 1
    fi
}

# Function to backup database
backup() {
    local env=${1:-dev}
    local backup_name="backup_$(date +%Y%m%d_%H%M%S).sql"
    
    load_env $env
    
    echo -e "${BLUE}💾 Creating database backup: $backup_name${NC}"
    
    mkdir -p ./backups
    run_compose exec -T postgres pg_dump -U postgres food_delivery > "./backups/$backup_name"
    
    echo -e "${GREEN}✅ Backup created successfully: ./backups/$backup_name${NC}"
}

# Function to restore database
restore() {
    local env=${1:-dev}
    local backup_file=$2
    
    if [ -z "$backup_file" ]; then
        echo -e "${RED}❌ Please specify backup file: $0 restore <env> <backup_file>${NC}"
        exit 1
    fi
    
    if [ ! -f "$backup_file" ]; then
        echo -e "${RED}❌ Backup file not found: $backup_file${NC}"
        exit 1
    fi
    
    load_env $env
    
    echo -e "${YELLOW}⚠️  This will overwrite the current database. Continue? (y/N)${NC}"
    read -r response
    if [[ ! "$response" =~ ^[Yy]$ ]]; then
        echo "❌ Restore cancelled"
        exit 1
    fi
    
    echo -e "${BLUE}🔄 Restoring database from: $backup_file${NC}"
    
    # Drop and recreate database
    run_compose exec -T postgres psql -U postgres -c "DROP DATABASE IF EXISTS food_delivery;"
    run_compose exec -T postgres psql -U postgres -c "CREATE DATABASE food_delivery;"
    
    # Restore from backup
    cat "$backup_file" | run_compose exec -T postgres psql -U postgres food_delivery
    
    echo -e "${GREEN}✅ Database restored successfully${NC}"
}

# Function to start monitoring stack
start_monitoring() {
    echo -e "${BLUE}📊 Starting monitoring stack...${NC}"
    
    docker-compose -f docker-compose.monitoring.yml up -d
    
    echo -e "${GREEN}✅ Monitoring stack started successfully!${NC}"
    echo ""
    echo -e "${YELLOW}📊 Access monitoring services:${NC}"
    echo "  - Grafana: http://localhost:3001 (admin/admin)"
    echo "  - Prometheus: http://localhost:9090"
    echo "  - cAdvisor: http://localhost:8080"
}

# Function to setup SSL
setup_ssl() {
    local domain=${1:-localhost}
    echo -e "${BLUE}🔐 Setting up SSL for domain: $domain${NC}"
    
    ./setup-ssl.sh "$domain"
}

# Function to show status
status() {
    echo -e "${BLUE}📊 Service Status:${NC}"
    run_compose ps
    
    echo ""
    echo -e "${BLUE}📊 Resource Usage:${NC}"
    docker stats --no-stream --format "table {{.Container}}\t{{.CPUPerc}}\t{{.MemUsage}}\t{{.NetIO}}\t{{.BlockIO}}"
}

# Function to show logs
show_logs() {
    local service=$1
    if [ -n "$service" ]; then
        run_compose logs -f "$service"
    else
        run_compose logs -f
    fi
}

# Function to clean up
clean() {
    echo -e "${YELLOW}⚠️  This will remove all containers, images, and volumes. Continue? (y/N)${NC}"
    read -r response
    if [[ ! "$response" =~ ^[Yy]$ ]]; then
        echo "❌ Clean cancelled"
        exit 1
    fi
    
    echo -e "${BLUE}🧹 Cleaning up...${NC}"
    
    # Stop all services
    run_compose down -v --remove-orphans
    docker-compose -f docker-compose.monitoring.yml down -v --remove-orphans 2>/dev/null || true
    
    # Remove images
    docker image prune -a -f
    
    # Remove volumes
    docker volume prune -f
    
    echo -e "${GREEN}✅ Cleanup completed${NC}"
}

# Main script logic
COMMAND=${1:-help}
ENV=${2:-dev}
SERVICE=${2:-}

case $COMMAND in
    "deploy")
        deploy $ENV
        ;;
    "start")
        load_env $ENV
        run_compose up -d
        ;;
    "stop")
        load_env $ENV
        run_compose down
        ;;
    "restart")
        load_env $ENV
        run_compose restart
        ;;
    "logs")
        load_env $ENV
        show_logs $SERVICE
        ;;
    "status")
        load_env $ENV
        status
        ;;
    "migrate")
        load_env $ENV
        run_compose run --rm backend npx prisma migrate deploy
        ;;
    "seed")
        load_env $ENV
        run_compose run --rm backend npm run db:seed
        ;;
    "backup")
        backup $ENV
        ;;
    "restore")
        restore $ENV $3
        ;;
    "ssl")
        setup_ssl $ENV
        ;;
    "monitoring")
        start_monitoring
        ;;
    "clean")
        clean
        ;;
    "build")
        load_env $ENV
        run_compose build --no-cache
        ;;
    "health")
        load_env $ENV
        health_check
        ;;
    "help"|*)
        show_usage
        ;;
esac
echo "📊 Application is running at: http://localhost"
echo "📚 API documentation: http://localhost/api"

# Display service status
echo "📋 Service Status:"
docker-compose -f docker-compose.yml -f docker-compose.prod.yml ps
