# API Dockerfile - Ultra minimal approach
FROM node:20-alpine AS builder
WORKDIR /app

# Install minimal system packages
RUN apk add --no-cache openssl

# Copy package files
COPY package.json ./

# Install only what's absolutely necessary for build
RUN npm install --omit=dev --omit=optional --no-audit --no-fund --no-save \
    @nestjs/core @nestjs/common @nestjs/platform-express typescript

# Copy source and build
COPY . .
RUN npx prisma generate && npx tsc -p tsconfig.build.json

# Production stage - minimal runtime
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
    @nestjs/core @nestjs/common @nestjs/platform-express @prisma/client

CMD ["sh", "-c", "npx prisma migrate deploy; npx prisma db push; node dist/main.js"]
