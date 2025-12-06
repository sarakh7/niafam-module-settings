# Toast Notification System - راهنمای استفاده

## معرفی
سیستم Toast یک کامپوننت قابل استفاده مجدد برای نمایش پیام‌های موقت در برنامه است. این سیستم از 4 نوع پیام پشتیبانی می‌کند: **info**, **success**, **warning**, و **error**.

## ویژگی‌ها

✅ 4 نوع پیام (info, success, warning, error)
✅ انیمیشن نرم و زیبا
✅ پشتیبانی کامل از RTL و LTR
✅ قابلیت بستن دستی
✅ Progress bar برای نمایش زمان باقی‌مانده
✅ پشتیبانی از چند زبان (i18n)
✅ قابلیت نمایش چندین toast همزمان
✅ موقعیت‌های مختلف (6 حالت)
✅ واکنش‌گرا (Responsive)
✅ Accessible (ARIA labels)

## نصب و راه‌اندازی

Toast به صورت خودکار در `main.js` فعال می‌شود و نیازی به تنظیمات اضافی ندارد.

## نحوه استفاده

### 1. Import کردن

```javascript
import {
  showToast,
  showInfoToast,
  showSuccessToast,
  showWarningToast,
  showErrorToast
} from './features/common/toast';
```

### 2. نمایش Toast

#### روش ساده - استفاده از توابع مخصوص هر نوع:

```javascript
// Info Toast (آبی)
showInfoToast('این یک پیام اطلاعاتی است');

// Success Toast (سبز)
showSuccessToast('عملیات با موفقیت انجام شد');

// Warning Toast (زرد)
showWarningToast('توجه: این یک هشدار است');

// Error Toast (قرمز)
showErrorToast('خطا: عملیات انجام نشد');
```

#### روش کامل - با تنظیمات اضافی:

```javascript
showToast('پیام شما', 'success', {
  duration: 5000,              // مدت زمان نمایش (میلی‌ثانیه) - 0 برای نمایش دائمی
  position: 'top-center',      // موقعیت toast
  onClose: () => {             // تابع callback هنگام بسته شدن
    console.log('Toast closed');
  }
});
```

## موقعیت‌های مختلف

شما می‌توانید toast را در 6 موقعیت مختلف نمایش دهید:

```javascript
showToast('پیام', 'info', { position: 'top-right' });     // بالا راست (پیش‌فرض)
showToast('پیام', 'info', { position: 'top-left' });      // بالا چپ
showToast('پیام', 'info', { position: 'top-center' });    // بالا وسط
showToast('پیام', 'info', { position: 'bottom-right' });  // پایین راست
showToast('پیام', 'info', { position: 'bottom-left' });   // پایین چپ
showToast('پیام', 'info', { position: 'bottom-center' }); // پایین وسط
```

## مثال‌های کاربردی

### 1. نمایش پیام بعد از ذخیره فرم

```javascript
async function saveForm() {
  try {
    const response = await fetch('/api/save', {
      method: 'POST',
      body: JSON.stringify(formData)
    });

    if (response.ok) {
      showSuccessToast('اطلاعات با موفقیت ذخیره شد');
    } else {
      showErrorToast('خطا در ذخیره اطلاعات');
    }
  } catch (error) {
    showErrorToast('خطا در ارتباط با سرور');
  }
}
```

### 2. نمایش هشدار قبل از عملیات

```javascript
function deleteItem() {
  showWarningToast('آیا مطمئن هستید؟', {
    duration: 5000
  });
}
```

### 3. نمایش اطلاعات کاربر

```javascript
function showUserInfo() {
  showInfoToast('کاربر گرامی، اطلاعات شما در حال بارگذاری است...', {
    duration: 0  // نمایش دائمی تا زمان بستن دستی
  });
}
```

### 4. Toast با callback

```javascript
const toast = showSuccessToast('فایل با موفقیت آپلود شد', {
  onClose: () => {
    // هدایت به صفحه دیگر بعد از بسته شدن toast
    window.location.href = '/dashboard';
  }
});
```

### 5. بستن دستی Toast

```javascript
import { removeToast, removeAllToasts } from './features/common/toast';

// بستن یک toast خاص
const toast = showInfoToast('این پیام قابل بستن است');
setTimeout(() => {
  removeToast(toast);
}, 2000);

// بستن همه toast ها
removeAllToasts();
```

