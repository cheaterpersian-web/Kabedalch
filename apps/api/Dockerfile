# API Dockerfile - Extreme space optimization
FROM node:20-alpine AS builder
WORKDIR /app

# Install only essential packages
RUN apk add --no-cache openssl

# Copy package files
COPY package.json ./

# Install all dependencies for build
RUN npm install --no-audit --no-fund \
    && npm install -g @nestjs/cli --no-audit --no-fund \
    && npm cache clean --force

# Copy source and build
COPY . .
RUN find . -name "uploads*" -type f
RUN npx prisma generate && npx nest build

# Clean up after build
RUN rm -rf node_modules && npm cache clean --force

# Production stage - ultra minimal
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

# Install only runtime essentials
RUN apk add --no-cache openssl

# Copy built application
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma
COPY --from=builder /app/prisma ./prisma
COPY package.json ./

# Install only essential runtime dependencies
RUN npm install --omit=dev --omit=optional --no-audit --no-fund --no-save \
    @nestjs/core @nestjs/common @nestjs/platform-express @prisma/client \
    && npm cache clean --force

CMD ["sh", "-c", "npx prisma migrate deploy; npx prisma db push; node dist/main.js"]
