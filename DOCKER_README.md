# Food Delivery Platform - Docker Configuration

A comprehensive Docker setup for a food delivery platform with NestJS backend, Next.js frontend, PostgreSQL, Redis, Nginx, and monitoring stack.

## 📋 Table of Contents

- [Quick Start](#quick-start)
- [Architecture](#architecture)
- [Services](#services)
- [Environments](#environments)
- [Deployment](#deployment)
- [Monitoring](#monitoring)
- [SSL Setup](#ssl-setup)
- [Backup & Restore](#backup--restore)
- [Troubleshooting](#troubleshooting)

## 🚀 Quick Start

### Prerequisites

- Docker and Docker Compose installed
- Node.js 18+ (for local development)
- Git

### Development Environment

```bash
# Clone the repository
git clone <repository-url>
cd website

# Copy environment file
cp .env.example .env.dev

# Start development environment
./deploy.sh start dev

# View logs
./deploy.sh logs dev

# Stop services
./deploy.sh stop dev
```

### Production Environment

```bash
# Copy production environment file
cp .env.prod.example .env.prod

# Configure your production settings
nano .env.prod

# Setup SSL certificates
./deploy.sh ssl yourdomain.com

# Deploy to production
./deploy.sh deploy prod

# Check status
./deploy.sh status prod
```

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Docker Network                          │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐        │
│  │    Nginx    │  │  Frontend   │  │   Backend   │        │
│  │ (Port 80)   │  │ (Next.js)   │  │  (NestJS)   │        │
│  │ (Port 443)  │  │ (Port 3000) │  │ (Port 3001) │        │
│  └─────────────┘  └─────────────┘  └─────────────┘        │
│         │                 │                 │             │
│         └─────────────────┼─────────────────┘             │
│                           │                               │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐        │
│  │ PostgreSQL  │  │    Redis    │  │ Monitoring  │        │
│  │ (Port 5432) │  │ (Port 6379) │  │   Stack     │        │
│  └─────────────┘  └─────────────┘  └─────────────┘        │
└─────────────────────────────────────────────────────────────┘
```

## 🔧 Services

### Core Services

| Service        | Description             | Port   | Health Check |
| -------------- | ----------------------- | ------ | ------------ |
| **Frontend**   | Next.js web application | 3000   | ✅           |
| **Backend**    | NestJS API server       | 3001   | ✅           |
| **PostgreSQL** | Primary database        | 5432   | ✅           |
| **Redis**      | Cache and session store | 6379   | ✅           |
| **Nginx**      | Reverse proxy & SSL     | 80/443 | ✅           |

### Monitoring Services

| Service           | Description           | Port | Purpose             |
| ----------------- | --------------------- | ---- | ------------------- |
| **Prometheus**    | Metrics collection    | 9090 | System metrics      |
| **Grafana**       | Metrics visualization | 3001 | Dashboards          |
| **Loki**          | Log aggregation       | 3100 | Centralized logging |
| **Promtail**      | Log collection        | -    | Log forwarding      |
| **cAdvisor**      | Container metrics     | 8080 | Docker stats        |
| **Node Exporter** | System metrics        | 9100 | Host monitoring     |

## 🌍 Environments

### Development (`dev`)

- Hot reload enabled
- Debug logging
- Local file volumes
- No SSL required
- Simplified authentication

**Configuration:** `docker-compose.dev.yml`

### Production (`prod`)

- Optimized builds
- Resource limits
- SSL/TLS encryption
- Security hardening
- Performance monitoring

**Configuration:** `docker-compose.prod.yml`

## 📦 Deployment

### Deploy Script Usage

```bash
./deploy.sh <command> [environment] [options]
```

#### Available Commands

| Command      | Description      | Example                               |
| ------------ | ---------------- | ------------------------------------- |
| `deploy`     | Full deployment  | `./deploy.sh deploy prod`             |
| `start`      | Start services   | `./deploy.sh start dev`               |
| `stop`       | Stop services    | `./deploy.sh stop prod`               |
| `restart`    | Restart services | `./deploy.sh restart dev`             |
| `logs`       | View logs        | `./deploy.sh logs backend`            |
| `status`     | Service status   | `./deploy.sh status prod`             |
| `migrate`    | Run migrations   | `./deploy.sh migrate prod`            |
| `seed`       | Seed database    | `./deploy.sh seed dev`                |
| `backup`     | Backup database  | `./deploy.sh backup prod`             |
| `restore`    | Restore database | `./deploy.sh restore prod backup.sql` |
| `ssl`        | Setup SSL        | `./deploy.sh ssl yourdomain.com`      |
| `monitoring` | Start monitoring | `./deploy.sh monitoring`              |
| `clean`      | Clean up         | `./deploy.sh clean`                   |
| `build`      | Build images     | `./deploy.sh build dev`               |
| `health`     | Health checks    | `./deploy.sh health prod`             |

### Environment Variables

#### Core Variables

```bash
# Database
DATABASE_URL=postgresql://user:pass@postgres:5432/db
POSTGRES_PASSWORD=your-secure-password

# Redis
REDIS_HOST=redis
REDIS_PORT=6379
REDIS_PASSWORD=your-redis-password

# Authentication
JWT_SECRET=your-jwt-secret-minimum-32-chars
NEXTAUTH_SECRET=your-nextauth-secret-minimum-32-chars
NEXTAUTH_URL=https://yourdomain.com

# API
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
FRONTEND_URL=https://yourdomain.com
```

#### Optional Variables

```bash
# SSL/TLS
SSL_CERT_PATH=/etc/nginx/ssl/cert.pem
SSL_KEY_PATH=/etc/nginx/ssl/key.pem

# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=noreply@yourdomain.com
SMTP_PASS=your-app-password

# Monitoring
GRAFANA_USER=admin
GRAFANA_PASSWORD=your-grafana-password
```

## 📊 Monitoring

### Starting Monitoring Stack

```bash
./deploy.sh monitoring
```

### Access Points

- **Grafana**: http://localhost:3001 (admin/admin)
- **Prometheus**: http://localhost:9090
- **cAdvisor**: http://localhost:8080

### Available Metrics

- Application performance
- Database queries
- API response times
- Container resource usage
- System metrics
- Error rates and logs

## 🔐 SSL Setup

### For Local Development

```bash
./deploy.sh ssl localhost
```

This creates self-signed certificates for local development.

### For Production

```bash
# For custom domain
./deploy.sh ssl yourdomain.com

# Follow the instructions to complete Let's Encrypt setup
```

### Manual SSL Setup

```bash
# Generate self-signed certificate
./setup-ssl.sh yourdomain.com

# Or use Let's Encrypt
certbot certonly --webroot -w /var/www/certbot -d yourdomain.com
```

## 💾 Backup & Restore

### Automatic Backups

```bash
# Create backup
./deploy.sh backup prod

# Restore from backup
./deploy.sh restore prod ./backups/backup_20250603_120000.sql
```

### Manual Backup

```bash
# Database backup
docker-compose exec postgres pg_dump -U postgres food_delivery > backup.sql

# Restore database
cat backup.sql | docker-compose exec -T postgres psql -U postgres food_delivery
```

## 🔨 Troubleshooting

### Common Issues

#### 1. Port Already in Use

```bash
# Check what's using the port
lsof -i :3000

# Kill the process
kill -9 <PID>
```

#### 2. Docker Out of Space

```bash
# Clean up unused containers and images
./deploy.sh clean

# Or manually
docker system prune -a --volumes
```

#### 3. Database Connection Issues

```bash
# Check database logs
./deploy.sh logs postgres

# Reset database
docker-compose down -v
./deploy.sh deploy dev
```

#### 4. SSL Certificate Issues

```bash
# Regenerate certificates
rm -rf nginx/ssl/*
./deploy.sh ssl localhost
```

#### 5. Build Failures

```bash
# Clear Docker cache
docker builder prune

# Rebuild without cache
./deploy.sh build dev
```

### Health Checks

```bash
# Check all services
./deploy.sh health prod

# Check specific service
curl http://localhost:3001/health
```

### Logs Analysis

```bash
# All logs
./deploy.sh logs

# Specific service
./deploy.sh logs backend

# Follow logs
./deploy.sh logs frontend | tail -f
```

## 🚀 Performance Optimization

### Production Optimizations

1. **Multi-stage Docker builds** for smaller images
2. **Resource limits** and reservations
3. **Health checks** for reliability
4. **Nginx caching** and compression
5. **Database connection pooling**
6. **Redis caching** for sessions

### Monitoring Recommendations

1. Set up alerts for:

   - High CPU/Memory usage
   - Database connection pool exhaustion
   - API response time degradation
   - Error rate spikes

2. Regular maintenance:
   - Database backups
   - Log rotation
   - Security updates
   - Performance tuning

## 📚 Additional Resources

- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [NestJS Documentation](https://nestjs.com/)
- [Next.js Documentation](https://nextjs.org/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Redis Documentation](https://redis.io/documentation)
- [Nginx Documentation](https://nginx.org/en/docs/)

## 📄 License

This project is licensed under the MIT License.
