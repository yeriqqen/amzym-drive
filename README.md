# Food Delivery Platform

A comprehensive, multi-service food delivery platform built with modern technologies including NestJS, Next.js, Prisma, and Redis.

## 🏗️ Architecture

This is a monorepo project built with Turborepo, featuring:

```
food-delivery-platform/
├── apps/
│   ├── backend/          # NestJS API server
│   │   ├── src/          # Source code
│   │   ├── prisma/       # Database schema & migrations
│   │   └── Dockerfile    # Backend container config
│   └── client/           # Next.js frontend (package name: "web")
│       ├── app/          # Next.js 14 App Router
│       ├── components/   # React components
│       └── Dockerfile    # Frontend container config
├── monitoring/           # Observability stack configs
├── nginx/               # Reverse proxy & SSL
├── docker-compose.*.yml # Container orchestration
└── deploy.sh           # Deployment automation
```

- **Backend** (`apps/backend`): NestJS API with PostgreSQL and Redis
- **Frontend** (`apps/client`): Next.js 14 with TypeScript and Tailwind CSS
- **Database**: PostgreSQL with Prisma ORM
- **Cache**: Redis for performance optimization
- **Deployment**: Docker with Docker Compose
- **Monitoring**: Prometheus, Grafana, Loki for observability

## 🚀 Features

### Core Features

- **User Authentication**: JWT-based auth with role-based access control (USER, ADMIN, DELIVERY)
- **Order Management**: Complete order lifecycle from creation to delivery
- **Item Catalog**: Categorized food items with search and filtering
- **Shopping Cart**: Persistent cart with local storage
- **Real-time Updates**: Order status tracking

### Performance & Security

- **Database Optimization**: Indexed queries and connection pooling
- **Caching Layer**: Redis caching for frequently accessed data
- **Rate Limiting**: API rate limiting to prevent abuse
- **Security Headers**: Helmet.js for security hardening
- **Input Validation**: Comprehensive DTO validation
- **Error Handling**: Structured error responses

### DevOps & Monitoring

- **Containerization**: Docker and Docker Compose
- **CI/CD Pipeline**: GitHub Actions with automated testing
- **Performance Monitoring**: Request/response time tracking
- **Structured Logging**: Comprehensive logging system
- **Health Checks**: Application and service health monitoring

## 🛠️ Tech Stack

### Backend

- **Framework**: NestJS 10
- **Database**: PostgreSQL 15 with Prisma ORM
- **Cache**: Redis 7
- **Authentication**: JWT with Passport
- **Validation**: class-validator
- **Testing**: Jest with comprehensive test coverage
- **Security**: Helmet, bcrypt, rate limiting

### Frontend

- **Framework**: Next.js 14 with App Router
- **Styling**: Tailwind CSS
- **State Management**: React Context API
- **HTTP Client**: Fetch API
- **TypeScript**: Full type safety

### Infrastructure

- **Containerization**: Docker & Docker Compose
- **Reverse Proxy**: Nginx with rate limiting
- **CI/CD**: GitHub Actions
- **Monitoring**: Custom performance tracking

## 🏃‍♂️ Quick Start

### Prerequisites

- **Node.js 18+** (for local development)
- **Docker and Docker Compose** (recommended for full-stack development)
- **Git**

> **💡 Recommendation**: Use Docker for development as it provides:
>
> - Consistent environment across all machines
> - Automatic database and Redis setup
> - Production-like configuration
> - Easy service management with health checks
> - No need to install PostgreSQL and Redis locally

### Local Development with Docker (Recommended)

This is the easiest way to get the project running locally with all services.

1. **Clone the repository**

   ```bash
   git clone https://github.com/yeriqqen/amzym-drive.git
   cd amzym-drive
   ```

2. **Set up environment variables**

   ```bash
   # Copy development environment template
   cp .env.example .env.dev

   # The .env.dev file is already configured for Docker development
   # No changes needed for local development
   ```

3. **Start development environment**

   ```bash
   # Make deploy script executable
   chmod +x deploy.sh

   # Start all services (PostgreSQL, Redis, Backend, Frontend)
   ./deploy.sh start dev

   # View logs (optional)
   ./deploy.sh logs dev
   ```

