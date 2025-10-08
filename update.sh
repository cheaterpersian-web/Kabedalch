#!/bin/bash

# 🚀 Kabedalch - Auto Update Script
# اسکریپت خودکار برای به‌روزرسانی پروژه روی VPS

echo "🚀 Kabedalch - Auto Update"
echo "========================="

# بررسی Git repository
if [ ! -d ".git" ]; then
    echo "❌ این directory یک Git repository نیست"
    exit 1
fi

# Pull آخرین تغییرات
echo "📥 Pull آخرین تغییرات..."
git pull origin main

# نصب dependencies
echo "📦 نصب dependencies..."
npm install

# Build پروژه
echo "🔨 Build پروژه..."
npm run build

# راه‌اندازی database
echo "🗄️ راه‌اندازی database..."

# بررسی Docker Compose
if command -v docker-compose &> /dev/null; then
    echo "🐳 راه‌اندازی database با Docker Compose..."
    docker-compose up -d postgres redis minio
    
    echo "⏳ منتظر راه‌اندازی database..."
    sleep 10
    
    # اجرای migrations
    echo "🔄 اجرای migrations..."
    cd apps/api
    npx prisma migrate deploy
    cd ../..
    
    echo "🔄 Restart سرویس‌ها..."
    docker-compose down
    docker-compose up -d --build
elif command -v pm2 &> /dev/null; then
    echo "⚡ Restart با PM2..."
    pm2 restart all
else
    echo "⚠️ لطفاً database و سرویس‌ها را دستی راه‌اندازی کنید"
fi

echo "✅ Update کامل شد!"
echo "🌐 پروژه در دسترس است:"
echo "   - API: http://localhost:3001"
echo "   - Web: http://localhost:3000"