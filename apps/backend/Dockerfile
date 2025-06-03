# NestJS Backend Dockerfile with Turborepo pruning
FROM node:18-alpine AS base

# Prune workspace for backend
FROM base AS pruner
WORKDIR /app
RUN npm install -g turbo
COPY . .
RUN turbo prune --scope=backend --docker

# Install dependencies
FROM base AS installer
WORKDIR /app

# Copy root package.json and lockfile
COPY --from=pruner /app/out/json/ .
COPY --from=pruner /app/out/package-lock.json ./package-lock.json

# Install dependencies
RUN npm ci --frozen-lockfile

# Copy source code and build
COPY --from=pruner /app/out/full/ .

# Generate Prisma client from backend schema
RUN npx prisma generate --schema=./apps/backend/prisma/schema.prisma

# Build the application
RUN npm run build --workspace=backend

# Production runtime
FROM node:18-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

# Create non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nestjs

# Copy necessary files for production
COPY --from=installer /app/apps/backend/dist ./dist
COPY --from=installer /app/apps/backend/package.json ./package.json
COPY --from=installer /app/node_modules ./node_modules
COPY --from=installer /app/apps/backend/prisma ./prisma

# Set ownership
RUN chown -R nestjs:nodejs /app
USER nestjs

EXPOSE 3001

CMD ["node", "dist/main"]
