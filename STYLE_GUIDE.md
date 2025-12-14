# Style Guide

راهنمای طراحی و توسعه برای پروژه Niafam Module Settings

---

## 📋 فهرست مطالب

1. [سیستم رنگ‌ها](#سیستم-رنگ‌ها)
2. [تایپوگرافی](#تایپوگرافی)
3. [سیستم فاصله‌گذاری](#سیستم-فاصله‌گذاری)
4. [Border Radius](#border-radius)
5. [Breakpoints](#breakpoints)
6. [Mixins در دسترس](#mixins-در-دسترس)
7. [ساختار کامپوننت‌ها](#ساختار-کامپوننت‌ها)
8. [قراردادهای نام‌گذاری](#قراردادهای-نام‌گذاری)
9. [کامپوننت‌های رایج](#کامپوننت‌های-رایج)
10. [پشتیبانی RTL/LTR](#پشتیبانی-rtlltr)
11. [اضافه کردن کامپوننت عمومی جدید](#-اضافه-کردن-کامپوننت-یا-استایل-عمومی-جدید)
12. [Checklist صفحه جدید](#-checklist-برای-ایجاد-صفحه-جدید)
13. [مثال کامل](#-مثال-کامل-ایجاد-صفحه-جدید)
14. [سوالات متداول](#-سوالات-متداول)

---

## ⚡ نکات کلیدی (خلاصه مهم)

### 🚫 ممنوعیت‌ها:

1. **❌ هرگز `font-family` را در فایل‌های SCSS تعریف نکنید**
   - فقط در `<body>` در HTML تعریف شود
   - `@font-face` نیز در `<head>` HTML قرار می‌گیرد

2. **❌ استایل فرم را در کامپوننت خود ننویسید**
   - همه استایل‌های فرم در `src/assets/scss/common/components/_form.scss` است
   - از کلاس‌های `nes-*` استاندارد استفاده کنید

3. **❌ رنگ، spacing، radius را hardcode نکنید**
   - همیشه از متغیرها استفاده کنید: `$blue-gray-600`, `$spacing-4`, `$radius-lg`

4. **❌ از gradient استفاده نکنید**
   - فقط از رنگ‌های solid استفاده کنید
   - به جای `background: linear-gradient(...)` از `background: $blue-gray-600` استفاده کنید
   - این قاعده شامل تمام gradient ها می‌شود: linear-gradient, radial-gradient, conic-gradient

5. **❌ از نام کلاس‌های مشترک با کتابخانه‌های عمومی استفاده نکنید**
   - مثال‌های ممنوع: `.card`, `.nav-link`, `.tab`, `.modal`, `.dropdown`, `.alert`
   - این نام‌ها با Bootstrap, Tailwind و سایر کتابخانه‌ها تداخل دارند
   - **همیشه از پیشوند استفاده کنید**: `.nes-card`, `.nes-modal`, `.profile-tab`

### ✅ الزامات:

1. **✅ همیشه از `@use '../common/base/globals' as *;` استفاده کنید**

2. **✅ نام‌گذاری BEM را رعایت کنید**
   - Block: `.profile-card`
   - Element: `.profile-card__avatar`
   - Modifier: `.profile-card--featured`

3. **✅ RTL/LTR را پشتیبانی کنید**
   - از `inline-start/inline-end` استفاده کنید
   - برای `left/right` از `[dir="rtl"]` و `[dir="ltr"]` استفاده کنید

4. **✅ Responsive design**
   - حداقل برای 768px (موبایل)
   - از breakpoint ها یا `@include respond-to(sm)` استفاده کنید

5. **✅ کامپوننت عمومی را در `common/components/` قرار دهید**
   - اگر در بیش از یک صفحه استفاده می‌شود
   - حتما در STYLE_GUIDE.md مستند کنید

---

## 🎨 سیستم رنگ‌ها

### Blue Gray Colors (رنگ‌های اصلی)
این رنگ‌ها برای عناصر اصلی UI استفاده می‌شوند:

```scss
$blue-gray-50: hsla(231, 36%, 98%, 1);   // Background روشن
$blue-gray-100: hsla(231, 36%, 94%, 1);  // Background خیلی روشن
$blue-gray-200: hsla(229, 35%, 88%, 1);  // Border روشن
$blue-gray-300: hsla(231, 36%, 77%, 1);  // Border متوسط
$blue-gray-400: hsla(232, 36%, 59%, 1);  // Text کم‌رنگ
$blue-gray-600: hsla(232, 36%, 38%, 1);  // Primary Color (دکمه‌ها، لینک‌های فعال)
$blue-gray-700: hsla(231, 36%, 33%, 1);  // Primary Dark
$blue-gray-800: hsla(230, 36%, 25%, 1);  // Text تیره
```

**استفاده:**
- `$blue-gray-600`: دکمه‌های اصلی، آیتم‌های فعال منو، عناوین مهم
- `$blue-gray-100`: پس‌زمینه سکشن‌ها، hover states
- `$blue-gray-300`: Border عناصر فرم

### Gray Colors (رنگ‌های خنثی)
برای متن، border و پس‌زمینه‌های خنثی:

```scss
$gray-25: hsla(0, 0%, 99%, 1);   // تقریبا سفید
$gray-50: hsla(0, 0%, 98%, 1);   // Background خیلی روشن
$gray-100: hsla(0, 0%, 96%, 1);  // Background روشن
$gray-200: hsla(220, 5%, 92%, 1);  // Border پیش‌فرض
$gray-300: hsla(220, 6%, 85%, 1);  // Border متوسط
$gray-400: hsla(220, 6%, 66%, 1);  // Text کم‌رنگ
$gray-500: hsla(220, 6%, 47%, 1);  // Text متوسط
$gray-600: hsla(220, 8%, 35%, 1);  // Text تیره
$gray-700: hsla(220, 11%, 29%, 1); // Text خیلی تیره
$gray-900: hsla(220, 24%, 12%, 1); // تقریبا سیاه
```

**استفاده:**
- `$gray-700`: متن اصلی صفحات
- `$gray-200`: Border کارت‌ها و جداکننده‌ها
- `$gray-100`: پس‌زمینه فرم‌ها

### Status Colors (رنگ‌های وضعیت)

```scss
$success: #179c52;           // موفقیت (سبز)
$error: #ff3e30;            // خطا (قرمز)
$error-700: hsla(4, 76%, 40%, 1);  // خطای تیره
```

**استفاده:**
- `$success`: پیام‌های موفقیت، دکمه ذخیره موفق
- `$error`: پیام‌های خطا، validation errors

### CSS Variables
همه رنگ‌ها به صورت CSS Variable نیز در دسترس هستند:

```css
var(--blue-gray-600)
var(--gray-200)
var(--error-700)
```

---

## ✍️ تایپوگرافی

### Font Weights

```scss
$text-regular: 400;      // متن عادی
$text-medium: 500;       // متن medium
$text-semi-bold: 600;    // عناوین ثانویه، لیبل‌های فرم
$text-bold: 700;         // عناوین اصلی
$text-extra-bold: 800;   // عناوین بسیار مهم
$text-black: 900;        // عناوین Hero
```

### Font Sizes
سیستم اندازه فونت از 8 تا 100 به صورت em:

```scss
// استفاده شده در پروژه:
$text-xs: 0.75em;    // 12px
$text-sm: 0.875em;   // 14px
$text-base: 1em;     // 16px
$text-lg: 1.125em;   // 18px
$text-xl: 1.25em;    // 20px
```

**نکته:** برای دسترسی به سایر اندازه‌ها:
```scss
@use 'sass:map';
font-size: map.get($text-sizes, 24); // برای 24px
```

### فونت‌های استفاده شده

- **Dana**: برای زبان‌های فارسی و عربی
- **Roboto**: برای متن‌های لاتین

### ⚠️ قوانین مهم Font Family

**نکته بسیار مهم:**
- ❌ **هرگز `font-family` را در فایل‌های SCSS تعریف نکنید**
- ✅ `font-family` فقط برای `<body>` در خود فایل HTML تعریف می‌شود
- ✅ `@font-face` ها نیز در `<head>` فایل HTML تعریف می‌شوند

**مثال صحیح در HTML:**

```html
<head>
    <style>
        @font-face {
            font-family: 'Dana';
            src: url('fonts/Dana.woff2') format('woff2');
        }

        body {
            font-family: 'Dana', 'Roboto', sans-serif;
        }
    </style>
</head>
```

**❌ اشتباه در SCSS:**
```scss
.my-component {
    font-family: 'Dana'; // هرگز این کار را نکنید
}
```

---

## 📏 سیستم فاصله‌گذاری

```scss
$spacing-sm: 4px;    // فاصله بسیار کم (margin/padding کوچک)
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
| Gap بین آیکون و متن | `$spacing-2` (12px) |
| Padding دکمه‌ها | `$spacing-2` or `$spacing-3` |
| Gap بین عناصر فرم | `$spacing-3` (16px) |
| Padding کارت‌ها | `$spacing-4` (24px) |
| Margin بین سکشن‌ها | `$spacing-5` (32px) |
| Padding صفحات اصلی | `$spacing-5` (32px) |

---

## 🔲 Border Radius

```scss
$radius-none: 0px;
$radius-xs: 2px;
$radius-sm: 4px;
$radius-md: 6px;
$radius-lg: 8px;        // پیش‌فرض (استفاده بیشتر)
$radius-xl: 12px;       // کارت‌های بزرگ
$radius-2xl: 16px;
$radius-3xl: 24px;
$radius-4xl: 32px;
$radius-full: 9999px;   // دکمه‌های گرد، avatar

$radius-default: $radius-lg; // 8px
```

**استفاده:**
- دکمه‌ها و input‌ها: `$radius-default` (8px)
- کارت‌ها و مودال‌ها: `$radius-xl` (12px)
- Avatar: `$radius-full`

---

## 📱 Breakpoints

```scss
$breakpoint-xs: 480px;   // موبایل کوچک
$breakpoint-sm: 768px;   // تبلت عمودی
$breakpoint-md: 1024px;  // تبلت افقی
$breakpoint-lg: 1280px;  // دسکتاپ
$breakpoint-xl: 1536px;  // دسکتاپ بزرگ
```

### استفاده با Mixin:

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
برای دکمه‌های آیکون:

```scss
@include iconButton;
```

**خروجی:**
- Background شفاف
- Display flex برای center کردن
- Hover: `$blue-gray-600` background
- Active state و Disabled state

**مثال استفاده:**
```scss
.my-icon-btn {
  @include iconButton;
  width: 32px;
  height: 32px;
}
```

---

### 2. sideBox
برای کارت‌ها و box‌های کناری:

```scss
@include sideBox;
```

**خروجی:**
- Background سفید
- Border خاکستری
- Border radius پیش‌فرض

**مثال استفاده:**
```scss
.sidebar-card {
  @include sideBox;
  padding: $spacing-4;
}
```

---

### 3. positionCenter
برای center کردن absolute element:

```scss
@include positionCenter;
```

**خروجی:**
```scss
position: absolute;
top: 50%;
left: 50%;
transform: translate(-50%, -50%);
```

---

### 4. afterOverlay
برای ایجاد overlay با ::after:

```scss
&::after {
  @include afterOverlay;
  background: rgba(0, 0, 0, 0.5);
}
```

---

### 5. lineClamp
برای محدود کردن تعداد خطوط متن:

```scss
@include lineClamp(3); // نمایش فقط 3 خط
```

**مثال:**
```scss
.card-description {
  @include lineClamp(2);
}
```

---

### 6. sectionTitle
برای عناوین سکشن با خط کناری:

```scss
@include sectionTitle($size: 16, $color: $blue-gray-700);
```

**پارامترها:**
- `$size`: طول خط کناری (px)
- `$color`: رنگ عنوان و خط

**مثال:**
```scss
.my-section-title {
  @include sectionTitle(32, $blue-gray-600);
}
```

---

### 7. respond-to (Responsive Mixin)

استفاده شده در بخش [Breakpoints](#breakpoints).

---

## 🧩 ساختار کامپوننت‌ها

### قوانین کلی:

1. **یک کامپوننت = یک فایل SCSS**
2. **هر کامپوننت باید مستقل باشد**
3. **از global variables استفاده کنید نه hardcode**

### ساختار فایل:

```scss
/**
 * Component Name
 * توضیح مختصر درباره کامپوننت
 */
@use '../common/base/globals' as *;

// Local variables (اختیاری)
$white: #fff;
$text-xl: 1.25em;

// Main component
.component-name {
  // Styles

  // Elements
  &__element {
    // Styles
  }

  // Modifiers
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

### مثال واقعی:

```scss
/**
 * Profile Card Component
 */
@use '../common/base/globals' as *;

.profile-card {
  background: #fff;
  border-radius: $radius-xl;
  padding: $spacing-4;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);

  &__avatar {
    width: 100px;
    height: 100px;
    border-radius: $radius-full;
    border: 3px solid $blue-gray-100;
  }

  &__name {
    font-size: 1.125em;
    font-weight: $text-semi-bold;
    color: $gray-700;
    margin-top: $spacing-3;
  }

  &--featured {
    border: 2px solid $blue-gray-600;
  }
}

@media (max-width: 768px) {
  .profile-card {
    padding: $spacing-3;

    &__avatar {
      width: 80px;
      height: 80px;
    }
  }
}
```

---

## 🏷️ قراردادهای نام‌گذاری

### BEM Methodology

**ساختار:** `block__element--modifier`

#### Block (بلوک)
کامپوننت اصلی:
```scss
.profile-card { }
.navigation-menu { }
.ticket-tracking { }
```

#### Element (عنصر)
بخشی از block:
```scss
.profile-card__avatar { }
.profile-card__name { }
.navigation-menu__item { }
```

#### Modifier (تغییردهنده)
تغییرات استایل:
```scss
.profile-card--featured { }
.button--primary { }
.button--disabled { }
```

### پیشوندهای استفاده شده در پروژه:

| Prefix | معنی | مثال |
|--------|------|------|
| `nes-` | Niafam Esprit System (پیشوند اصلی) | `nes-form`, `nes-btn`, `nes-input`, `nes-card` |
| `profile-` | ماژول Profile | `profile-dashboard`, `profile-edit` |
| `ticket-` | ماژول Ticketing | `ticket-tracking` |

**⚠️ نکته مهم:** از پیشوند `es-` استفاده نکنید. فقط از `nes-` برای کامپوننت‌های عمومی استفاده شود.

### ⚠️ اهمیت استفاده از پیشوند:

**چرا باید از پیشوند استفاده کنیم؟**

1. **جلوگیری از تداخل با کتابخانه‌های عمومی**
   - کتابخانه‌هایی مثل Bootstrap, Tailwind, Foundation کلاس‌های پرکاربردی دارند
   - بدون پیشوند، استایل‌های شما override می‌شوند یا کتابخانه را override می‌کنید

2. **مشخص بودن محدوده کلاس**
   - با دیدن `nes-btn` می‌فهمیم که این دکمه متعلق به سیستم طراحی Niafam است
   - با دیدن `profile-card` می‌فهمیم که این کارت فقط در ماژول Profile استفاده می‌شود

3. **قابلیت نگهداری بهتر**
   - در پروژه‌های بزرگ، نام‌گذاری بدون پیشوند باعث سردرگمی می‌شود
   - پیشوند به ما می‌گوید کدام فایل SCSS را باید ویرایش کنیم

---

### ❌ نام‌های ممنوع (بدون پیشوند):

این نام‌ها با کتابخانه‌های عمومی تداخل دارند و **مجاز نیستند**:

```scss
// ❌ WRONG - این نام‌ها ممنوع هستند
.card { }
.btn { }
.button { }
.alert { }
.modal { }
.dropdown { }
.nav { }
.navbar { }
.nav-link { }
.nav-item { }
.tab { }
.tab-content { }
.tab-pane { }
.form { }
.form-group { }
.input { }
.badge { }
.toast { }
.tooltip { }
.popover { }
.collapse { }
.accordion { }
.carousel { }
.pagination { }
.breadcrumb { }
.list-group { }
.table { }
```

### ✅ نام‌گذاری صحیح با پیشوند:

```scss
// ✅ CORRECT - با پیشوند مناسب
.nes-card { }
.nes-btn { }
.nes-alert { }
.nes-modal { }
.nes-toast { }
.profile-dropdown { }
.profile-nav { }
.ticket-tab { }
.nes-form { }
.nes-input { }
.nes-badge { }
```

---

### انتخاب پیشوند مناسب:

**1. برای کامپوننت‌های عمومی (در `common/components/`):**
   - **فقط از `nes-` استفاده کنید**
   - مثال: `nes-btn`, `nes-card`, `nes-form`, `nes-modal`, `nes-badge`
   - ❌ از `es-` استفاده نکنید

**2. برای ماژول‌های خاص:**
   - از نام ماژول به عنوان پیشوند استفاده کنید
   - مثال: `profile-dashboard`, `ticket-tracking`, `settings-panel`

**3. برای کامپوننت‌های داخلی صفحه:**
   - از پیشوند صفحه/ماژول استفاده کنید
   - مثال: `profile-edit__avatar`, `ticket-tracking__card`

---

### نکات نام‌گذاری:

✅ **درست:**
```scss
.profile-dashboard__sidebar { }
.profile-dashboard__user-name { }
.nes-form-group { }
.nes-section-title { }
.ticket-tracking__status { }
```

❌ **غلط:**
```scss
.profileDashboardSidebar { }  // camelCase نه
.profile_dashboard__sidebar { } // underscore بیش از حد
.sideBar { } // ترکیب camelCase و PascalCase
.card { } // بدون پیشوند (تداخل با کتابخانه‌ها)
.dashboard-sidebar { } // پیشوند ناکافی (dashboard چیست؟)
```

---

### مثال‌های کامل:

#### مثال 1: کامپوننت Card

```scss
// ❌ غلط
.card {
  background: #fff;
  padding: 20px;
}

// ✅ درست
.nes-card {
  background: #fff;
  padding: $spacing-4;

  &__header { }
  &__body { }
  &__footer { }

  &--bordered { }
  &--elevated { }
}
```

#### مثال 2: Navigation در Profile

```scss
// ❌ غلط
.nav {
  display: flex;
}

.nav-link {
  padding: 10px;
}

// ✅ درست
.profile-nav {
  display: flex;

  &__item { }

  &__link {
    padding: $spacing-2;

    &--active { }
  }
}
```

#### مثال 3: Form Button

```scss
// ❌ غلط
.btn {
  padding: 10px 20px;
}

.btn-primary {
  background: blue;
}

// ✅ درست
.nes-btn {
  padding: $spacing-2 $spacing-4;

  &--primary {
    background: $blue-gray-600;
  }

  &--success {
    background: $success;
  }
}
```

---

## 🎁 کامپوننت‌های رایج

### 1. Section Title

عنوان سکشن با خط زیر:

```html
<h2 class="nes-section-title">عنوان سکشن</h2>
```

```scss
.nes-section-title {
  font-size: 1.25em;
  font-weight: $text-semi-bold;
  color: $blue-gray-600;
  margin-bottom: $spacing-4;
  padding-bottom: $spacing-3;
  border-bottom: 1px solid $blue-gray-600;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    bottom: -3px;
    right: 0;
    width: 60px;
    height: 3px;
    background: $blue-gray-600;
  }
}
```

---

### 2. Form Components

#### ⚠️ نکته بسیار مهم:

**همه استایل‌های مربوط به فرم‌ها در فایل `src/assets/scss/common/components/_form.scss` قرار دارند.**

- ✅ همه فرم‌ها باید استایل یکسانی داشته باشند
- ✅ از کلاس‌های استاندارد `nes-*` استفاده کنید
- ❌ استایل فرم را در فایل کامپوننت خود ننویسید
- ⚠️ اگر نیاز به استایل جدید برای فرم دارید، آن را به `_form.scss` اضافه کنید

---

#### Input Field:

```html
<div class="nes-form-group">
  <label class="nes-label">نام:</label>
  <input type="text" class="nes-input">
</div>
```

#### Textarea:

```html
<div class="nes-form-group">
  <label class="nes-label">توضیحات:</label>
  <textarea class="nes-textarea" rows="4"></textarea>
</div>
```

#### Button:

```html
<button class="nes-btn nes-btn-primary">ذخیره</button>
<button class="nes-btn nes-btn-success">تایید</button>
<button class="nes-btn nes-btn-danger">حذف</button>
<button class="nes-btn nes-btn-icon"><i class="icon-refresh"></i></button>
```

#### Form Row (دو input در یک ردیف):

```html
<div class="nes-form-row">
  <div class="nes-input-wrapper">
    <label class="nes-label">نام:</label>
    <input type="text" class="nes-input">
  </div>
  <div class="nes-input-wrapper">
    <label class="nes-label">نام خانوادگی:</label>
    <input type="text" class="nes-input">
  </div>
</div>
```

#### Captcha:

```html
<div class="nes-captcha-row">
  <label class="nes-label">کد امنیتی:</label>
  <div class="nes-captcha-group">
    <img src="captcha.png" alt="captcha" class="nes-captcha-img">
    <input type="text" class="nes-captcha-input">
    <button type="button" class="nes-btn nes-btn-icon">
      <i class="icon-refresh"></i>
    </button>
  </div>
</div>
```

#### Form Actions (دکمه‌های فرم):

```html
<div class="nes-form-actions">
  <button type="submit" class="nes-btn nes-btn-success">ذخیره</button>
  <button type="button" class="nes-btn nes-btn-danger">انصراف</button>
</div>
```

#### کلاس‌های موجود:

| Class | توضیح |
|-------|-------|
| `.nes-form` | Container اصلی فرم |
| `.nes-form-group` | گروه فرم (label + input) |
| `.nes-form-row` | ردیف فرم (چند input در یک خط) |
| `.nes-input-wrapper` | Wrapper برای input در form-row |
| `.nes-label` | برچسب input |
| `.nes-input` | Input text, email, number, etc. |
| `.nes-textarea` | Textarea |
| `.nes-btn` | دکمه عادی |
| `.nes-btn-primary` | دکمه اصلی (آبی) |
| `.nes-btn-success` | دکمه موفقیت (سبز) |
| `.nes-btn-danger` | دکمه خطر (قرمز) |
| `.nes-btn-icon` | دکمه آیکون |
| `.nes-captcha-row` | ردیف captcha |
| `.nes-captcha-group` | گروه captcha |
| `.nes-captcha-input` | Input captcha |
| `.nes-captcha-img` | تصویر captcha |
| `.nes-form-actions` | دکمه‌های انتهای فرم |

---

### 3. Card Component

کارت استاندارد:

```html
<div class="card">
  <div class="card__header">عنوان</div>
  <div class="card__body">محتوا</div>
</div>
```

```scss
.card {
  background: #fff;
  border: 1px solid $gray-200;
  border-radius: $radius-xl;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);

  &__header {
    padding: $spacing-3 $spacing-4;
    border-bottom: 1px solid $gray-200;
    font-weight: $text-semi-bold;
  }

  &__body {
    padding: $spacing-4;
  }
}
```

---

### 4. Toast Notifications

```html
<div class="nes-toast nes-toast--success">
  <div class="nes-toast__content">
    <i class="nes-toast__icon">✓</i>
    <span class="nes-toast__message">عملیات موفق بود!</span>
    <button class="nes-toast__close">×</button>
  </div>
</div>
```

**انواع:**
- `nes-toast--info`: اطلاعات (آبی)
- `nes-toast--success`: موفقیت (سبز)
- `nes-toast--warning`: هشدار (زرد)
- `nes-toast--error`: خطا (قرمز)

---

## 🌐 پشتیبانی RTL/LTR

### قوانین مهم:

1. **از `left`/`right` استفاده نکنید، از `inline-start`/`inline-end` استفاده کنید**

❌ **غلط:**
```scss
.element {
  margin-left: 10px;
  text-align: right;
}
```

✅ **درست:**
```scss
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

2. **برای padding از logical properties استفاده کنید:**

```scss
padding-inline-start: $spacing-3; // بجای padding-right یا padding-left
padding-inline-end: $spacing-3;
padding-block-start: $spacing-3; // بجای padding-top
padding-block-end: $spacing-3; // بجای padding-bottom
```

---

## ⚡ Transitions

```scss
$transition: linear 0.2s;
```

**استفاده:**
```scss
.button {
  transition: $transition;

  &:hover {
    background: $blue-gray-600;
  }
}
```

---

## 🆕 اضافه کردن کامپوننت یا استایل عمومی جدید

### چه زمانی باید کامپوننت عمومی بسازیم؟

یک کامپوننت یا استایل را عمومی کنید اگر:

✅ **در بیش از یک صفحه استفاده می‌شود**
- مثال: دکمه، کارت، فرم، modal

✅ **بخشی از Design System است**
- مثال: Section Title, Toast Notification

✅ **قابلیت استفاده مجدد دارد**
- مثال: Badge, Alert, Spinner

---

### مسیر فایل‌ها:

#### 1. کامپوننت‌های عمومی UI:
```
src/assets/scss/common/components/_component-name.scss
```

**مثال:**
- `_form.scss` - همه استایل‌های فرم
- `_modal.scss` - Modal ها
- `_toast.scss` - Toast Notifications
- `_section-title.scss` - عناوین سکشن

#### 2. استایل‌های پایه (Base):
```
src/assets/scss/common/base/_file-name.scss
```

**مثال:**
- `_variables.scss` - متغیرهای عمومی
- `_colors.scss` - رنگ‌ها
- `_mixins.scss` - Mixins

---

### مراحل اضافه کردن کامپوننت عمومی:

#### مرحله 1: ایجاد فایل کامپوننت

فایل را در مسیر `src/assets/scss/common/components/` بسازید:

```scss
/**
 * Badge Component
 * توضیح مختصر درباره badge
 */
@use '../base/globals' as *;

// Badge styles
.nes-badge {
  display: inline-block;
  padding: $spacing-sm $spacing-2;
  font-size: 0.75rem;
  font-weight: $text-semi-bold;
  border-radius: $radius-full;
  line-height: 1;

  // Badge variants
  &--primary {
    background: $blue-gray-600;
    color: #fff;
  }

  &--success {
    background: $success;
    color: #fff;
  }

  &--error {
    background: $error;
    color: #fff;
  }

  // Badge sizes
  &--sm {
    padding: 2px $spacing-1;
    font-size: 0.625rem;
  }

  &--lg {
    padding: $spacing-1 $spacing-3;
    font-size: 0.875rem;
  }
}
```

#### مرحله 2: Import در فایل اصلی

فایل را در فایل SCSS اصلی که از آن استفاده می‌کنید، import کنید:

```scss
// در فایل main.scss یا contents.scss
@use 'common/components/badge';
```

یا اگر می‌خواهید در همه جا در دسترس باشد، آن را به `common/components/_index.scss` اضافه کنید (اگر چنین فایلی وجود دارد).

#### مرحله 3: مستندسازی در STYLE_GUIDE.md

کامپوننت جدید را به این فایل راهنما اضافه کنید:

```markdown
### X. Badge Component

نشان‌ها برای نمایش وضعیت یا برچسب:

\```html
<span class="nes-badge nes-badge--primary">جدید</span>
<span class="nes-badge nes-badge--success">فعال</span>
<span class="nes-badge nes-badge--error">خطا</span>
\```

**Variants:**
- `nes-badge--primary`: نشان اصلی (آبی)
- `nes-badge--success`: موفقیت (سبز)
- `nes-badge--error`: خطا (قرمز)

**Sizes:**
- `nes-badge--sm`: کوچک
- پیش‌فرض: متوسط
- `nes-badge--lg`: بزرگ
```

#### مرحله 4: تست کردن

در صفحه‌ای که استفاده می‌کنید، آزمایش کنید:

```html
<!DOCTYPE html>
<html lang="fa" dir="rtl">
<head>
    <link rel="stylesheet" href="public/assets/css/your-page.css">
</head>
<body>
    <span class="nes-badge nes-badge--primary">تست</span>
</body>
</html>
```

---

### ⚠️ نکات مهم:

1. **نام‌گذاری:**
   - برای کامپوننت‌های عمومی: **فقط از پیشوند `nes-` استفاده کنید** (نه `es-`)
   - نام باید واضح و توصیفی باشد

2. **Reusability:**
   - کامپوننت باید مستقل باشد
   - به کامپوننت‌های والد وابسته نباشد

3. **Variants & Modifiers:**
   - Modifier های رایج بسازید: `--primary`, `--success`, `--error`
   - Size modifiers: `--sm`, `--lg`, `--xl`

4. **RTL/LTR:**
   - حتما پشتیبانی RTL/LTR را اضافه کنید

5. **Responsive:**
   - برای موبایل نیز استایل بنویسید

6. **Documentation:**
   - حتما در STYLE_GUIDE.md مستند کنید
   - مثال HTML ارائه دهید

---

### مثال کامل: اضافه کردن Alert Component

**1. فایل: `src/assets/scss/common/components/_alert.scss`**

```scss
/**
 * Alert Component
 * نمایش پیام‌های هشدار و اطلاعاتی
 */
@use '../base/globals' as *;

.nes-alert {
  padding: $spacing-3 $spacing-4;
  border-radius: $radius-lg;
  border: 1px solid transparent;
  margin-bottom: $spacing-3;
  display: flex;
  align-items: center;
  gap: $spacing-3;

  &__icon {
    flex-shrink: 0;
    font-size: 1.25rem;
  }

  &__content {
    flex: 1;
  }

  &__title {
    font-weight: $text-semi-bold;
    margin-bottom: $spacing-sm;
  }

  &__message {
    font-size: 0.875rem;
    line-height: 1.5;
  }

  // Variants
  &--info {
    background: rgba($blue-gray-600, 0.1);
    border-color: $blue-gray-600;
    color: $blue-gray-800;
  }

  &--success {
    background: rgba($success, 0.1);
    border-color: $success;
    color: darken($success, 10%);
  }

  &--warning {
    background: rgba(#f59e0b, 0.1);
    border-color: #f59e0b;
    color: darken(#f59e0b, 20%);
  }

  &--error {
    background: rgba($error, 0.1);
    border-color: $error;
    color: darken($error, 10%);
  }

  // Dismissible
  &__close {
    flex-shrink: 0;
    background: none;
    border: none;
    cursor: pointer;
    padding: $spacing-sm;
    border-radius: $radius-sm;
    transition: $transition;

    &:hover {
      background: rgba(0, 0, 0, 0.05);
    }
  }
}

// Responsive
@media (max-width: 768px) {
  .nes-alert {
    padding: $spacing-2 $spacing-3;

    &__icon {
      font-size: 1rem;
    }
  }
}
```

**2. Import در فایل اصلی:**

```scss
@use 'common/components/alert';
```

**3. استفاده در HTML:**

```html
<div class="nes-alert nes-alert--success">
  <i class="nes-alert__icon">✓</i>
  <div class="nes-alert__content">
    <div class="nes-alert__title">موفقیت!</div>
    <div class="nes-alert__message">عملیات با موفقیت انجام شد.</div>
  </div>
  <button class="nes-alert__close">×</button>
</div>
```

---

## 📝 Checklist برای ایجاد صفحه جدید

### قبل از شروع کدنویسی:
- [ ] بررسی کنید که آیا کامپوننت مشابهی در `common/components/` وجود دارد
- [ ] تصمیم بگیرید چه پیشوندی برای کلاس‌ها استفاده می‌کنید (`nes-`, `es-`, یا نام ماژول)

### هنگام نوشتن SCSS:
- [ ] Import کردن `@use '../common/base/globals' as *;`
- [ ] **استفاده از پیشوند مناسب برای همه کلاس‌ها** (جلوگیری از تداخل با کتابخانه‌ها)
- [ ] استفاده از متغیرهای رنگ بجای hardcode
- [ ] استفاده از متغیرهای spacing
- [ ] استفاده از متغیرهای border-radius
- [ ] استفاده از font-weight variables
- [ ] **عدم استفاده از `font-family` در SCSS** (فقط در HTML)
- [ ] **استفاده از کلاس‌های فرم استاندارد از `_form.scss`**
- [ ] نام‌گذاری BEM (`block__element--modifier`)
- [ ] پشتیبانی RTL/LTR (`inline-start/end`, `[dir="rtl"]`)
- [ ] Responsive design (حداقل برای 768px)
- [ ] استفاده از transitions
- [ ] استفاده از mixins موجود
- [ ] کامنت‌گذاری در ابتدای فایل
- [ ] جداسازی local variables در صورت نیاز

### بعد از اتمام کدنویسی:
- [ ] **اگر کامپوننت عمومی است، آن را به `common/components/` منتقل کنید**
- [ ] مستندسازی کامپوننت جدید در STYLE_GUIDE.md
- [ ] تست کردن در حالت RTL و LTR
- [ ] تست کردن در موبایل (responsive)
- [ ] بررسی عدم تداخل با کتابخانه‌های دیگر

---

## 🎯 مثال کامل: ایجاد صفحه جدید

فرض کنید می‌خواهیم صفحه "تنظیمات" ایجاد کنیم:

### 1. ایجاد فایل SCSS:

`src/assets/scss/settings.scss`:

```scss
/**
 * Settings Page Styles
 * Main settings page for user preferences
 */
@use 'common/base/globals' as *;

// Local variables
$white: #fff;

// Main container
.settings-container {
  min-height: 100vh;
  padding: $spacing-5 0;
}

// Settings page
.settings {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 $spacing-4;

  // Page header
  &__header {
    margin-bottom: $spacing-5;
  }

  &__title {
    font-size: 1.5em;
    font-weight: $text-bold;
    color: $blue-gray-600;
    margin-bottom: $spacing-2;
  }

  // Settings grid
  &__grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: $spacing-4;
  }

  // Setting card
  &__card {
    @include sideBox;
    padding: $spacing-4;
    transition: $transition;

    &:hover {
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      transform: translateY(-2px);
    }
  }

  &__card-title {
    font-size: 1.125em;
    font-weight: $text-semi-bold;
    color: $gray-700;
    margin-bottom: $spacing-3;
  }

  &__card-content {
    font-size: 0.875em;
    color: $gray-600;
    line-height: 1.6;
  }
}

// Responsive
@media (max-width: 768px) {
  .settings-container {
    padding: $spacing-3 0;
  }

  .settings {
    padding: 0 $spacing-3;

    &__grid {
      grid-template-columns: 1fr;
      gap: $spacing-3;
    }

    &__card {
      padding: $spacing-3;
    }
  }
}
```

### 2. ایجاد فایل HTML:

```html
<!DOCTYPE html>
<html lang="fa" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>تنظیمات</title>
    <link rel="stylesheet" href="public/assets/css/reset.css">
    <link rel="stylesheet" href="public/assets/css/settings.css">
</head>
<body>
    <div class="settings-container">
        <div class="settings">
            <header class="settings__header">
                <h1 class="settings__title">تنظیمات</h1>
            </header>

            <div class="settings__grid">
                <div class="settings__card">
                    <h2 class="settings__card-title">تنظیمات عمومی</h2>
                    <p class="settings__card-content">
                        تنظیمات مربوط به نمایش و زبان
                    </p>
                </div>

                <div class="settings__card">
                    <h2 class="settings__card-title">حساب کاربری</h2>
                    <p class="settings__card-content">
                        مدیریت اطلاعات حساب کاربری
                    </p>
                </div>
            </div>
        </div>
    </div>
</body>
</html>
```

### 3. Compile کردن SCSS:

```bash
npm run sass
```

---

## 🔗 منابع مفید

- [BEM Methodology](http://getbem.com/)
- [SCSS Documentation](https://sass-lang.com/documentation)
- [CSS Logical Properties](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Logical_Properties)

---

## 📞 سوالات متداول

**Q: چطور رنگ جدیدی اضافه کنم؟**
A: در فایل `src/assets/scss/common/base/_colors.scss` رنگ را تعریف کنید و به `:root` اضافه کنید.

**Q: چطور یک mixin جدید بسازم؟**
A: در فایل `src/assets/scss/common/base/_mixins.scss` mixin را تعریف کنید.

**Q: فونت سایز 22px چطور استفاده کنم؟**
A: از `map.get($text-sizes, 22)` استفاده کنید یا local variable تعریف کنید: `$text-custom: 1.375em`.

**Q: چطور برای موبایل و تبلت استایل بنویسم؟**
A: از mixin `respond-to` یا media query معمولی استفاده کنید:
```scss
@include respond-to(sm) { /* موبایل */ }
@media (max-width: 768px) { /* موبایل */ }
```

**Q: چرا نباید از کلاس `.card` یا `.btn` استفاده کنم؟**
A: این کلاس‌ها با کتابخانه‌های عمومی مثل Bootstrap تداخل دارند. همیشه از پیشوند استفاده کنید: `.nes-card`, `.nes-btn`.

**Q: چه پیشوندی برای کامپوننت جدیدم استفاده کنم؟**
A:
- اگر کامپوننت عمومی است: **فقط `nes-`** (از `es-` استفاده نکنید)
- اگر مخصوص یک ماژول است: نام ماژول (مثل `profile-`, `ticket-`)
- همیشه معنی‌دار و مشخص باشد

**Q: می‌توانم استایل فرم را در کامپوننت خودم بنویسم؟**
A: خیر. همه استایل‌های فرم باید در `src/assets/scss/common/components/_form.scss` باشند و از کلاس‌های `nes-*` استاندارد استفاده کنید.

**Q: چرا نباید `font-family` در SCSS تعریف کنم؟**
A: برای consistency. `font-family` فقط یکبار در `<body>` در HTML تعریف می‌شود و همه عناصر از آن ارث می‌برند.

---

**آخرین بروزرسانی:** 2025-12-11
**نسخه:** 1.0.0