4. **Access the application**

   - **Frontend**: http://localhost:3000
   - **Backend API**: http://localhost:3001
   - **API Documentation**: http://localhost:3001/api
   - **Database**: localhost:5433 (username: postgres, password: dev-password)
   - **Redis**: localhost:6380 (no password in dev)
   - **Monitoring**: Available with `./deploy.sh monitoring`
     - Grafana: http://localhost:3000 (admin/admin)
     - Prometheus: http://localhost:9090

5. **Development workflow**

   ```bash
   # Stop services
   ./deploy.sh stop dev

   # Restart services
   ./deploy.sh restart dev

   # View specific service logs
   ./deploy.sh logs backend
   ./deploy.sh logs frontend

   # Run database migrations
   ./deploy.sh migrate dev

   # Seed database with sample data
   ./deploy.sh seed dev

   # Check service health
   ./deploy.sh health dev
   ```

### Alternative: Local Development without Docker

If you prefer to run services locally without Docker:

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Set up local databases**

   ```bash
   # Install PostgreSQL and Redis locally
   # macOS
   brew install postgresql redis
   brew services start postgresql
   brew services start redis

   # Ubuntu/Debian
   sudo apt-get install postgresql redis-server
   sudo systemctl start postgresql
   sudo systemctl start redis
   ```

3. **Configure environment**

   ```bash
   # Create local environment file
   cp .env.example .env.local

   # Edit .env.local with local database URLs:
   # DATABASE_URL=postgresql://delivery_user:strongpassword123@localhost:5432/food_delivery
   # REDIS_HOST=localhost
   # REDIS_PORT=6379
   ```

4. **Database setup**

   ```bash
   # Generate Prisma client
   npx prisma generate

   # Run migrations
   npx prisma migrate dev

   # Seed database (optional)
   npm run db:seed
   ```

5. **Start development servers**

   ```bash
   # Start backend (Terminal 1)
   npm run dev:backend

   # Start frontend (Terminal 2)
   npm run dev:frontend

   # Or start both services together
   npm run dev
   ```

### Vercel Deployment

Deploy your food delivery platform to Vercel with these steps:

#### Prerequisites for Vercel Deployment

- **Vercel account** at https://vercel.com
- **Vercel CLI** installed: `npm i -g vercel`
- **Production database** (Vercel PostgreSQL, Supabase, or other)
- **Redis instance** (Upstash, Redis Cloud, or other)

#### Step 1: Prepare for Deployment

1. **Install Vercel CLI**

   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**

   ```bash
   vercel login
   ```

#### Step 2: Configure Production Environment

1. **Create production environment file**

   ```bash
   cp .env.prod.example .env.production
   ```

2. **Update production values in `.env.production`**

   ```bash
   # Database (use Vercel PostgreSQL or external service)
   DATABASE_URL=postgresql://username:password@host:5432/database

   # Redis (use Upstash or Redis Cloud)
   REDIS_HOST=your-redis-host.com
   REDIS_PORT=6379
   REDIS_PASSWORD=your-redis-password

   # Security (generate secure values)
   JWT_SECRET=your-super-secure-jwt-secret-minimum-32-characters
   NEXTAUTH_SECRET=your-super-secure-nextauth-secret-minimum-32-chars
   NEXTAUTH_URL=https://your-app.vercel.app

   # API URLs
   NEXT_PUBLIC_API_URL=https://your-backend.vercel.app
   FRONTEND_URL=https://your-app.vercel.app
   ```

#### Step 3: Deploy Backend to Vercel

1. **Configure backend for Vercel**

   Create `apps/backend/vercel.json`:

   ```json
   {
     "version": 2,
     "builds": [
       {
         "src": "dist/src/main.js",
         "use": "@vercel/node"
       }
     ],
     "routes": [
       {
         "src": "/(.*)",
         "dest": "dist/src/main.js"
       }
     ],
     "env": {
       "NODE_ENV": "production"
     }
   }
   ```

2. **Deploy backend**

   ```bash
   cd apps/backend
   vercel

   # Follow prompts:
   # - Link to existing project or create new
   # - Set project name (e.g., food-delivery-api)
   # - Choose settings
   ```

