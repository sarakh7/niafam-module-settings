# راهنمای استقرار و پیکربندی

این راهنما برای مدیران سرور و تیم DevOps است که می‌خواهند ماژول تنظیمات Niafam را بر روی سرورهای مختلف با پیکربندی‌های سفارشی مستقر کنند.

## معماری پیکربندی

ماژول از یک سیستم پیکربندی دو لایه استفاده می‌کند:

1. **تنظیمات پیش‌فرض** (`public/config/settings.default.json`) - همراه با build
2. **تنظیمات سفارشی سرور** (`config/settings.json`) - خارج از build، اختیاری

### مزایای این معماری:

- ✅ تنظیمات سفارشی با `npm run build` پاک نمی‌شوند
- ✅ هر سرور می‌تواند پیکربندی مخصوص خود را داشته باشد
- ✅ بدون نیاز به rebuild برای تغییر تنظیمات
- ✅ تنظیمات در Git ذخیره نمی‌شوند (امنیت بیشتر)
- ✅ به راحتی قابل مدیریت توسط تیم DevOps

## نحوه کار

1. برنامه ابتدا سعی می‌کند `config/settings.json` را بخواند
2. اگر فایل وجود نداشت، از `public/config/settings.default.json` استفاده می‌کند
3. تنظیمات خوانده شده با validation و sanitization امنیتی بررسی می‌شوند
4. تنظیمات معتبر با تنظیمات داخلی برنامه merge می‌شوند

## مراحل استقرار

### گام 1: Build کردن برنامه

```bash
npm install
npm run build
```

این دستورات پوشه `dist/` را ایجاد می‌کنند که شامل فایل‌های آماده استقرار است.

### گام 2: انتقال فایل‌ها به سرور

فایل‌های موجود در `dist/` را به سرور خود منتقل کنید.

### گام 3: ایجاد پوشه config (در صورت عدم وجود)

در ریشه پروژه (کنار پوشه `dist/`):

```bash
mkdir config
```

**نکته مهم:** پوشه `config/` باید **خارج** از پوشه `dist/` باشد، نه درون آن.

ساختار پوشه‌ها:

```
project-root/
├── dist/                          # خروجی build
│   ├── assets/
│   ├── config/
│   │   └── settings.default.json  # تنظیمات پیش‌فرض (همراه با build)
│   └── index.html
├── config/                        # تنظیمات سرور (خارج از build)
│   └── settings.json              # تنظیمات سفارشی (اختیاری)
```

### گام 4: ایجاد فایل تنظیمات سفارشی (اختیاری)

اگر می‌خواهید تنظیمات سرور را سفارشی‌سازی کنید:

```bash
# کپی کردن تنظیمات پیش‌فرض
cp dist/config/settings.default.json config/settings.json

# ویرایش تنظیمات
nano config/settings.json
# یا
vim config/settings.json
```

## تنظیمات قابل سفارشی‌سازی

### 1. تنظیمات گالری (Gallery Settings)

```json
{
  "gallery": {
    "targetRowHeight": 200,        // ارتفاع ردیف‌ها (100-500 پیکسل)
    "boxSpacing": 5,               // فاصله بین تصاویر (0-50 پیکسل)
    "containerPadding": 0,         // padding کانتینر (0-100 پیکسل)
    "debounceDelay": 200,          // تاخیر resize (0-1000 میلی‌ثانیه)
    "enableLightbox": true,        // فعال/غیرفعال lightbox
    "plugins": [                   // افزونه‌های فعال
      "zoom",
      "thumbnail",
      "fullscreen",
      "autoplay",
      "video",
      "rotate",
      "share"
    ]
  }
}
```

### 2. تنظیمات پخش‌کننده رسانه (Media Player Settings)

```json
{
  "mediaPlayer": {
    "controls": [                  // دکمه‌های نمایش داده شده
      "play-large",
      "play",
      "progress",
      "current-time",
      "mute",
      "volume",
      "settings",
      "fullscreen"
    ],
    "autoplay": false,             // پخش خودکار
    "volume": 0.8,                 // حجم پیش‌فرض (0.0-1.0)
    "settings": ["speed", "quality"],
    "speed": {
      "selected": 1,               // سرعت پیش‌فرض
      "options": [0.5, 0.75, 1, 1.25, 1.5, 2]
    }
  }
}
```

### 3. تنظیمات LightGallery

```json
{
  "lightGallery": {
    "download": false,             // دکمه دانلود
    "counter": false,              // شمارنده تصاویر
    "enableDrag": false,           // کشیدن تصویر
    "enableSwipe": false           // سوایپ موبایل
  }
}
```

### 4. تنظیمات اشتراک‌گذاری اجتماعی (Social Share)

```json
{
  "socialShare": {
    "enabled": true,               // فعال/غیرفعال کل بخش
    "platforms": {
      "facebook": {
        "enabled": true,           // فعال/غیرفعال فیس‌بوک
        "id": "shareto-facebook",
        "url": "https://www.facebook.com/sharer/sharer.php?u={url}",
        "icon": "esprit-fi-brands-facebook"
      },
      "telegram": {
        "enabled": true,
        "id": "shareto-telegram",
        "url": "https://t.me/share/url?url={url}&text={text}",
        "icon": "esprit-fi-brands-telegram"
      }
      // سایر پلتفرم‌ها...
    }
  }
}
```

