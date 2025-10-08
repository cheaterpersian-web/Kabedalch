#!/bin/bash

# 🚀 Kabedalch - Quick Install Script
# نصب سریع و آسان

echo "🚀 Kabedalch - Quick Install"
echo "============================"

# نصب dependencies
echo "📦 نصب dependencies..."
npm install

# ایجاد .env فایل‌ها
echo "🔧 تنظیم environment..."
cp apps/api/.env.example apps/api/.env 2>/dev/null || true
echo "NEXT_PUBLIC_API_URL=http://localhost:3001" > apps/web/.env.local

# راه‌اندازی database
echo "🗄️ راه‌اندازی database..."
docker-compose up -d postgres redis minio 2>/dev/null || echo "⚠️ Docker Compose نصب نیست"

# اجرای migrations
echo "🔄 اجرای migrations..."
cd apps/api
npm run prisma:migrate 2>/dev/null || echo "⚠️ Database connection failed"
npm run prisma:seed 2>/dev/null || echo "⚠️ Seeding failed"
cd ../..

echo "✅ نصب کامل شد!"
echo "🚀 برای شروع: npm run dev"