@echo off
chcp 65001 >nul

echo 🚀 Kabedalch - Quick Install
echo ============================

echo 📦 نصب dependencies...
npm install

echo 🔧 تنظیم environment...
copy "apps\api\.env.example" "apps\api\.env" >nul 2>&1
echo NEXT_PUBLIC_API_URL=http://localhost:3001 > "apps\web\.env.local"

echo 🗄️ راه‌اندازی database...
docker-compose up -d postgres redis minio >nul 2>&1

echo 🔄 اجرای migrations...
cd apps\api
npm run prisma:migrate >nul 2>&1
npm run prisma:seed >nul 2>&1
cd ..\..

echo ✅ نصب کامل شد!
echo 🚀 برای شروع: npm run dev
pause