3. **Add environment variables in Vercel dashboard**

   - Go to your project in Vercel dashboard
   - Navigate to Settings → Environment Variables
   - Add all variables from `.env.production`

4. **Run database migrations**

   ```bash
   # After deployment, run migrations
   vercel env pull .env.vercel
   npx prisma migrate deploy
   ```

#### Step 4: Deploy Frontend to Vercel

1. **Configure frontend for Vercel**

   Create `apps/client/vercel.json`:

   ```json
   {
     "framework": "nextjs",
     "buildCommand": "npm run build",
     "outputDirectory": ".next",
     "installCommand": "npm install",
     "functions": {
       "app/**/*.{js,ts,tsx}": {
         "maxDuration": 30
       }
     }
   }
   ```

2. **Update Next.js config for Vercel**

   In `apps/client/next.config.mjs`:

   ```javascript
   /** @type {import('next').NextConfig} */
   const nextConfig = {
     reactStrictMode: true,
     swcMinify: true,
     images: {
       domains: ['localhost', '127.0.0.1', 'your-backend.vercel.app', 'images.unsplash.com'],
       remotePatterns: [
         {
           protocol: 'https',
           hostname: 'your-backend.vercel.app',
           pathname: '/uploads/**',
         },
         {
           protocol: 'https',
           hostname: 'images.unsplash.com',
           pathname: '/**',
         },
       ],
     },
     // Remove output: 'standalone' for Vercel deployment
     // output: 'standalone', // Only for Docker
   };

   export default nextConfig;
   ```

3. **Deploy frontend**

   ```bash
   cd apps/client
   vercel

   # Follow prompts and add environment variables:
   # NEXT_PUBLIC_API_URL=https://your-backend.vercel.app
   # NEXTAUTH_URL=https://your-frontend.vercel.app
   # NEXTAUTH_SECRET=your-nextauth-secret
   ```

#### Step 5: Configure Custom Domains (Optional)

1. **Add custom domain in Vercel**

   - Go to project settings in Vercel dashboard
   - Add your custom domain
   - Configure DNS settings as instructed

2. **Update environment variables**
   - Update `NEXTAUTH_URL` and `FRONTEND_URL` with custom domain
   - Redeploy both frontend and backend

#### Alternative: Deploy with Vercel Integration

For easier deployment, you can connect your GitHub repository to Vercel:

1. **Push code to GitHub**

   ```bash
   git add .
   git commit -m "Ready for Vercel deployment"
   git push origin main
   ```

2. **Import project in Vercel**

   - Go to Vercel dashboard
   - Click "New Project"
   - Import from GitHub
   - Configure build settings:
     - **Backend**: Root directory: `apps/backend`
     - **Frontend**: Root directory: `apps/client`

3. **Configure environment variables**
   - Add all production environment variables
   - Set up database and Redis connections

#### Step 6: Database Options for Vercel

**Option 1: Vercel PostgreSQL (Recommended)**

```bash
# Install Vercel PostgreSQL
vercel storage create
# Choose PostgreSQL and follow setup
```

**Option 2: Supabase (Popular alternative)**

```bash
# Create Supabase project at https://supabase.com
# Get connection string from project settings
# Add to environment variables
```

**Option 3: PlanetScale (MySQL alternative)**

```bash
# Create PlanetScale database at https://planetscale.com
# Get connection string
# Update Prisma schema for MySQL
```

#### Step 7: Redis Options for Vercel

**Option 1: Upstash Redis (Recommended)**

```bash
# Create Upstash Redis at https://upstash.com
# Get connection details
# Add REDIS_HOST, REDIS_PORT, REDIS_PASSWORD to Vercel env vars
```

**Option 2: Redis Cloud**

```bash
# Create Redis Cloud instance at https://redis.com
# Get connection details
# Configure in Vercel environment variables
```

### Production Deployment with Docker

For deploying to your own server or cloud instance using Docker:

1. **Production deployment**

   ```bash
   # Deploy production environment
   ./deploy.sh deploy prod

   # Or manually with environment files
   docker-compose -f docker-compose.prod.yml --env-file .env.prod up -d
   ```

