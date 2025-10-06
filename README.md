# وب‌سایت کبد چرب و ترک الکل

Monorepo شامل `apps/api` (NestJS) و `apps/web` (Next.js) با TypeScript.

## شروع سریع (محلی)

- Node.js 20+
- Docker + docker-compose

```bash
npm i
# اجرای سرویس‌ها
docker compose up -d --build
# اعمال مایگریشن
docker compose exec api npx prisma migrate deploy
# مقداردهی اولیه (اختیاری محیط dev)
docker compose exec api npm run prisma:seed
```

- API: `http://localhost:3001/api/docs` (Swagger)
- Web: `http://localhost:3000`

اطلاعات آزمایشی seed شامل پکیج‌ها، رضایت‌نامه‌ها، و تمپلیت تست‌هاست.

## حساب ادمین نمونه

در حال حاضر می‌توانید یک ادمین بسازید:

```bash
docker compose exec api node -e "(async()=>{const bcrypt=require('bcrypt');const {PrismaClient}=require('@prisma/client');const p=new PrismaClient();const pw=await bcrypt.hash('Admin@123',10);await p.user.upsert({where:{email:'admin@example.com'},update:{role:'admin'},create:{name:'ادمین',family:'سیستم',phone:'09999999999',email:'admin@example.com',passwordHash:pw,role:'admin'}});console.log('admin: admin@example.com / Admin@123');process.exit(0)})()"
```

## اسناد
- مستندات استقرار: `docs/DEPLOY.md`
- چک‌لیست QA: `docs/QA_CHECKLIST.md`
