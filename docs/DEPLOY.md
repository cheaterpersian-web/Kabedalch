# استقرار (Deploy)

## پیش‌نیازها
- دامنه و VPS (Ubuntu 22.04)
- Docker و docker-compose
- NGINX به عنوان reverse proxy
- گواهی SSL با Let's Encrypt (certbot)

## مراحل محلی
```bash
docker compose up -d --build
# دیتابیس آماده شد، حالا Prisma schema را اعمال کنید
docker compose exec api npx prisma migrate deploy
# در صورت نیاز seed (در محیط توسعه)
docker compose exec api npm run prisma:seed
```

## استقرار روی سرور
- ریپازیتوری را کلون کنید و ENV ها را مطابق `.env.example` تنظیم کنید.
- رکورد DNS را به IP سرور اشاره دهید.
- فایل NGINX نمونه:

```nginx
server {
  listen 80;
  server_name example.com;
  location /.well-known/acme-challenge/ {
    root /var/www/certbot;
  }
  location / {
    return 301 https://$host$request_uri;
  }
}

server {
  listen 443 ssl;
  server_name example.com;
  ssl_certificate /etc/letsencrypt/live/example.com/fullchain.pem;
  ssl_certificate_key /etc/letsencrypt/live/example.com/privkey.pem;

  location /api/ {
    proxy_pass http://127.0.0.1:3001/api/;
    proxy_set_header Host $host;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
  }

  location / {
    proxy_pass http://127.0.0.1:3000/;
    proxy_set_header Host $host;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
  }
}
```

- اجرای سرویس‌ها:
```bash
docker compose -f docker-compose.yml up -d --build
```