2. **SSL setup for production**

   ```bash
   # Setup SSL certificates
   ./deploy.sh ssl

   # Start with SSL enabled
   ./deploy.sh start prod
   ```

3. **Production monitoring**

   ```bash
   # Start monitoring stack
   ./deploy.sh monitoring

   # Access monitoring dashboards
   # Grafana: https://your-domain.com:3000
   # Prometheus: https://your-domain.com:9090
   ```

For detailed production deployment instructions, see [DOCKER_README.md](DOCKER_README.md) and [DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md).

## 🚨 Troubleshooting

### Common Issues

#### Local Development

**Issue**: Services not starting with Docker

```bash
# Check service status
./deploy.sh status dev

# View service logs
./deploy.sh logs backend
./deploy.sh logs frontend

# Restart services
./deploy.sh restart dev
```

**Issue**: Database connection errors

```bash
# Check database status
./deploy.sh health dev

# Run migrations
./deploy.sh migrate dev

# Reset database (development only)
docker-compose -f docker-compose.dev.yml down -v
./deploy.sh start dev
```

**Issue**: Frontend can't connect to backend

- Verify `NEXT_PUBLIC_API_URL` in environment variables
- Check backend is running on correct port (3001)
- Ensure CORS is configured properly in backend

#### Vercel Deployment

**Issue**: Build failures

- Check build logs in Vercel dashboard
- Verify all dependencies are in `package.json`
- Ensure environment variables are set correctly

**Issue**: Database connection errors

- Verify `DATABASE_URL` is correct
- Check database service is accessible from Vercel
- Run migrations: `npx prisma migrate deploy`

**Issue**: CORS errors

- Update `FRONTEND_URL` in backend environment variables
- Configure CORS origins in `main.ts`

### Environment Variables Reference

#### Required for Local Development

```bash
# Backend (.env.dev)
DATABASE_URL=postgresql://postgres:dev-password@localhost:5433/food_delivery
REDIS_HOST=localhost
REDIS_PORT=6379
JWT_SECRET=dev-jwt-secret-key-at-least-32-characters
NODE_ENV=development
PORT=3001
FRONTEND_URL=http://localhost:3000

# Frontend (.env.dev)
NEXT_PUBLIC_API_URL=http://localhost:3001
```

#### Required for Vercel Deployment

```bash
# Backend (Vercel Environment Variables)
DATABASE_URL=postgresql://username:password@host:5432/database
REDIS_HOST=your-redis-host.com
REDIS_PORT=6379
REDIS_PASSWORD=your-redis-password
JWT_SECRET=production-jwt-secret-minimum-32-characters
NODE_ENV=production
PORT=3001
FRONTEND_URL=https://your-app.vercel.app

# Frontend (Vercel Environment Variables)
NEXT_PUBLIC_API_URL=https://your-backend.vercel.app
NEXTAUTH_URL=https://your-app.vercel.app
NEXTAUTH_SECRET=production-nextauth-secret-minimum-32-chars
```

## 📊 API Documentation

Once the backend is running, visit:

- **Swagger UI**: http://localhost:3001/api
- **Health Check**: http://localhost:3001/health

### Key Endpoints

#### Authentication

- `POST /auth/register` - User registration
- `POST /auth/login` - User login

#### Orders

- `GET /orders` - Get user orders
- `POST /orders` - Create new order
- `PATCH /orders/:id/status` - Update order status

#### Items

- `GET /items` - Get food items
- `GET /items?category=:category` - Filter by category

## 🧪 Testing

```bash
# Run all tests
npm run test

# Run with coverage
npm run test:cov

# Run e2e tests
npm run test:e2e

# Run specific test suite
npm run test -- --testNamePattern="UsersService"
```

## 🔧 Development Scripts

### Root Level Scripts (Turborepo)

```bash
# Development
npm run dev                    # Start both backend and frontend
npm run dev:backend           # Start only backend (apps/backend)
npm run dev:frontend          # Start only frontend (apps/client)

# Building
npm run build                 # Build both applications
npm run build:backend         # Build only backend
npm run build:frontend        # Build only frontend

# Testing
npm run test                  # Run all tests
npm run test:cov             # Run tests with coverage
npm run test:e2e             # Run end-to-end tests

# Database Operations
npm run db:generate          # Generate Prisma client
npm run db:migrate           # Run database migrations (dev)
npm run db:migrate:prod      # Run database migrations (production)
npm run db:seed              # Seed database with sample data
npm run db:studio            # Open Prisma Studio

# Docker Operations (Alternative to deploy.sh)
npm run docker:build         # Build Docker images
npm run docker:dev           # Start development environment
npm run docker:prod          # Start production environment
```

