# Multi-stage build for Node.js app
FROM node:18-alpine AS base

# Build frontend
FROM base AS frontend-build
WORKDIR /app/client
COPY client/package*.json ./
RUN npm ci
COPY client/ ./
RUN npm run build

# Build backend
FROM base AS backend-build
WORKDIR /app/server
COPY server/package*.json ./
RUN npm ci
COPY server/ ./

# Production image
FROM node:18-alpine AS production
WORKDIR /app

# Copy backend files
COPY --from=backend-build /app/server ./
# Copy built frontend files
COPY --from=frontend-build /app/client/dist ./public

# Install only production dependencies
RUN npm ci --only=production

# Create uploads directory
RUN mkdir -p uploads

EXPOSE 4000

CMD ["npm", "start"]
