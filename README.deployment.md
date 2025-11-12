# راهنمای سریع Build و Deployment

## مشکل PDF Generator در Production

اگر در production با این مشکل مواجه شده‌اید:
- بار اول: خطای 404 در مسیر `/assets/pdfGenerator-xxx.js`
- بار دوم: PDF به درستی کار می‌کند

**علت:** مسیر base در Vite تنظیم نشده و فایل‌های lazy-loaded در مسیر اشتباه جستجو می‌شوند.

## راه حل

### گام 1: تنظیم Base Path

فایل `.env.production` را ویرایش کنید:

```bash
# برای استقرار در https://example.com/uploads/starling/
VITE_BASE_PATH=/uploads/starling/

# برای استقرار در ریشه دامنه
VITE_BASE_PATH=/
```

### گام 2: نصب وابستگی‌ها (اگر نصب نکرده‌اید)

```bash
npm install
```

### گام 3: Build مجدد

```bash
npm run build
```

یا از اسکریپت‌های آماده استفاده کنید:

```bash
# Build برای ریشه دامنه
npm run build:root

# Build برای مسیر /uploads/starling/
npm run build:starling
```

**نکته:** اسکریپت‌ها از پکیج `cross-env` استفاده می‌کنند تا در ویندوز، لینوکس و macOS به درستی کار کنند.

### گام 4: انتقال به سرور

فایل‌های داخل `dist/` را به سرور منتقل کنید.

## تست

1. Console مرورگر را باز کنید
2. روی دکمه "تولید PDF" کلیک کنید
3. بررسی کنید که درخواست به مسیر صحیح می‌رود:
   - ✅ صحیح: `/uploads/starling/assets/pdfGenerator-xxx.js`
   - ❌ اشتباه: `/assets/pdfGenerator-xxx.js`

## اسکریپت‌های Build

| اسکریپت | کاربرد |
|---------|--------|
| `npm run build` | Build با تنظیمات `.env.production` |
| `npm run build:root` | Build برای ریشه دامنه (`/`) |
| `npm run build:starling` | Build برای `/uploads/starling/` |

## نکات مهم

1. **همیشه** مسیر را با `/` شروع کنید
2. **همیشه** مسیر را با `/` ختم کنید (به جز `/` برای ریشه)
3. بعد از تغییر base path، حتماً **build مجدد** انجام دهید
4. در development (با `npm run dev`) نیازی به base path نیست

## مثال‌های رایج

```bash
# سایت در ریشه: https://example.com/
VITE_BASE_PATH=/

# سایت در زیرشاخه: https://example.com/modules/
VITE_BASE_PATH=/modules/

# سایت در چند سطح: https://example.com/uploads/starling/
VITE_BASE_PATH=/uploads/starling/
```

## مستندات کامل

برای اطلاعات بیشتر، [DEPLOYMENT.md](DEPLOYMENT.md) را مطالعه کنید.
