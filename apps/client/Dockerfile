# Next.js Frontend Dockerfile with Turborepo pruning
FROM node:18-alpine AS base

# Prune workspace for web (client)
FROM base AS pruner
WORKDIR /app
RUN npm install -g turbo
COPY . .
RUN turbo prune --scope=web --docker

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

# Build the Next.js application
RUN npm run build --workspace=web

# Production runtime
FROM node:18-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Create non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy necessary files for production
COPY --from=installer /app/apps/client/public ./public
COPY --from=installer /app/apps/client/.next/standalone ./
COPY --from=installer /app/apps/client/.next/static ./.next/static

# Set ownership
RUN chown -R nextjs:nodejs /app
USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
