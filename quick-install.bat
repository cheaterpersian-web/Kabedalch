@echo off
chcp 65001 >nul

echo 🚀 Kabedalch - Quick Install
echo ============================

REM بررسی Node.js و npm
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js نصب نیست. لطفاً Node.js 20+ نصب کنید.
    echo    برای نصب: https://nodejs.org/
    pause
    exit /b 1
)

npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ npm نصب نیست. لطفاً npm نصب کنید.
    pause
    exit /b 1
)

echo ✅ Node.js و npm پیدا شد

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