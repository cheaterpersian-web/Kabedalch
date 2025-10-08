# API Dockerfile - Space optimized
FROM node:20-alpine AS builder
WORKDIR /app

# Install build dependencies
RUN apk add --no-cache openssl
COPY package.json ./

# Install build tools only
RUN npm install -g @nestjs/cli typescript --no-audit --no-fund

# Install production dependencies
RUN npm install --omit=dev --no-audit --no-fund --no-optional

# Copy source and build
COPY . .
RUN npx prisma generate && nest build

# Production stage
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

# Install runtime dependencies
RUN apk add --no-cache openssl
COPY package.json ./
RUN npm install --omit=dev --no-audit --no-fund --no-optional

# Copy built application
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma
COPY --from=builder /app/prisma ./prisma

CMD ["sh", "-c", "npx prisma migrate deploy; npx prisma db push; node dist/main.js"]