### 5. تنظیمات حالت خواندن (Reading Mode)

```json
{
  "readingMode": {
    "backgroundThemes": {
      "light": {
        "color": "#1f1f1fff",
        "backgroundColor": "#ffffffff"
      },
      "dark": {
        "color": "#e3e3e3ff",
        "backgroundColor": "#202124ff"
      },
      "yellow": {
        "color": "#1f1f1fff",
        "backgroundColor": "#feefc3ff"
      },
      "blue": {
        "color": "#1f1f1fff",
        "backgroundColor": "#d2e3fcff"
      }
    },
    "defaultTheme": "yellow"
  }
}
```

## امنیت

### اقدامات امنیتی پیاده‌سازی شده:

1. **Validation دقیق:** تمام مقادیر بررسی و sanitize می‌شوند
2. **محدودیت اندازه:** فایل تنظیمات حداکثر 5MB
3. **Type Checking:** تایپ تمام فیلدها بررسی می‌شود
4. **URL Validation:** URLها فقط با پروتکل‌های مجاز (https, http, mailto) قبول می‌شوند
5. **Whitelist:** فقط تنظیمات مجاز پذیرفته می‌شوند
6. **محدودیت مقادیر:** مقادیر عددی محدوده معتبر دارند
7. **Array Filtering:** آرایه‌ها فقط مقادیر مجاز را نگه می‌دارند
8. **Color Validation:** رنگ‌ها باید فرمت hex معتبر داشته باشند

### توصیه‌های امنیتی:

```bash
# محدود کردن دسترسی به فایل تنظیمات
chmod 640 config/settings.json
chown root:www-data config/settings.json

# جلوگیری از دسترسی مستقیم در nginx
location /config/ {
    deny all;
    return 404;
}

# جلوگیری از دسترسی مستقیم در Apache
<Directory "/path/to/project/config">
    Require all denied
</Directory>
```

**هشدار:** URL های اشتراک‌گذاری اجتماعی را با دقت بررسی کنید و از منابع معتبر استفاده کنید.

## مانیتورینگ و عیب‌یابی

### بررسی لاگ‌ها

برنامه پیام‌های مفیدی در console مرورگر چاپ می‌کند:

```javascript
// تنظیمات سفارشی بارگذاری شد
[Settings] Loading custom settings from config/settings.json
[Settings] Settings loaded successfully (custom)

// تنظیمات پیش‌فرض بارگذاری شد
[Settings] Loading default settings from config/settings.default.json
[Settings] Settings loaded successfully (default)

// خطا در بارگذاری
[Settings] Failed to load settings from file: [خطا]
[Settings] Using built-in default settings
```

### مشکلات رایج:

#### 1. فایل تنظیمات پیدا نمی‌شود (404)

**علت:** پوشه `config/` در مسیر صحیح قرار ندارد یا web server به آن دسترسی ندارد.

**راه‌حل:**
- اطمینان حاصل کنید `config/` در ریشه پروژه است (کنار `dist/`)
- مجوزهای پوشه را بررسی کنید: `chmod 755 config/`
- پیکربندی web server را بررسی کنید

#### 2. تنظیمات اعمال نمی‌شوند

**علت:** فایل JSON معتبر نیست یا validation شکست خورده است.

**راه‌حل:**
- فرمت JSON را با ابزارهای آنلاین بررسی کنید: https://jsonlint.com
- لاگ‌های console را بررسی کنید
- مطمئن شوید تمام مقادیر در محدوده معتبر هستند

#### 3. برخی تنظیمات اعمال نمی‌شوند

**علت:** تنظیمات از validation عبور نکرده‌اند.

**راه‌حل:**
- بررسی کنید که مقادیر در محدوده مجاز هستند
- تایپ‌های داده (string, number, boolean) را بررسی کنید
- plugin ها و controlها باید از لیست مجاز باشند

## به‌روزرسانی برنامه

هنگام به‌روزرسانی برنامه:

```bash
# 1. Backup تنظیمات فعلی
cp config/settings.json config/settings.json.backup

# 2. Build جدید
npm run build

# 3. تنظیمات سفارشی حفظ می‌شوند (در gitignore)
# فایل config/settings.json دست نخورده باقی می‌ماند

# 4. بررسی تنظیمات جدید در settings.default.json
# در صورت وجود تنظیمات جدید، به config/settings.json اضافه کنید
```

**نکته مهم:** پس از هر به‌روزرسانی، `settings.default.json` را بررسی کنید و تنظیمات جدید را (در صورت وجود) به `config/settings.json` خود اضافه کنید.

## پشتیبانی و سوالات

در صورت بروز مشکل:

1. لاگ‌های Console مرورگر را بررسی کنید
2. فایل `settings.json` را از لحاظ فرمت بررسی کنید
3. مجوزهای فایل و پوشه را بررسی کنید
4. با تیم توسعه تماس بگیرید

## منابع

- مستندات پروژه: [README.md](README.md)
- راهنمای توسعه‌دهنده: [CLAUDE.md](CLAUDE.md)
- مخزن پروژه: [GitHub Repository]

---

**نسخه:** 1.0.0
**آخرین به‌روزرسانی:** 2025-10-28
