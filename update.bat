@echo off
chcp 65001 >nul

echo 🚀 Kabedalch - Auto Update
echo =========================

REM بررسی Git repository
if not exist ".git" (
    echo ❌ این directory یک Git repository نیست
    pause
    exit /b 1
)

REM Pull آخرین تغییرات
echo 📥 Pull آخرین تغییرات...
git pull origin main

REM نصب dependencies
echo 📦 نصب dependencies...
npm install

REM Build پروژه
echo 🔨 Build پروژه...
npm run build

REM اجرای migrations
echo 🗄️ اجرای migrations...
cd apps\api
npx prisma migrate deploy
cd ..\..

REM Restart سرویس‌ها
echo 🔄 Restart سرویس‌ها...

REM بررسی Docker Compose
docker-compose --version >nul 2>&1
if %errorlevel% equ 0 (
    echo 🐳 Restart با Docker Compose...
    docker-compose down
    docker-compose up -d --build
) else (
    echo ⚠️ لطفاً سرویس‌ها را دستی restart کنید
)

echo ✅ Update کامل شد!
echo 🌐 پروژه در دسترس است:
echo    - API: http://localhost:3001
echo    - Web: http://localhost:3000
pause