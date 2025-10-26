# 📚 راهنمای توسعه پروژه نیافام

## 🎯 معماری پروژه

این پروژه یک **Vite Multi-Page Application** است که:
- هر ماژول (news, settings, auth, etc.) یک صفحه HTML جداگانه دارد
- کدهای مشترک (i18n, modal, gallery, etc.) به صورت خودکار بین صفحات share می‌شوند
- در production، Vite فقط CSS/JS لازم هر صفحه را bundle می‌کند
- از Tree Shaking و Code Splitting استفاده می‌شود

## 📁 ساختار پروژه

```
project/
├── index.html              # صفحه اخبار (News Module)
├── settings.html           # (آینده) صفحه تنظیمات
├── auth.html               # (آینده) صفحه ورود/ثبت‌نام
├── vite.config.js          # تنظیمات Vite
├── package.json
│
├── src/                    # کدهای source
│   ├── main.js             # Entry point اصلی
│   ├── config/             # تنظیمات (i18n, constants, settings)
│   ├── features/           # ویژگی‌ها (gallery, modal, PDF, etc.)
│   ├── utils/              # ابزارهای کمکی
│   ├── locales/            # فایل‌های ترجمه (fa, en, ar, tr, ru)
│   └── assets/
│       └── scss/           # SCSS files
│
└── packages/               # (قدیمی - برای reference)
    └── ...                 # نادیده بگیرید
```

## 🚀 دستورات Development

### نصب وابستگی‌ها
```bash
npm install
```

### اجرا در حالت Development
```bash
npm run dev
```
- سرور روی `http://localhost:5173` اجرا می‌شود
- Hot Module Replacement (HMR) فعال است - تغییرات بلافاصله اعمال می‌شوند
- SCSS خودکار compile می‌شود

### Build برای Production
```bash
npm run build
```
- فایل‌های نهایی در `dist/` قرار می‌گیرند
- فقط CSS/JS لازم هر صفحه bundle می‌شود
- فایل‌ها minify و optimize می‌شوند

### Preview Build
```bash
npm run preview
```
- Build شده را در محیط production-like تست کنید

## 📝 نحوه افزودن ماژول جدید

### مثال: اضافه کردن ماژول Settings

#### 1. ایجاد فایل HTML
```bash
# ایجاد settings.html در root
cp index.html settings.html
```

#### 2. ویرایش settings.html
```html
<!DOCTYPE html>
<html lang="fa" dir="rtl">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>نیافام - تنظیمات</title>

    <!-- Import SCSS -->
    <link rel="stylesheet" href="/src/assets/scss/main.scss" />

    <script src="/assets/js/jquery.js"></script>
</head>
<body>
    <!-- محتوای صفحه settings -->

    <!-- Import JavaScript -->
    <script type="module" src="/src/settings.js"></script>
</body>
</html>
```

#### 3. ایجاد src/settings.js
```javascript
// src/settings.js
import { initI18n, localizeDOM } from './config/i18n.js';
import { initModal } from './features/modal.js';

async function initApp() {
  // Initialize i18n first
  await initI18n();
  localizeDOM();

  // Initialize features specific to settings
  initModal();

  // Settings-specific code here...
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}
```

#### 4. بروزرسانی vite.config.js
```javascript
export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        news: resolve(__dirname, 'index.html'),
        settings: resolve(__dirname, 'settings.html'),  // اضافه کردن
        // auth: resolve(__dirname, 'auth.html'),
      },
      // ...
    }
  }
});
```

#### 5. تست
```bash
npm run dev
# برو به: http://localhost:5173/settings.html
```

## 🔧 نحوه استفاده از Features

### i18n (چندزبانه)
```javascript
import { initI18n, getTranslation, changeLanguage } from './config/i18n.js';

// Initialize (فقط یک بار در شروع)
await initI18n();

// استفاده
const text = getTranslation('key.path');

// تغییر زبان
changeLanguage('en');
```

### Modal
```javascript
import { initModal } from './features/modal.js';

initModal();
```

### Gallery
```javascript
import { initGallery } from './features/gallery.js';

// با تنظیمات پیش‌فرض
initGallery();

// یا با سلکتورهای سفارشی
initGallery('.my-gallery-container', '.my-gallery-item');
```

### Media Player (Video/Audio/TTS)
```javascript
import {
  initVideoPlayer,
  initAudioPlayer,
  initTts
} from './features/mediaPlayer.js';

initVideoPlayer();
initAudioPlayer();
initTts();
```

### PDF Generator (فقط برای News)
```javascript
import { initPdfGenerator } from './features/pdfGenerator.js';

initPdfGenerator();
```

