# وب‌سایت کبد چرب و ترک الکل

Monorepo شامل `apps/api` (NestJS) و `apps/web` (Next.js) با TypeScript.

## 🚀 نصب سریع

### اگر Node.js نصب نیست:
```bash
# Linux/macOS
./install-node.sh

# Windows: از https://nodejs.org/ دانلود کنید
```

### نصب پروژه:
```bash
# Linux/macOS
./quick-install.sh

# Windows
quick-install.bat
```

### نصب دستی:
```bash
npm i
docker compose up -d --build
docker compose exec api npx prisma migrate deploy
docker compose exec api npm run prisma:seed
```

## 🌐 دسترسی

- **API:** `http://localhost:3001/api/docs` (Swagger)
- **Web:** `http://localhost:3000`
- **Admin:** `http://localhost:3000/admin`

## 📋 پیش‌نیازها

- Node.js 20+
- Docker + docker-compose
- PostgreSQL (برای development)

## 🔄 به‌روزرسانی پروژه

### روی VPS:
```bash
# Update خودکار
./update.sh

# راه‌اندازی database
./setup-database.sh

# یا دستی
git pull origin main
npm install
npm run build
docker-compose up -d postgres redis minio
cd apps/api && npx prisma migrate deploy && cd ../..
docker-compose down && docker-compose up -d --build
```

اطلاعات آزمایشی seed شامل پکیج‌ها، رضایت‌نامه‌ها، و تمپلیت تست‌هاست.

## حساب ادمین نمونه

در حال حاضر می‌توانید یک ادمین بسازید:

```bash
docker compose exec api node -e "(async()=>{const bcrypt=require('bcrypt');const {PrismaClient}=require('@prisma/client');const p=new PrismaClient();const pw=await bcrypt.hash('Admin@123',10);await p.user.upsert({where:{email:'admin@example.com'},update:{role:'admin'},create:{name:'ادمین',family:'سیستم',phone:'09999999999',email:'admin@example.com',passwordHash:pw,role:'admin'}});console.log('admin: admin@example.com / Admin@123');process.exit(0)})()"
```

## اسناد
- مستندات استقرار: `docs/DEPLOY.md`
- چک‌لیست QA: `docs/QA_CHECKLIST.md`
