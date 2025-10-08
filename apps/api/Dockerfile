# API Dockerfile - Optimized for space
FROM node:20-alpine AS builder
WORKDIR /app

# Install dependencies
RUN apk add --no-cache openssl
COPY package.json ./
RUN npm install --omit=dev --no-audit --no-fund

# Copy source and build
COPY . .
RUN npx prisma generate && npm run build

# Production stage
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

# Install only runtime dependencies
RUN apk add --no-cache openssl

# Copy only necessary files
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/prisma ./prisma
COPY package.json ./

CMD ["sh", "-c", "npx prisma migrate deploy; npx prisma db push; node dist/main.js"]
