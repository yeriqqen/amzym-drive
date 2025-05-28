#!/bin/bash

# Production Deployment Script for Food Delivery App
set -e

echo "🚀 Starting production deployment..."

# Load environment variables
if [ -f .env.production ]; then
    export $(cat .env.production | xargs)
fi

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker first."
    exit 1
fi

# Build and deploy with Docker Compose
echo "📦 Building Docker images..."
docker-compose -f docker-compose.yml -f docker-compose.prod.yml build --no-cache

echo "🗄️ Running database migrations..."
docker-compose -f docker-compose.yml -f docker-compose.prod.yml run --rm backend npx prisma migrate deploy

echo "🌱 Seeding database (if needed)..."
docker-compose -f docker-compose.yml -f docker-compose.prod.yml run --rm backend npm run db:seed

echo "🔄 Starting services..."
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d

echo "🏥 Waiting for services to be healthy..."
sleep 30

# Health checks
echo "🔍 Running health checks..."
if curl -f http://localhost/health > /dev/null 2>&1; then
    echo "✅ Backend health check passed"
else
    echo "❌ Backend health check failed"
    exit 1
fi

if curl -f http://localhost > /dev/null 2>&1; then
    echo "✅ Frontend health check passed"
else
    echo "❌ Frontend health check failed"
    exit 1
fi

echo "🎉 Deployment completed successfully!"
echo "📊 Application is running at: http://localhost"
echo "📚 API documentation: http://localhost/api"

# Display service status
echo "📋 Service Status:"
docker-compose -f docker-compose.yml -f docker-compose.prod.yml ps