### Individual Service Scripts

```bash
# Backend (apps/backend)
cd apps/backend
npm run dev                  # Start in watch mode
npm run build                # Build for production
npm run start:prod           # Start production build

# Frontend (apps/client)
cd apps/client
npm run dev                  # Start development server
npm run build                # Build for production
npm run start                # Start production build
```

## 🔧 Configuration

### Environment Variables

#### Backend Configuration

```bash
# Database
DATABASE_URL=postgresql://user:pass@localhost:5432/food_delivery
POSTGRES_PASSWORD=your-password

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=your-redis-password

# JWT
JWT_SECRET=your-super-secret-jwt-key

# App
NODE_ENV=production
PORT=3001
FRONTEND_URL=https://yourdomain.com
```

#### Frontend Configuration

```bash
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### Performance Tuning

#### Database

- Connection pooling configured for optimal performance
- Indexes on frequently queried fields
- Query optimization with Prisma

#### Caching

- Redis caching for user data, orders, and items
- Configurable TTL values
- Cache invalidation strategies

#### Rate Limiting

- API-wide rate limiting: 100 requests/minute
- Auth endpoints: 5 requests/minute
- Configurable per endpoint

## 📈 Monitoring & Logging

### Performance Metrics

- Request/response times
- Memory usage tracking
- Database query performance
- Cache hit/miss ratios

### Logging Levels

- **Production**: Error and Warning only
- **Development**: Full debug logging
- **Structured**: JSON formatted logs for parsing

### Health Checks

- Application health: `/health`
- Database connectivity
- Redis connectivity
- Service dependencies

## 🔒 Security Features

- **Authentication**: JWT with secure token handling
- **Authorization**: Role-based access control
- **Input Validation**: Comprehensive DTO validation
- **Rate Limiting**: Protection against API abuse
- **Security Headers**: Helmet.js security middleware
- **Password Hashing**: bcrypt with salt rounds
- **CORS**: Configurable cross-origin policies

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow TypeScript best practices
- Write comprehensive tests
- Update documentation for new features
- Follow the established code style (Prettier/ESLint)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:

- Create an issue in the repository
- Check the documentation in `/docs`
- Review the API documentation at `/api`

## 🗺️ Roadmap

- [ ] Real-time order tracking with WebSockets
- [ ] Push notifications
- [ ] Advanced analytics dashboard
- [ ] Multi-tenant support
- [ ] Mobile app development
- [ ] Payment gateway integration
- [ ] Delivery route optimization

## 📋 Quick Reference

### Key Commands

```bash
# Start development environment
./deploy.sh start dev

# View all services status
./deploy.sh status dev

# Stop all services
./deploy.sh stop dev

# View logs
./deploy.sh logs backend
./deploy.sh logs frontend

# Database operations
./deploy.sh migrate dev
./deploy.sh seed dev

# Production deployment
./deploy.sh deploy prod
```

### Important Files

- `deploy.sh` - Main deployment and management script
- `docker-compose.dev.yml` - Development environment configuration
- `docker-compose.prod.yml` - Production environment configuration
- `.env.dev` - Development environment variables
- `.env.prod` - Production environment variables
- `DOCKER_README.md` - Comprehensive Docker documentation
- `DEPLOYMENT_CHECKLIST.md` - Production deployment guide

### Package Names & Workspaces

- **Backend**: `backend` (apps/backend)
- **Frontend**: `web` (apps/client)
- **Root**: `food-delivery-platform`

### Default Ports

- **Frontend**: 3000
- **Backend**: 3001
- **Database**: 5433 (Docker), 5432 (local)
- **Redis**: 6380 (Docker), 6379 (local)
- **Grafana**: 3000 (monitoring)
- **Prometheus**: 9090 (monitoring)
