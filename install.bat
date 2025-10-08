@echo off
chcp 65001 >nul

echo 🎯 Kabedalch - Easy Installation Script
echo ======================================

REM بررسی Node.js
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js نصب نیست. لطفاً Node.js 20+ نصب کنید.
    echo    برای نصب: https://nodejs.org/
    pause
    exit /b 1
)

echo ✅ Node.js پیدا شد

REM بررسی npm
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ npm نصب نیست.
    pause
    exit /b 1
)

echo ✅ npm پیدا شد

REM بررسی Docker
docker --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ⚠️  Docker نصب نیست. برای production deployment نیاز است.
    echo    برای نصب: https://docs.docker.com/get-docker/
) else (
    echo ✅ Docker پیدا شد
)

REM بررسی Docker Compose
docker-compose --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ⚠️  Docker Compose نصب نیست. برای development نیاز است.
    echo    برای نصب: https://docs.docker.com/compose/install/
) else (
    echo ✅ Docker Compose پیدا شد
)

echo.
echo 📦 نصب dependencies...
npm install

echo.
echo 🔧 تنظیم environment variables...

REM ایجاد .env فایل‌ها
if not exist "apps\api\.env" (
    echo 📝 ایجاد apps\api\.env از .env.example...
    copy "apps\api\.env.example" "apps\api\.env"
    echo ⚠️  لطفاً apps\api\.env را ویرایش کنید و مقادیر واقعی را وارد کنید
)

if not exist "apps\web\.env.local" (
    echo 📝 ایجاد apps\web\.env.local...
    (
        echo NEXT_PUBLIC_API_URL=http://localhost:3001
        echo NEXT_PUBLIC_GA_ID=
        echo NEXT_PUBLIC_HCAPTCHA_SITE_KEY=
    ) > "apps\web\.env.local"
    echo ⚠️  لطفاً apps\web\.env.local را ویرایش کنید و مقادیر واقعی را وارد کنید
)

echo.
echo 🗄️  راه‌اندازی database...

REM راه‌اندازی database با Docker Compose
docker-compose --version >nul 2>&1
if %errorlevel% equ 0 (
    echo 🐳 راه‌اندازی database با Docker Compose...
    docker-compose up -d postgres redis minio
    
    echo ⏳ منتظر راه‌اندازی database...
    timeout /t 10 /nobreak >nul
    
    echo 🔄 اجرای migrations...
    cd apps\api
    npm run prisma:migrate
    npm run prisma:seed
    cd ..\..
    
    echo ✅ Database راه‌اندازی شد
) else (
    echo ⚠️  Docker Compose نصب نیست. لطفاً database را دستی راه‌اندازی کنید.
)

echo.
echo 🧪 اجرای تست‌ها...
npm test

echo.
echo 🎉 نصب کامل شد!
echo.
echo 🚀 برای شروع development:
echo    npm run dev
echo.
echo 🌐 برای production deployment:
echo    docker-compose up -d
echo.
echo 📚 مستندات کامل در README.md موجود است.
echo.
echo ✨ موفق باشید!
pause