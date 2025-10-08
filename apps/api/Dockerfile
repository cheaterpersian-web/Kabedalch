# API Dockerfile - Optimized for space
FROM node:20-alpine AS builder
WORKDIR /app

# Install all dependencies (including dev for build)
RUN apk add --no-cache openssl
COPY package.json ./
RUN npm install --no-audit --no-fund

# Copy source and build
COPY . .
RUN npx prisma generate && npm run build

# Production stage
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

# Install only runtime dependencies
RUN apk add --no-cache openssl
COPY package.json ./
RUN npm install --omit=dev --no-audit --no-fund

# Copy only necessary files
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma
COPY --from=builder /app/prisma ./prisma

CMD ["sh", "-c", "npx prisma migrate deploy; npx prisma db push; node dist/main.js"]