### Accessibility Controls (فقط برای News)
```javascript
import { initAccessibilityActions } from './features/accessibilityControls.js';

initAccessibilityActions();
```

## 📦 ساختار Build Output

بعد از `npm run build`:

```
dist/
├── index.html                          # صفحه news
├── settings.html                       # صفحه settings (if exists)
├── assets/
│   ├── news/
│   │   ├── news-[hash].js             # JS مخصوص news
│   │   └── news-[hash].css            # CSS مخصوص news
│   ├── settings/
│   │   ├── settings-[hash].js         # JS مخصوص settings
│   │   └── settings-[hash].css        # CSS مخصوص settings
│   └── shared/
│       └── shared-[hash].js           # کدهای مشترک
```

## 🎨 نحوه کار با SCSS

### ساختار SCSS
```
src/assets/scss/
├── main.scss                 # Entry point اصلی
├── _variables.scss           # متغیرها
├── _colors.scss              # رنگ‌ها
├── _mixins.scss              # Mixins
├── _reset.scss               # CSS Reset
├── breakpoints.scss          # Breakpoints
├── _globals.scss             # Global styles
└── components/
    ├── _modal.scss
    ├── _form.scss
    ├── _gallery.scss
    ├── _article.scss         # News-specific
    └── ...
```

### افزودن Style جدید
```scss
// src/assets/scss/components/_my-component.scss
.my-component {
  // styles here
}
```

سپس در `main.scss`:
```scss
@use 'components/my-component';
```

## 🐛 رفع مشکلات رایج

### 1. خطای "Cannot find module"
```bash
# مطمئن شوید node_modules نصب شده
npm install
```

### 2. SCSS Compile نمی‌شود
```bash
# Install sass
npm install -D sass
```

### 3. تغییرات اعمال نمی‌شوند
- Hard refresh کنید: `Ctrl + Shift + R`
- یا سرور را restart کنید

### 4. Build خطا می‌دهد
```bash
# پاک کردن cache
rm -rf node_modules/.vite
npm run build
```

## ✅ بهترین شیوه‌ها (Best Practices)

### 1. ترتیب Initialization
همیشه **i18n را اول** initialize کنید:
```javascript
// ✅ درست
await initI18n();
localizeDOM();
initGallery();
initModal();

// ❌ غلط
initGallery();  // قبل از i18n
await initI18n();
```

### 2. Code Splitting
برای features بزرگ، از dynamic import استفاده کنید:
```javascript
// فقط وقتی نیاز است load می‌شود
const button = document.querySelector('#load-pdf');
button.addEventListener('click', async () => {
  const { initPdfGenerator } = await import('./features/pdfGenerator.js');
  initPdfGenerator();
});
```

### 3. نام‌گذاری فایل‌ها
- Components: `camelCase.js` (مثل `modal.js`, `mediaPlayer.js`)
- Constants: `UPPER_SNAKE_CASE`
- CSS Classes: `kebab-case` یا `BEM`

### 4. استفاده از data-i18n
برای ترجمه خودکار:
```html
<!-- محتوای text -->
<h1 data-i18n="page.title">عنوان</h1>

<!-- Attribute ها -->
<input data-i18n="[placeholder]form.search" />

<!-- HTML content -->
<div data-i18n="[html]page.content"></div>
```

## 📊 Performance Tips

### 1. Lazy Loading Images
```html
<img loading="lazy" src="..." alt="..." />
```

### 2. Preload Critical Resources
```html
<link rel="preload" href="/assets/fonts/Dana.woff2" as="font" crossorigin />
```

### 3. Code Splitting
Vite خودکار code splitting انجام می‌دهد، اما می‌توانید manual chunks تعریف کنید:
```javascript
// vite.config.js
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor': ['jquery', 'plyr'],
          'i18n': ['i18next'],
        }
      }
    }
  }
});
```

## 🔐 نکات امنیتی

1. **همیشه input ها را sanitize کنید**
2. **از CSP headers استفاده کنید**
3. **Secrets را commit نکنید** (استفاده از `.env`)
4. **Dependencies را به‌روز نگه دارید**: `npm audit`

## 📚 منابع مفید

- [Vite Documentation](https://vitejs.dev/)
- [Sass Documentation](https://sass-lang.com/)
- [i18next Documentation](https://www.i18next.com/)

## 🤝 مشارکت

1. Branch جدید بسازید: `git checkout -b feature/my-feature`
2. تغییرات را commit کنید: `git commit -m "Add feature"`
3. Push کنید: `git push origin feature/my-feature`
4. Pull Request بسازید

---

✨ **موفق باشید!**