## استفاده در Rating System

برای نمایش پیام "قبلاً رای داده‌اید" در سیستم امتیازدهی:

```javascript
// روش اول: استفاده از کلاس (خودکار)
const ratingElement = document.querySelector('.es-rating');
ratingElement.classList.add('show-voted-tooltip');

// روش دوم: فراخوانی مستقیم
import { showRatingVotedToast } from './features/contents/ratingTooltip';
showRatingVotedToast();
```

## سفارشی‌سازی استایل‌ها

برای تغییر ظاهر toast ها، فایل SCSS را ویرایش کنید:

**مسیر**: `src/assets/scss/common/components/_toast.scss`

### تغییر رنگ‌ها:

```scss
// رنگ‌های پیش‌فرض
$toast-info-bg: $blue-500;
$toast-success-bg: $green-500;
$toast-warning-bg: $yellow-500;
$toast-error-bg: $red-500;
```

### تغییر مدت زمان انیمیشن:

در فایل `src/features/common/toast.js`:

```javascript
const TOAST_CONFIG = {
  duration: 3000,           // مدت زمان پیش‌فرض
  animationDuration: 300,   // مدت زمان انیمیشن
  maxToasts: 5             // حداکثر تعداد toast های همزمان
};
```

## API مرجع

### `showToast(message, type, options)`
نمایش یک toast با تنظیمات کامل

**پارامترها:**
- `message` (string): متن پیام
- `type` (string): نوع toast - 'info' | 'success' | 'warning' | 'error'
- `options` (object):
  - `duration` (number): مدت زمان نمایش (میلی‌ثانیه) - پیش‌فرض: 3000
  - `position` (string): موقعیت - پیش‌فرض: 'top-right'
  - `onClose` (function): تابع callback

**خروجی:** HTMLElement - المنت toast

---

### `showInfoToast(message, options)`
نمایش toast نوع info

---

### `showSuccessToast(message, options)`
نمایش toast نوع success

---

### `showWarningToast(message, options)`
نمایش toast نوع warning

---

### `showErrorToast(message, options)`
نمایش toast نوع error

---

### `removeToast(toast)`
بستن یک toast مشخص

**پارامترها:**
- `toast` (HTMLElement): المنت toast

---

### `removeAllToasts()`
بستن همه toast های فعال

---

### `initToast()`
راه‌اندازی سیستم toast (به صورت خودکار فراخوانی می‌شود)

## نکات مهم

1. **ترتیب اجرا**: Toast باید بعد از i18n راه‌اندازی شود
2. **Performance**: حداکثر 5 toast به صورت همزمان نمایش داده می‌شود
3. **Accessibility**: Toast ها از ARIA labels استفاده می‌کنند
4. **RTL Support**: پشتیبانی خودکار از راست‌چین و چپ‌چین
5. **Responsive**: Toast ها در موبایل تمام عرض صفحه را می‌گیرند
6. **Animation**: برای کاربرانی که `prefers-reduced-motion` فعال دارند، انیمیشن‌ها کاهش می‌یابد

## عیب‌یابی

### Toast نمایش داده نمی‌شود
- مطمئن شوید که `initToast()` قبل از استفاده فراخوانی شده است
- کنسول مرورگر را برای خطاها چک کنید
- مطمئن شوید که SCSS فایل toast import شده است

### استایل‌ها اعمال نمی‌شود
- مطمئن شوید که SCSS کامپایل شده است: `npm run sass`
- فایل CSS تولید شده را در HTML بررسی کنید

### پیام به زبان دیگری نمایش داده نمی‌شود
- مطمئن شوید که i18n قبل از toast راه‌اندازی شده است
- ترجمه‌های مورد نیاز را به فایل‌های `src/locales/*.json` اضافه کنید

## مثال‌های بیشتر

```javascript
// نمایش loading
const loadingToast = showInfoToast('در حال بارگذاری...', { duration: 0 });

// بعد از اتمام
removeToast(loadingToast);
showSuccessToast('بارگذاری کامل شد');

// نمایش چند toast همزمان
showInfoToast('پیام اول');
showSuccessToast('پیام دوم');
showWarningToast('پیام سوم');

// toast با موقعیت خاص
showErrorToast('خطای مهم', { position: 'top-center' });
```

---

**نویسنده:** Claude Code
**تاریخ:** 2025-11-11
**نسخه:** 1.0.0
