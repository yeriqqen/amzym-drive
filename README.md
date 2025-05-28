# Food Delivery Platform

A comprehensive, multi-service food delivery platform built with modern technologies including NestJS, Next.js, Prisma, and Redis.

## 🏗️ Architecture

This is a monorepo project with the following structure:

- **Backend** (`apps/backend`): NestJS API with PostgreSQL and Redis
- **Frontend** (`apps/client`): Next.js 14 with TypeScript and Tailwind CSS
- **Database**: PostgreSQL with Prisma ORM
- **Cache**: Redis for performance optimization
- **Deployment**: Docker with Docker Compose

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

- Node.js 18+
- Docker and Docker Compose
- PostgreSQL (for local development)
- Redis (for local development)

### Development Setup

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd food-delivery-platform
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Environment Setup**

   ```bash
   cp .env.development .env
   # Edit .env with your database and Redis configurations
   ```

4. **Database Setup**

   ```bash
   # Start PostgreSQL (via Docker or locally)
   npx prisma migrate dev
   npx prisma generate
   ```

5. **Start Development Servers**

   ```bash
   # Start all services
   npm run dev

   # Or start individually
   npm run dev:backend  # Backend API on :3001
   npm run dev:frontend # Frontend on :3000
   ```

### Production Deployment

#### Using Docker Compose (Recommended)

1. **Configure Environment**

   ```bash
   cp .env.production .env.prod
   # Edit .env.prod with production values
   ```

2. **Deploy**
   ```bash
   chmod +x deploy.sh
   ./deploy.sh
   ```

#### Manual Deployment

1. **Build Applications**

   ```bash
   npm run build
   ```

2. **Database Migration**

   ```bash
   npx prisma migrate deploy
   ```

3. **Start Services**
   ```bash
   npm run start:prod
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
