#!/bin/bash

# 🚀 Kabedalch - Easy Installation Script for macOS
# این script پروژه را به راحتی نصب و راه‌اندازی می‌کند

set -e

echo "🍎 Kabedalch - Easy Installation Script for macOS"
echo "================================================"

# بررسی Homebrew
if ! command -v brew &> /dev/null; then
    echo "❌ Homebrew نصب نیست. لطفاً Homebrew نصب کنید."
    echo "   /bin/bash -c \"\$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)\""
    exit 1
fi

echo "✅ Homebrew پیدا شد"

# بررسی Node.js
if ! command -v node &> /dev/null; then
    echo "📦 نصب Node.js..."
    brew install node
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 20 ]; then
    echo "📦 به‌روزرسانی Node.js..."
    brew upgrade node
fi

echo "✅ Node.js $(node -v) پیدا شد"

# بررسی Docker
if ! command -v docker &> /dev/null; then
    echo "📦 نصب Docker..."
    brew install --cask docker
    echo "⚠️  لطفاً Docker Desktop را راه‌اندازی کنید"
fi

echo "✅ Docker پیدا شد"

# بررسی Docker Compose
if ! command -v docker-compose &> /dev/null; then
    echo "📦 نصب Docker Compose..."
    brew install docker-compose
fi

echo "✅ Docker Compose پیدا شد"

# بررسی PostgreSQL
if ! command -v psql &> /dev/null; then
    echo "📦 نصب PostgreSQL..."
    brew install postgresql
    brew services start postgresql
fi

echo "✅ PostgreSQL پیدا شد"

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

# راه‌اندازی database با Docker Compose
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