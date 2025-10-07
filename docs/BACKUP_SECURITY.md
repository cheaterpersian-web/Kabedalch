# پشتیبان‌گیری و امنیت

## Backup
- PostgreSQL: اسکریپت روزانه dump با `pg_dump` و نگه‌داری 7 روز اخیر.
- Redis: snapshot هر 6 ساعت روی دیسک.
- فایل‌ها (S3/MinIO): lifecycle برای نسخه‌ها و حذف خودکار فایل‌های موقت.

نمونه cron:
```bash
0 3 * * * docker exec postgres pg_dump -U postgres app | gzip > /backups/pg-$(date +\%F).sql.gz
```

## امنیت
- اجبار HTTPS از NGINX
- متغیرهای محیطی امن (بدون hardcode)
- محدودیت نرخ درخواست‌ها (Rate Limit)
- اعتبارسنجی ورودی‌ها در API و Frontend
- رمزنگاری داده‌های حساس (کلید 32 بایتی base64)
- به‌روزرسانی منظم پکیج‌ها و ایمیج‌ها
- فعال‌سازی لاگ خطا و مانیتورینگ (Sentry/Elastic)
