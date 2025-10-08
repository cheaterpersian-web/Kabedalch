#!/bin/bash

# 🚀 Kabedalch - Easy Installation Script
# این script پروژه را به راحتی نصب و راه‌اندازی می‌کند

set -e

echo "🎯 Kabedalch - Easy Installation Script"
echo "======================================"

# بررسی Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js نصب نیست. لطفاً Node.js 20+ نصب کنید."
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 20 ]; then
    echo "❌ Node.js version $NODE_VERSION کمتر از 20 است. لطفاً Node.js 20+ نصب کنید."
    exit 1
fi

echo "✅ Node.js $(node -v) پیدا شد"

# بررسی npm
if ! command -v npm &> /dev/null; then
    echo "❌ npm نصب نیست."
    exit 1
fi

echo "✅ npm $(npm -v) پیدا شد"

# بررسی Docker
if ! command -v docker &> /dev/null; then
    echo "⚠️  Docker نصب نیست. برای production deployment نیاز است."
    echo "   برای نصب: https://docs.docker.com/get-docker/"
else
    echo "✅ Docker $(docker --version) پیدا شد"
fi

# بررسی Docker Compose
if ! command -v docker-compose &> /dev/null; then
    echo "⚠️  Docker Compose نصب نیست. برای development نیاز است."
    echo "   برای نصب: https://docs.docker.com/compose/install/"
else
    echo "✅ Docker Compose $(docker-compose --version) پیدا شد"
fi

echo ""
echo "📦 نصب dependencies..."
npm install

echo ""
echo "🔧 تنظیم environment variables..."

# ایجاد .env فایل‌ها
if [ ! -f "apps/api/.env" ]; then
    echo "📝 ایجاد apps/api/.env از .env.example..."
    cp apps/api/.env.example apps/api/.env
    echo "⚠️  لطفاً apps/api/.env را ویرایش کنید و مقادیر واقعی را وارد کنید"
fi

if [ ! -f "apps/web/.env.local" ]; then
    echo "📝 ایجاد apps/web/.env.local..."
    cat > apps/web/.env.local << EOF
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_GA_ID=
NEXT_PUBLIC_HCAPTCHA_SITE_KEY=
EOF
    echo "⚠️  لطفاً apps/web/.env.local را ویرایش کنید و مقادیر واقعی را وارد کنید"
fi

echo ""
echo "🗄️  راه‌اندازی database..."

# بررسی PostgreSQL
if command -v psql &> /dev/null; then
    echo "✅ PostgreSQL پیدا شد"
else
    echo "⚠️  PostgreSQL نصب نیست. برای development نیاز است."
    echo "   برای نصب: https://www.postgresql.org/download/"
fi

# راه‌اندازی database با Docker Compose
if command -v docker-compose &> /dev/null; then
    echo "🐳 راه‌اندازی database با Docker Compose..."
    docker-compose up -d postgres redis minio
    
    echo "⏳ منتظر راه‌اندازی database..."
    sleep 10
    
    echo "🔄 اجرای migrations..."
    cd apps/api
    npm run prisma:migrate
    npm run prisma:seed
    cd ../..
    
    echo "✅ Database راه‌اندازی شد"
else
    echo "⚠️  Docker Compose نصب نیست. لطفاً database را دستی راه‌اندازی کنید."
fi

echo ""
echo "🧪 اجرای تست‌ها..."
npm test

echo ""
echo "🎉 نصب کامل شد!"
echo ""
echo "🚀 برای شروع development:"
echo "   npm run dev"
echo ""
echo "🌐 برای production deployment:"
echo "   docker-compose up -d"
echo ""
echo "📚 مستندات کامل در README.md موجود است."
echo ""
echo "✨ موفق باشید!"