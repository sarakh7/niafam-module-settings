# Rating Tooltip Usage Guide

## Overview
این سیستم یک tooltip خودکار برای نمایش پیام "قبلاً رای داده‌اید" به کاربران فراهم می‌کند.

## نحوه استفاده

### روش اول: استفاده از کلاس (پیشنهادی)
ساده‌ترین روش: فقط کلاس `show-voted-tooltip` را به المنت `.es-rating` اضافه کنید:

```javascript
// بعد از دریافت ریسپانس از سرور که نشان می‌دهد کاربر قبلاً رای داده
const ratingElement = document.querySelector('.es-rating');
ratingElement.classList.add('show-voted-tooltip');
```

سیستم به صورت خودکار:
- tooltip را ایجاد می‌کند
- آن را نمایش می‌دهد
- بعد از 3 ثانیه کلاس را حذف می‌کند و tooltip محو می‌شود

### روش دوم: استفاده از تابع JavaScript
اگر می‌خواهید کنترل بیشتری داشته باشید:

```javascript
import { showRatingTooltip } from './features/news/ratingTooltip';

// نمایش tooltip با مدت زمان پیش‌فرض (3 ثانیه)
const ratingElement = document.querySelector('.es-rating');
showRatingTooltip(ratingElement);

// یا با مدت زمان دلخواه (5 ثانیه)
showRatingTooltip(ratingElement, 5000);
```

## مثال کامل

```javascript
// مثال: هندل کردن کلیک روی دکمه لایک
document.querySelector('.es-rating__container').addEventListener('click', async function() {
  const ratingElement = this.closest('.es-rating');

  try {
    // ارسال درخواست به سرور
    const response = await fetch('/api/vote', {
      method: 'POST',
      body: JSON.stringify({ commentId: 123, voteType: 'like' })
    });

    const data = await response.json();

    // اگر کاربر قبلاً رای داده بود
    if (data.error === 'already_voted') {
      // فقط یک کلاس اضافه کنید!
      ratingElement.classList.add('show-voted-tooltip');
    } else {
      // عملیات موفق - آپدیت کردن UI
      // ...
    }
  } catch (error) {
    console.error('خطا در ثبت رای:', error);
  }
});
```

## ساختار HTML

ساختار HTML شما باید به این صورت باشد:

```html
<div class="es-rating" id="js-rating-265" data-commentid="265">
  <div class="es-rating__container">
    <div class="sprite sprite-fa-thumbs-up-grey">
      <i class="es esprit-fi-rr-thumbs-up"></i>
    </div>
    <div class="es-rating-like">2</div>
  </div>
  <div class="es-rating__container">
    <div class="sprite sprite-fa-thumbs-down-grey">
      <i class="es esprit-fi-rr-thumbs-down"></i>
    </div>
    <div class="es-rating-dislike">1</div>
  </div>
  <!-- tooltip به صورت خودکار اینجا اضافه می‌شود -->
</div>
```

## ترجمه‌ها

پیام‌های tooltip به صورت خودکار بر اساس زبان فعلی سایت نمایش داده می‌شوند:

- **فارسی**: "شما قبلاً برای این نظر امتیاز ثبت کرده‌اید"
- **انگلیسی**: "You have already voted for this comment"

برای افزودن زبان‌های دیگر، به فایل‌های ترجمه در `src/locales/` مراجعه کنید و کلید `rating.alreadyVoted` را اضافه کنید.

## ویژگی‌های tooltip

- ✅ انیمیشن نرم fade in/out
- ✅ موقعیت‌یابی خودکار در بالای المنت
- ✅ فلش اشاره‌گر به المنت
- ✅ حذف خودکار بعد از 3 ثانیه
- ✅ پشتیبانی از RTL و LTR
- ✅ پشتیبانی از چند زبان (i18n)
- ✅ نمایش صحیح روی المنت‌های دینامیک
- ✅ بدون نیاز به کد JavaScript اضافی

## نکات مهم

1. **Mutation Observer**: سیستم به صورت خودکار المنت‌های جدید را رصد می‌کند
2. **تغییر زبان**: متن tooltip به صورت خودکار با تغییر زبان آپدیت می‌شود
3. **Performance**: سیستم فقط یک tooltip برای هر المنت ایجاد می‌کند و از آن استفاده مجدد می‌کند
4. **CSS**: تمام استایل‌ها در `_voteReviews.scss` تعریف شده‌اند

## استایل سفارشی

اگر می‌خواهید ظاهر tooltip را تغییر دهید، در فایل `src/assets/scss/news/components/_voteReviews.scss` کلاس `.es-rating__tooltip` را ویرایش کنید.
