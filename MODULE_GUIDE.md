# راهنمای توسعه ماژول‌های Niafam

راهنمای جامع برای ایجاد ماژول‌های جدید در پروژه Niafam Module Settings

---

## 📋 فهرست مطالب

### بخش اول: راهنمای ایجاد ماژول جدید
1. [نمای کلی پروژه](#-نمای-کلی-پروژه)
2. [ساختار ماژول‌ها](#-ساختار-ماژولها)
3. [Checklist ایجاد ماژول جدید](#-checklist-ایجاد-ماژول-جدید)
4. [مراحل گام‌به‌گام](#-مراحل-گامبهگام-ایجاد-ماژول)
5. [کتابخانه‌های مشترک](#-کتابخانههای-مشترک)
6. [کامپوننت‌های عمومی](#-کامپوننتهای-عمومی-قابل-استفاده-مجدد)
7. [سیستم i18n و چندزبانگی](#-سیستم-i18n-و-چندزبانگی)
8. [مثال کامل: ایجاد ماژول Settings](#-مثال-کامل-ایجاد-ماژول-settings)

### بخش دوم: راهنمای استایل و طراحی
9. [سیستم رنگ‌ها](#-سیستم-رنگها)
10. [تایپوگرافی](#️-تایپوگرافی)
11. [سیستم فاصله‌گذاری](#-سیستم-فاصلهگذاری)
12. [Border Radius](#-border-radius)
13. [Breakpoints](#-breakpoints)
14. [Mixins در دسترس](#️-mixins-در-دسترس)
15. [ساختار کامپوننت‌ها](#-ساختار-کامپوننتها-scss)
16. [قراردادهای نام‌گذاری](#️-قراردادهای-نامگذاری)
17. [کامپوننت‌های رایج UI](#-کامپوننتهای-رایج-ui)
18. [پشتیبانی RTL/LTR](#-پشتیبانی-rtlltr)

---

# بخش اول: راهنمای ایجاد ماژول جدید

## 🎯 نمای کلی پروژه

این پروژه یک سیستم ماژولار مبتنی بر **Vite** است که ماژول‌های مختلف را برای پلتفرم Niafam فراهم می‌کند.

### ماژول‌های موجود:
- **Contents** (index.html) - ماژول نمایش مقالات و اخبار
- **Ticketing** (ticket-tracking.html) - سیستم تیکتینگ و پیگیری تیکت
- **Profile** (profile-dashboard.html, profile-view.html, profile-edit.html) - مدیریت پروفایل کاربری
- **About** (about.html) - صفحه درباره ما

### تکنولوژی‌های اصلی:
- **Vite**: Build tool و dev server
- **SCSS**: Pre-processor برای CSS
- **ES Modules**: سیستم ماژولار JavaScript
- **i18next**: چندزبانگی (FA, EN, AR, TR, RU)

---

## 📁 ساختار ماژول‌ها

هر ماژول شامل سه بخش اصلی است:

### 1. فایل HTML (در ریشه پروژه)
```
module-name.html          # فایل اصلی HTML ماژول
```

### 2. فایل‌های JavaScript
```
src/
  ├── module-name-main.js           # Entry point اصلی ماژول
  └── features/
      └── module-name/
          ├── feature1.js           # ویژگی‌های ماژول
          └── feature2.js
```

### 3. فایل‌های SCSS
```
src/assets/scss/
  ├── module-name.scss              # Entry point اصلی SCSS
  └── module-name/
      ├── _component1.scss          # کامپوننت‌های ماژول
      └── _component2.scss
```

### ساختار کامل یک ماژول نمونه:

```
niafam-module-settings/
├── my-module.html                           # HTML page
├── src/
│   ├── my-module-main.js                    # JS entry point
│   ├── features/
│   │   └── my-module/
│   │       ├── feature1.js
│   │       └── feature2.js
│   └── assets/scss/
│       ├── my-module.scss                   # SCSS entry point
│       └── my-module/
│           ├── _component1.scss
│           └── _component2.scss
└── public/assets/css/
    └── my-module.css                        # Compiled CSS (generated)
```

---

## ✅ Checklist ایجاد ماژول جدید

### قبل از شروع:
- [ ] نام ماژول را مشخص کنید (مثال: `settings`)
- [ ] ویژگی‌های مورد نیاز را لیست کنید
- [ ] بررسی کنید کدام کامپوننت‌های عمومی قابل استفاده مجدد هستند

### فایل‌های HTML:
- [ ] ایجاد `module-name.html` در ریشه پروژه
- [ ] اضافه کردن font-face definitions در `<head>`
- [ ] Link کردن `reset.css` و CSS ماژول
- [ ] اضافه کردن `<script type="module" src="/src/module-name-main.js"></script>`
- [ ] استفاده از `data-i18n` برای متن‌های قابل ترجمه
- [ ] استفاده از کلاس‌های استاندارد (با پیشوند مناسب)

### فایل‌های JavaScript:
- [ ] ایجاد `src/module-name-main.js`
- [ ] Import کردن `loadSettingsFromFile` و اجرای آن اول
- [ ] Import کردن `initI18n` و `initLocalization` و اجرای آن دوم
- [ ] ایجاد فولدر `src/features/module-name/`
- [ ] پیاده‌سازی ویژگی‌های ماژول در فایل‌های جداگانه
- [ ] رعایت initialization order

### فایل‌های SCSS:
- [ ] ایجاد `src/assets/scss/module-name.scss`
- [ ] Import کردن base styles از `common/base/`
- [ ] Import کردن کامپوننت‌های مورد نیاز از `common/components/`
- [ ] ایجاد فولدر `src/assets/scss/module-name/`
- [ ] استفاده از متغیرها و mixins
- [ ] رعایت BEM naming convention
- [ ] پشتیبانی RTL/LTR
- [ ] Responsive design

### تنظیمات Build:
- [ ] اضافه کردن entry point به `vite.config.js`
- [ ] اضافه کردن sass script به `package.json`
- [ ] تست `npm run dev`
- [ ] تست `npm run build`

### i18n (چندزبانگی):
- [ ] اضافه کردن کلیدهای ترجمه به تمام فایل‌های `src/locales/*.json`
- [ ] استفاده از `data-i18n` در HTML
- [ ] تست تغییر زبان

### مستندات:
- [ ] به‌روزرسانی این فایل (MODULE_GUIDE.md) در صورت نیاز
- [ ] مستندسازی کامپوننت‌های جدید

---

## 🚀 مراحل گام‌به‌گام ایجاد ماژول

### مرحله 1: ایجاد فایل HTML

در ریشه پروژه، فایل `module-name.html` را بسازید:

```html
<!DOCTYPE html>
<html lang="fa" dir="rtl">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Module Name - Niafam</title>
    <link rel="icon" href="/assets/img/niafam-favicon.png" type="image/x-icon" />
    <link rel="stylesheet" href="/assets/css/reset.css" />

    <script src="/assets/js/jquery.js"></script>

    <style>
      @font-face {
        font-family: "niafam";
        src: url("/assets/fonts/niafam.woff?ahg0bg");
        font-weight: normal;
        font-style: normal;
        font-display: block;
      }

      @font-face {
        font-family: dana;
        src: url("/assets/fonts/DanaFaNum-Regular.woff");
        font-weight: normal;
        font-display: swap;
      }

      @font-face {
        font-family: dana;
        src: url("/assets/fonts/DanaFaNum-Bold.woff");
        font-weight: bold;
        font-display: swap;
      }

      @font-face {
        font-family: dana;
        src: url("/assets/fonts/DanaFaNum-DemiBold.woff");
        font-weight: 600;
        font-display: swap;
      }

      /* en font */
      @font-face {
        font-family: Roboto;
        src: url("/assets/fonts/Roboto-Regular.woff");
        font-weight: normal;
        font-display: swap;
      }

      @font-face {
        font-family: Roboto;
        src: url("/assets/fonts/Roboto-Bold.woff");
        font-weight: bold;
        font-display: swap;
      }

      body {
        font-size: 16px;
        font-family: dana;
      }

      body[dir="ltr"] {
        font-family: Roboto;
      }
    </style>
  </head>
  <body>
    <!-- محتوای ماژول -->
    <div class="module-name-container">
      <h1 data-i18n="moduleName.title">عنوان ماژول</h1>
    </div>

    <script type="module" src="/src/module-name-main.js"></script>
  </body>
</html>
```

**⚠️ نکات مهم:**
- ❌ **هرگز font-family را در SCSS تعریف نکنید**
- ✅ Font definitions فقط در `<head>` HTML
- ✅ `<script type="module">` برای ES modules
- ✅ استفاده از `data-i18n` برای متن‌های قابل ترجمه

---

### مرحله 2: ایجاد JavaScript Entry Point

فایل `src/module-name-main.js` را بسازید:

```javascript
import { initI18n } from "./config/i18n";
import { initLocalization } from "./utils/i18n-localizer";
import { loadSettingsFromFile } from "./config/settings";
import { initModuleFeature1 } from "./features/module-name/feature1";
import { initModuleFeature2 } from "./features/module-name/feature2";
import "./assets/scss/module-name.scss";

/**
 * Initialize module application features
 */
async function initializeModuleApp() {
  try {
    // CRITICAL: Load settings from file FIRST (before i18n)
    await loadSettingsFromFile();

    // CRITICAL: Initialize i18n SECOND
    await initI18n();
    initLocalization();

    // Initialize module-specific features
    initModuleFeature1();
    initModuleFeature2();

    console.log("Module application initialized successfully");
  } catch (error) {
    console.error("Failed to initialize module application:", error);
  }
}

// Start initialization when DOM is ready
document.addEventListener("DOMContentLoaded", initializeModuleApp);
```

**⚠️ Initialization Order (بسیار مهم):**

```
1. loadSettingsFromFile()     ← اول (بارگذاری تنظیمات)
2. initI18n()                 ← دوم (راه‌اندازی چندزبانگی)
3. initLocalization()         ← سوم (فعال‌سازی ترجمه DOM)
4. ویژگی‌های ماژول            ← چهارم (بقیه features)
```

نقض این ترتیب باعث خطا می‌شود!

---

### مرحله 3: ایجاد ویژگی‌های ماژول

فایل‌های feature را در `src/features/module-name/` بسازید:

**مثال: `src/features/module-name/feature1.js`**

```javascript
/**
 * Feature 1 for Module
 */
export function initModuleFeature1() {
  const element = document.getElementById("feature1-element");

  if (!element) {
    console.warn("Feature 1 element not found");
    return;
  }

  // پیاده‌سازی ویژگی
  element.addEventListener("click", () => {
    console.log("Feature 1 clicked");
  });
}
```

**نکات:**
- ✅ همیشه وجود element را چک کنید
- ✅ از named export استفاده کنید
- ✅ JSDoc comment اضافه کنید
- ✅ Error handling مناسب

---

### مرحله 4: ایجاد SCSS Entry Point

فایل `src/assets/scss/module-name.scss` را بسازید:

```scss
/**
 * Module Name Styles
 * Main SCSS file for module-name module
 */

// Import common base styles
@use './common/base/variables' as *;
@use './common/base/mixins';
@use './common/base/colors' as *;
@use './common/esfonticon/style';
@use './common/components/form';
@use './common/components/section-title';

// Import module-specific styles
@use './module-name/component1';
@use './module-name/component2';
```

**نکات:**
- ✅ همیشه از `@use` استفاده کنید (نه `@import`)
- ✅ ابتدا common styles را import کنید
- ✅ سپس module-specific styles

---

### مرحله 5: ایجاد کامپوننت‌های SCSS

فایل‌های کامپوننت را در `src/assets/scss/module-name/` بسازید:

**مثال: `src/assets/scss/module-name/_component1.scss`**

```scss
/**
 * Component 1
 * Description of component
 */
@use '../common/base/globals' as *;

.module-name-component1 {
  padding: $spacing-4;
  background: #fff;
  border-radius: $radius-lg;
  border: 1px solid $gray-200;

  &__header {
    font-size: 1.25em;
    font-weight: $text-semi-bold;
    color: $blue-gray-600;
    margin-bottom: $spacing-3;
  }

  &__content {
    color: $gray-700;
    line-height: 1.6;
  }

  // Modifier
  &--featured {
    border-color: $blue-gray-600;
  }
}

// Responsive
@media (max-width: 768px) {
  .module-name-component1 {
    padding: $spacing-3;
  }
}
```

**نکات مهم:**
- ✅ از متغیرها استفاده کنید (`$spacing-4`, `$radius-lg`)
- ✅ BEM naming: `block__element--modifier`
- ✅ پیشوند مناسب برای جلوگیری از تداخل
- ✅ Responsive design
- ✅ RTL/LTR support

---

### مرحله 6: تنظیمات Vite

فایل `vite.config.js` را ویرایش کنید:

```javascript
export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        contents: resolve(__dirname, 'index.html'),
        about: resolve(__dirname, 'about.html'),
        ticketTracking: resolve(__dirname, 'ticket-tracking.html'),
        profileDashboard: resolve(__dirname, 'profile-dashboard.html'),
        profileView: resolve(__dirname, 'profile-view.html'),
        profileEdit: resolve(__dirname, 'profile-edit.html'),

        // 👇 ماژول جدید را اضافه کنید
        moduleName: resolve(__dirname, 'module-name.html'),
      },
      // ... بقیه تنظیمات
    }
  }
});
```

---

### مرحله 7: تنظیمات SCSS Build

فایل `package.json` را ویرایش کنید:

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "sass": "sass src/assets/scss/contents.scss public/assets/css/espritstyle.css --watch",
    "sass:about": "sass src/assets/scss/about.scss public/assets/css/about.css --watch",
    "sass:module": "sass src/assets/scss/module-name.scss public/assets/css/module-name.css --watch"
  }
}
```

**برای compile کردن SCSS:**
```bash
npm run sass:module
```

---

### مرحله 8: اضافه کردن ترجمه‌ها (i18n)

برای هر زبان در `src/locales/*.json` کلیدهای ترجمه اضافه کنید:

**`src/locales/fa.json`:**
```json
{
  "moduleName": {
    "title": "عنوان ماژول",
    "description": "توضیحات ماژول"
  }
}
```

**`src/locales/en.json`:**
```json
{
  "moduleName": {
    "title": "Module Title",
    "description": "Module Description"
  }
}
```

---

### مرحله 9: تست و اجرا

```bash
# Development
npm run dev
npm run sass:module   # در ترمینال جداگانه

# Production Build
npm run build
```

بروید به: `http://localhost:5173/module-name.html`

---

## 📚 کتابخانه‌های مشترک

این کتابخانه‌ها در تمام ماژول‌ها قابل استفاده هستند:

### 1. i18next
چندزبانگی (FA, EN, AR, TR, RU)

```javascript
import i18next from 'i18next';

// استفاده
const text = i18next.t('key.path');
```

### 2. MicroModal
مدیریت Modal ها

```javascript
import { initModal } from './features/common/modal';

initModal();
```

### 3. lightGallery
نمایش تصاویر و ویدیوها

```javascript
import { initGallery } from './features/common/gallery';

initGallery();
```

### 4. Plyr
پخش‌کننده صوت و تصویر

```javascript
import { initVideoPlayer, initAudioPlayer } from './features/common/mediaPlayer';

initVideoPlayer();
initAudioPlayer();
```

### 5. noUiSlider
اسلایدرهای دسترسی‌پذیری

```javascript
import noUiSlider from 'nouislider';
```

### 6. jsPDF
تولید فایل PDF

```javascript
import { jsPDF } from 'jspdf';
```

### 7. jQuery
در دسترس به صورت global (`$` یا `jQuery`)

```javascript
// jQuery از قبل بارگذاری شده است
$('#element').on('click', function() {
  // ...
});
```

---

## 🎁 کامپوننت‌های عمومی قابل استفاده مجدد

### JavaScript Components

#### 1. Toast Notifications
**مسیر:** `src/features/common/toast.js`

```javascript
import { showToast } from './features/common/toast';

showToast('پیام شما', 'success'); // success, error, warning, info
```

#### 2. Modal
**مسیر:** `src/features/common/modal.js`

```javascript
import { initModal } from './features/common/modal';

initModal();
```

#### 3. Gallery
**مسیر:** `src/features/common/gallery.js`

```javascript
import { initGallery } from './features/common/gallery';

initGallery();
```

#### 4. Media Player
**مسیر:** `src/features/common/mediaPlayer.js`

```javascript
import { initVideoPlayer, initAudioPlayer, initTts } from './features/common/mediaPlayer';
```

#### 5. Copy Short URL
**مسیر:** `src/features/common/copyShortUrl.js`

```javascript
import { initCopyShortUrl } from './features/common/copyShortUrl';

initCopyShortUrl();
```

---

### SCSS Components

#### 1. Form Components
**مسیر:** `src/assets/scss/common/components/_form.scss`

**کلاس‌های در دسترس:**
- `.nes-form` - Container فرم
- `.nes-form-group` - گروه فرم
- `.nes-form-row` - ردیف فرم
- `.nes-input` - Input field
- `.nes-textarea` - Textarea
- `.nes-btn` - دکمه
- `.nes-btn-primary` - دکمه اصلی
- `.nes-btn-success` - دکمه موفقیت
- `.nes-btn-danger` - دکمه خطر
- `.nes-btn-icon` - دکمه آیکون
- `.nes-captcha-group` - گروه Captcha

**استفاده:**
```html
<form class="nes-form">
  <div class="nes-form-group">
    <label class="nes-label">نام:</label>
    <input type="text" class="nes-input">
  </div>

  <button type="submit" class="nes-btn nes-btn-primary">ذخیره</button>
</form>
```

#### 2. Section Title
**مسیر:** `src/assets/scss/common/components/_section-title.scss`

```html
<h2 class="nes-section-title">عنوان بخش</h2>
```

#### 3. Modal
**مسیر:** `src/assets/scss/common/components/_modal.scss`

```html
<div class="modal micromodal-slide" id="modal-1" aria-hidden="true">
  <div class="modal__overlay" tabindex="-1" data-micromodal-close>
    <div class="modal__container" role="dialog" aria-modal="true">
      <!-- محتوا -->
    </div>
  </div>
</div>
```

#### 4. Toast Notifications
**مسیر:** `src/assets/scss/common/components/_toast.scss`

```html
<div class="nes-toast nes-toast--success">
  <span>عملیات موفق بود!</span>
</div>
```

#### 5. Gallery
**مسیر:** `src/assets/scss/common/components/_gallery.scss`

استایل‌های lightGallery

---

### Base Styles (همیشه در دسترس)

#### Colors
**مسیر:** `src/assets/scss/common/base/_colors.scss`

متغیرهای رنگ:
- `$blue-gray-600` - رنگ اصلی
- `$gray-700` - متن
- `$error` - خطا
- `$success` - موفقیت

#### Variables
**مسیر:** `src/assets/scss/common/base/_variables.scss`

متغیرهای spacing, radius, font:
- `$spacing-4` - فاصله
- `$radius-lg` - گوشه گرد
- `$text-semi-bold` - وزن فونت

#### Mixins
**مسیر:** `src/assets/scss/common/base/_mixins.scss`

- `@include iconButton` - دکمه آیکون
- `@include sideBox` - کارت کناری
- `@include lineClamp(2)` - محدود کردن خطوط
- `@include respond-to(sm)` - Responsive

---

## 🌐 سیستم i18n و چندزبانگی

### زبان‌های پشتیبانی شده:
- FA (فارسی) - پیش‌فرض
- EN (انگلیسی)
- AR (عربی)
- TR (ترکی)
- RU (روسی)

### مراحل اضافه کردن ترجمه:

#### 1. اضافه کردن کلید ترجمه به فایل‌های JSON

برای **تمام** زبان‌ها در `src/locales/`:

**`src/locales/fa.json`:**
```json
{
  "myModule": {
    "title": "عنوان ماژول",
    "button": "ذخیره"
  }
}
```

**`src/locales/en.json`:**
```json
{
  "myModule": {
    "title": "Module Title",
    "button": "Save"
  }
}
```

#### 2. استفاده در HTML با `data-i18n`

```html
<!-- ترجمه text content -->
<h1 data-i18n="myModule.title">عنوان ماژول</h1>

<!-- ترجمه attribute -->
<input type="text" data-i18n="[placeholder]myModule.inputPlaceholder" placeholder="متن پیش‌فرض">

<!-- ترجمه HTML content -->
<div data-i18n="[html]myModule.description">توضیحات</div>
```

#### 3. استفاده در JavaScript

```javascript
import i18next from 'i18next';

// دریافت متن ترجمه
const text = i18next.t('myModule.title');

// تغییر زبان
await i18next.changeLanguage('en');
```

#### 4. تغییر زبان و RTL/LTR

```javascript
import { changeLanguage } from './utils/languageDirections';

// تغییر به انگلیسی (LTR)
await changeLanguage('en');

// تغییر به فارسی (RTL)
await changeLanguage('fa');
```

سیستم به طور خودکار:
- Direction (`<html dir="rtl">` یا `dir="ltr"`) را تغییر می‌دهد
- تمام عناصر با `data-i18n` را به‌روزرسانی می‌کند

---

## 💡 مثال کامل: ایجاد ماژول Settings

بیایید یک ماژول تنظیمات کامل بسازیم:

### 1. فایل HTML: `settings.html`

```html
<!DOCTYPE html>
<html lang="fa" dir="rtl">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title data-i18n="settings.pageTitle">تنظیمات - Niafam</title>
    <link rel="icon" href="/assets/img/niafam-favicon.png" type="image/x-icon" />
    <link rel="stylesheet" href="/assets/css/reset.css" />

    <script src="/assets/js/jquery.js"></script>

    <style>
      @font-face {
        font-family: dana;
        src: url("/assets/fonts/DanaFaNum-Regular.woff");
        font-weight: normal;
        font-display: swap;
      }

      @font-face {
        font-family: dana;
        src: url("/assets/fonts/DanaFaNum-Bold.woff");
        font-weight: bold;
        font-display: swap;
      }

      @font-face {
        font-family: Roboto;
        src: url("/assets/fonts/Roboto-Regular.woff");
        font-weight: normal;
        font-display: swap;
      }

      body {
        font-size: 16px;
        font-family: dana;
      }

      body[dir="ltr"] {
        font-family: Roboto;
      }
    </style>
  </head>
  <body>
    <div class="settings-container">
      <header class="settings-header">
        <h1 class="settings-header__title" data-i18n="settings.title">تنظیمات</h1>
      </header>

      <main class="settings-content">
        <section class="settings-section">
          <h2 class="nes-section-title" data-i18n="settings.general.title">تنظیمات عمومی</h2>

          <form class="nes-form">
            <div class="nes-form-group">
              <label class="nes-label" data-i18n="settings.general.language">زبان:</label>
              <select class="nes-input" id="language-select">
                <option value="fa">فارسی</option>
                <option value="en">English</option>
                <option value="ar">العربية</option>
              </select>
            </div>

            <div class="nes-form-group">
              <label class="nes-label" data-i18n="settings.general.theme">تم:</label>
              <select class="nes-input" id="theme-select">
                <option value="light" data-i18n="settings.general.lightTheme">روشن</option>
                <option value="dark" data-i18n="settings.general.darkTheme">تیره</option>
              </select>
            </div>

            <div class="nes-form-actions">
              <button type="submit" class="nes-btn nes-btn-primary" data-i18n="settings.general.save">ذخیره</button>
            </div>
          </form>
        </section>
      </main>
    </div>

    <script type="module" src="/src/settings-main.js"></script>
  </body>
</html>
```

### 2. JavaScript Entry: `src/settings-main.js`

```javascript
import { initI18n } from "./config/i18n";
import { initLocalization } from "./utils/i18n-localizer";
import { loadSettingsFromFile } from "./config/settings";
import { initSettingsForm } from "./features/settings/settingsForm";
import { initLanguageSelector } from "./features/settings/languageSelector";
import "./assets/scss/settings.scss";

/**
 * Initialize settings application features
 */
async function initializeSettingsApp() {
  try {
    // CRITICAL: Load settings from file FIRST (before i18n)
    await loadSettingsFromFile();

    // CRITICAL: Initialize i18n SECOND
    await initI18n();
    initLocalization();

    // Initialize settings features
    initLanguageSelector();
    initSettingsForm();

    console.log("Settings application initialized successfully");
  } catch (error) {
    console.error("Failed to initialize settings application:", error);
  }
}

// Start initialization when DOM is ready
document.addEventListener("DOMContentLoaded", initializeSettingsApp);
```

### 3. Feature: `src/features/settings/languageSelector.js`

```javascript
import i18next from 'i18next';
import { changeLanguage } from '../../utils/languageDirections';

/**
 * Initialize language selector
 */
export function initLanguageSelector() {
  const languageSelect = document.getElementById('language-select');

  if (!languageSelect) {
    console.warn("Language selector not found");
    return;
  }

  // Set current language
  languageSelect.value = i18next.language || 'fa';

  // Handle language change
  languageSelect.addEventListener('change', async (e) => {
    const newLang = e.target.value;

    try {
      await changeLanguage(newLang);
      console.log(`Language changed to: ${newLang}`);
    } catch (error) {
      console.error('Failed to change language:', error);
    }
  });
}
```

### 4. Feature: `src/features/settings/settingsForm.js`

```javascript
import { showToast } from '../common/toast';

/**
 * Initialize settings form
 */
export function initSettingsForm() {
  const form = document.querySelector('.nes-form');

  if (!form) {
    console.warn("Settings form not found");
    return;
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(form);
    const settings = Object.fromEntries(formData);

    try {
      // ذخیره تنظیمات (مثال)
      localStorage.setItem('userSettings', JSON.stringify(settings));

      showToast('تنظیمات با موفقیت ذخیره شد', 'success');
    } catch (error) {
      console.error('Failed to save settings:', error);
      showToast('خطا در ذخیره تنظیمات', 'error');
    }
  });
}
```

### 5. SCSS Entry: `src/assets/scss/settings.scss`

```scss
/**
 * Settings Module Styles
 */
@use './common/base/variables' as *;
@use './common/base/mixins';
@use './common/base/colors' as *;
@use './common/esfonticon/style';
@use './common/components/form';
@use './common/components/section-title';

@use './settings/container';
@use './settings/header';
@use './settings/content';
```

### 6. Component: `src/assets/scss/settings/_container.scss`

```scss
@use '../common/base/globals' as *;

.settings-container {
  min-height: 100vh;
  background: $gray-50;
  padding: $spacing-5 $spacing-4;
}

@media (max-width: 768px) {
  .settings-container {
    padding: $spacing-3;
  }
}
```

### 7. Component: `src/assets/scss/settings/_header.scss`

```scss
@use '../common/base/globals' as *;

.settings-header {
  max-width: 1200px;
  margin: 0 auto $spacing-5;

  &__title {
    font-size: 1.5em;
    font-weight: $text-bold;
    color: $blue-gray-600;
  }
}

@media (max-width: 768px) {
  .settings-header {
    margin-bottom: $spacing-3;

    &__title {
      font-size: 1.25em;
    }
  }
}
```

### 8. Component: `src/assets/scss/settings/_content.scss`

```scss
@use '../common/base/globals' as *;

.settings-content {
  max-width: 1200px;
  margin: 0 auto;
}

.settings-section {
  background: #fff;
  border-radius: $radius-xl;
  padding: $spacing-5;
  margin-bottom: $spacing-4;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

@media (max-width: 768px) {
  .settings-section {
    padding: $spacing-3;
  }
}
```

### 9. ترجمه‌ها: `src/locales/fa.json`

```json
{
  "settings": {
    "pageTitle": "تنظیمات - Niafam",
    "title": "تنظیمات",
    "general": {
      "title": "تنظیمات عمومی",
      "language": "زبان",
      "theme": "تم",
      "lightTheme": "روشن",
      "darkTheme": "تیره",
      "save": "ذخیره تنظیمات"
    }
  }
}
```

### 10. تنظیمات Vite: `vite.config.js`

```javascript
export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        // ... سایر entry points
        settings: resolve(__dirname, 'settings.html'),
      }
    }
  }
});
```

### 11. تنظیمات SCSS Build: `package.json`

```json
{
  "scripts": {
    "sass:settings": "sass src/assets/scss/settings.scss public/assets/css/settings.css --watch"
  }
}
```

### 12. اجرا

```bash
# Terminal 1: Vite dev server
npm run dev

# Terminal 2: SCSS compiler
npm run sass:settings
```

بروید به: `http://localhost:5173/settings.html`

---

# بخش دوم: راهنمای استایل و طراحی

## 🎨 سیستم رنگ‌ها

### Blue Gray Colors (رنگ‌های اصلی)

```scss
$blue-gray-50: hsla(231, 36%, 98%, 1);   // Background روشن
$blue-gray-100: hsla(231, 36%, 94%, 1);  // Background خیلی روشن
$blue-gray-200: hsla(229, 35%, 88%, 1);  // Border روشن
$blue-gray-300: hsla(231, 36%, 77%, 1);  // Border متوسط
$blue-gray-400: hsla(232, 36%, 59%, 1);  // Text کم‌رنگ
$blue-gray-600: hsla(232, 36%, 38%, 1);  // Primary Color
$blue-gray-700: hsla(231, 36%, 33%, 1);  // Primary Dark
$blue-gray-800: hsla(230, 36%, 25%, 1);  // Text تیره
```

**استفاده:**
- `$blue-gray-600`: دکمه‌های اصلی، آیتم‌های فعال
- `$blue-gray-100`: پس‌زمینه سکشن‌ها
- `$blue-gray-300`: Border عناصر فرم

### Gray Colors (رنگ‌های خنثی)

```scss
$gray-25: hsla(0, 0%, 99%, 1);
$gray-50: hsla(0, 0%, 98%, 1);
$gray-100: hsla(0, 0%, 96%, 1);
$gray-200: hsla(220, 5%, 92%, 1);   // Border پیش‌فرض
$gray-300: hsla(220, 6%, 85%, 1);
$gray-400: hsla(220, 6%, 66%, 1);
$gray-500: hsla(220, 6%, 47%, 1);
$gray-600: hsla(220, 8%, 35%, 1);
$gray-700: hsla(220, 11%, 29%, 1);  // متن اصلی
$gray-900: hsla(220, 24%, 12%, 1);
```

### Status Colors

```scss
$success: #179c52;      // موفقیت (سبز)
$error: #ff3e30;        // خطا (قرمز)
$error-700: hsla(4, 76%, 40%, 1);
```

---

## ✍️ تایپوگرافی

### Font Weights

```scss
$text-regular: 400;
$text-medium: 500;
$text-semi-bold: 600;    // برای عناوین ثانویه
$text-bold: 700;         // برای عناوین اصلی
$text-extra-bold: 800;
$text-black: 900;
```

### Font Sizes

```scss
$text-xs: 0.75em;    // 12px
$text-sm: 0.875em;   // 14px
$text-base: 1em;     // 16px
$text-lg: 1.125em;   // 18px
$text-xl: 1.25em;    // 20px
```

### ⚠️ قوانین مهم Font Family

**نکته بسیار مهم:**
- ❌ **هرگز `font-family` را در فایل‌های SCSS تعریف نکنید**
- ✅ `font-family` فقط برای `<body>` در HTML
- ✅ `@font-face` ها در `<head>` HTML

---

## 📏 سیستم فاصله‌گذاری

```scss
$spacing-sm: 4px;    // فاصله بسیار کم
$spacing-1: 8px;     // فاصله خیلی کم
$spacing-2: 12px;    // فاصله کم
$spacing-3: 16px;    // فاصله متوسط
$spacing-4: 24px;    // فاصله زیاد
$spacing-5: 32px;    // فاصله خیلی زیاد
$spacing-6: 64px;    // فاصله بسیار زیاد
```

**راهنمای استفاده:**

| Use Case | Spacing |
|----------|---------|
| Gap بین آیکون و متن | `$spacing-2` |
| Padding دکمه‌ها | `$spacing-2` یا `$spacing-3` |
| Gap بین عناصر فرم | `$spacing-3` |
| Padding کارت‌ها | `$spacing-4` |
| Margin بین سکشن‌ها | `$spacing-5` |

---

## 🔲 Border Radius

```scss
$radius-none: 0px;
$radius-xs: 2px;
$radius-sm: 4px;
$radius-md: 6px;
$radius-lg: 8px;        // پیش‌فرض
$radius-xl: 12px;       // کارت‌های بزرگ
$radius-2xl: 16px;
$radius-3xl: 24px;
$radius-4xl: 32px;
$radius-full: 9999px;   // دکمه‌های گرد

$radius-default: $radius-lg;
```

---

## 📱 Breakpoints

```scss
$breakpoint-xs: 480px;   // موبایل کوچک
$breakpoint-sm: 768px;   // تبلت عمودی
$breakpoint-md: 1024px;  // تبلت افقی
$breakpoint-lg: 1280px;  // دسکتاپ
$breakpoint-xl: 1536px;  // دسکتاپ بزرگ
```

### استفاده:

```scss
.my-component {
  width: 100%;

  @include respond-to(sm) {
    width: 50%; // در موبایل
  }

  @include respond-to(md) {
    width: 33.33%; // در تبلت
  }
}
```

---

## 🛠️ Mixins در دسترس

### 1. iconButton

```scss
.my-icon-btn {
  @include iconButton;
}
```

### 2. sideBox

```scss
.sidebar-card {
  @include sideBox;
  padding: $spacing-4;
}
```

### 3. lineClamp

```scss
.card-description {
  @include lineClamp(2); // نمایش 2 خط
}
```

### 4. sectionTitle

```scss
.my-section-title {
  @include sectionTitle(32, $blue-gray-600);
}
```

### 5. respond-to

```scss
@include respond-to(sm) {
  // موبایل
}
```

---

## 🧩 ساختار کامپوننت‌ها (SCSS)

### ساختار فایل:

```scss
/**
 * Component Name
 * توضیح مختصر
 */
@use '../common/base/globals' as *;

.component-name {
  // Styles

  &__element {
    // Styles
  }

  &--modifier {
    // Styles
  }
}

// Responsive
@media (max-width: 768px) {
  .component-name {
    // Mobile styles
  }
}
```

---

## 🏷️ قراردادهای نام‌گذاری

### BEM Methodology

**ساختار:** `block__element--modifier`

```scss
// Block
.profile-card { }

// Element
.profile-card__avatar { }
.profile-card__name { }

// Modifier
.profile-card--featured { }
```

### پیشوندها:

| Prefix | استفاده | مثال |
|--------|---------|------|
| `nes-` | کامپوننت‌های عمومی | `nes-btn`, `nes-card` |
| `profile-` | ماژول Profile | `profile-dashboard` |
| `ticket-` | ماژول Ticketing | `ticket-tracking` |

### ⚠️ نام‌های ممنوع (بدون پیشوند):

این نام‌ها با کتابخانه‌های عمومی تداخل دارند:

```scss
// ❌ WRONG
.card { }
.btn { }
.modal { }
.dropdown { }
.nav { }
.form { }

// ✅ CORRECT
.nes-card { }
.nes-btn { }
.nes-modal { }
.profile-dropdown { }
.ticket-nav { }
.nes-form { }
```

---

## 🎁 کامپوننت‌های رایج UI

### 1. Section Title

```html
<h2 class="nes-section-title">عنوان سکشن</h2>
```

### 2. Form Components

```html
<!-- Input -->
<div class="nes-form-group">
  <label class="nes-label">نام:</label>
  <input type="text" class="nes-input">
</div>

<!-- Button -->
<button class="nes-btn nes-btn-primary">ذخیره</button>
```

### 3. Toast

```html
<div class="nes-toast nes-toast--success">
  <span>عملیات موفق بود!</span>
</div>
```

---

## 🌐 پشتیبانی RTL/LTR

### قوانین:

```scss
// ❌ غلط
.element {
  margin-left: 10px;
}

// ✅ درست
.element {
  margin-inline-start: 10px;

  [dir="rtl"] & {
    text-align: right;
  }

  [dir="ltr"] & {
    text-align: left;
  }
}
```

---

## 📞 سوالات متداول

**Q: چطور رنگ جدید اضافه کنم?**
A: در `src/assets/scss/common/base/_colors.scss`

**Q: چطور یک mixin جدید بسازم?**
A: در `src/assets/scss/common/base/_mixins.scss`

**Q: چرا باید از پیشوند استفاده کنم?**
A: برای جلوگیری از تداخل با کتابخانه‌های عمومی (Bootstrap, Tailwind)

**Q: می‌توانم استایل فرم را در کامپوننت خودم بنویسم?**
A: خیر. همه استایل‌های فرم در `_form.scss` هستند.

**Q: چرا نباید `font-family` در SCSS تعریف کنم?**
A: برای consistency. فقط یکبار در HTML.

---

## 🎯 خلاصه نکات کلیدی

### ممنوعیت‌ها:

1. ❌ `font-family` در SCSS
2. ❌ استایل فرم در کامپوننت (فقط در `_form.scss`)
3. ❌ hardcode رنگ، spacing، radius
4. ❌ کلاس‌های بدون پیشوند (مثل `.card`, `.btn`)

### الزامات:

1. ✅ `@use '../common/base/globals' as *;`
2. ✅ نام‌گذاری BEM
3. ✅ RTL/LTR support
4. ✅ Responsive design
5. ✅ استفاده از متغیرها
6. ✅ Initialization order: settings → i18n → features

---

**آخرین بروزرسانی:** 2025-12-11
**نسخه:** 1.0.0
