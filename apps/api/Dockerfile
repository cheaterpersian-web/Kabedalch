# API Dockerfile - Simplified approach
FROM node:20-alpine AS builder
WORKDIR /app

# Install system dependencies
RUN apk add --no-cache openssl

# Copy package files
COPY package.json ./

# Install all dependencies
RUN npm install --no-audit --no-fund

# Copy source and build
COPY . .
RUN npx prisma generate && npx nest build

# Production stage
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

# Install system dependencies
RUN apk add --no-cache openssl

# Copy built application
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/prisma ./prisma
COPY package.json ./

CMD ["sh", "-c", "npx prisma migrate deploy && node dist/main.js"]
