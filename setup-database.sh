#!/bin/bash

# 🗄️ Kabedalch - Database Setup Script
# راه‌اندازی database و اجرای migrations

echo "🗄️ Kabedalch - Database Setup"
echo "============================="

# بررسی Docker Compose
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose نصب نیست"
    exit 1
fi

echo "🐳 راه‌اندازی database services..."
docker-compose up -d postgres redis minio

echo "⏳ منتظر راه‌اندازی database..."
sleep 15

# بررسی اتصال database
echo "🔍 بررسی اتصال database..."
cd apps/api

# اجرای migrations
echo "🔄 اجرای migrations..."
npx prisma migrate deploy

# Seed database
echo "🌱 Seed database..."
npx prisma db seed

cd ../..

echo "✅ Database راه‌اندازی شد!"
echo "🌐 سرویس‌ها در دسترس:"
echo "   - PostgreSQL: localhost:5432"
echo "   - Redis: localhost:6379"
echo "   - MinIO: localhost:9000"