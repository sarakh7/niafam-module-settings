# Rating Tooltip Usage - راهنمای استفاده از Tooltip در سیستم امتیازدهی

## خلاصه

سیستم امتیازدهی (Rating) از یک tooltip ساده HTML + CSS استفاده می‌کند. این روش:
- ✅ Performance بالا (بدون ایجاد/حذف DOM)
- ✅ خیلی ساده (فقط toggle کردن کلاس)
- ✅ بدون جابجایی المنت‌ها
- ✅ کنترل دقیق‌تر موقعیت و استایل

## پیش‌نیاز: ساختار HTML

**مهم**: باید المنت tooltip را در HTML قرار دهید:

```html
<div class="es-rating" id="js-rating-265" data-commentid="265">
  <!-- Tooltip Element - این المنت حتماً باید وجود داشته باشد -->
  <div class="es-rating__tooltip" data-i18n="rating.alreadyVoted">
    شما قبلاً برای این نظر امتیاز ثبت کرده‌اید
  </div>

  <!-- Rating Buttons -->
  <div class="es-rating__container">
    <div class="sprite">
      <i class="es esprit-fi-rr-thumbs-up"></i>
    </div>
    <div class="es-rating-like">5</div>
  </div>
  <div class="es-rating__container">
    <div class="sprite">
      <i class="es esprit-fi-rr-thumbs-down"></i>
    </div>
    <div class="es-rating-dislike">2</div>
  </div>
</div>
```

## نحوه استفاده

### روش 1: استفاده مستقیم از کلاس (ساده‌ترین) ⭐

بعد از دریافت پاسخ از سرور که نشان می‌دهد کاربر قبلاً رای داده:

```javascript
const ratingElement = document.querySelector('.es-rating');
ratingElement.classList.add('show-voted-tooltip');

// Tooltip به صورت خودکار بعد از 3 ثانیه مخفی نمی‌شود
// باید خودتان کلاس را حذف کنید:
setTimeout(() => {
  ratingElement.classList.remove('show-voted-tooltip');
}, 3000);
```

### روش 2: استفاده از تابع کمکی (پیشنهادی) ⭐⭐

```javascript
import { showRatingVotedToast } from './features/contents/ratingTooltip';

const ratingElement = document.querySelector('.es-rating');

// نمایش با تنظیمات پیش‌فرض (3 ثانیه)
showRatingVotedToast(ratingElement);

// یا با مدت زمان سفارشی
showRatingVotedToast(ratingElement, { duration: 5000 }); // 5 ثانیه
```

تابع `showRatingVotedToast` به صورت خودکار:
1. کلاس `show-voted-tooltip` را اضافه می‌کند
2. بعد از duration مشخص شده، کلاس را حذف می‌کند

## مثال کامل با AJAX

```javascript
document.querySelector('.es-rating__container').addEventListener('click', async function() {
  const ratingElement = this.closest('.es-rating');
  const commentId = ratingElement.dataset.commentid;
  const voteType = this.classList.contains('es-rating-like') ? 'like' : 'dislike';

  try {
    // ارسال درخواست به سرور
    const response = await fetch('/api/comments/vote', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        commentId: commentId,
        voteType: voteType
      })
    });

    const data = await response.json();

    if (data.success) {
      // به‌روزرسانی تعداد رای‌ها در UI
      updateVoteCount(ratingElement, voteType, data.newCount);

      // نمایش پیام موفقیت
      // (اختیاری - می‌توانید از Toast مستقیم استفاده کنید)
      // import { showSuccessToast } from './features/common/toast';
      // showSuccessToast('رای شما ثبت شد');

    } else if (data.error === 'already_voted') {
      // کاربر قبلاً رای داده - نمایش Toast
      ratingElement.classList.add('show-voted-tooltip');

    } else {
      // خطای دیگر
      // import { showErrorToast } from './features/common/toast';
      // showErrorToast('خطا در ثبت رای');
    }

  } catch (error) {
    console.error('خطا در ارتباط با سرور:', error);
    // import { showErrorToast } from './features/common/toast';
    // showErrorToast('خطا در ارتباط با سرور');
  }
});

function updateVoteCount(ratingElement, voteType, newCount) {
  const countElement = ratingElement.querySelector(
    voteType === 'like' ? '.es-rating-like' : '.es-rating-dislike'
  );
  if (countElement) {
    countElement.textContent = newCount;
  }
}
```

## مثال با jQuery

```javascript
$('.es-rating__container').on('click', function() {
  const $ratingElement = $(this).closest('.es-rating');
  const commentId = $ratingElement.data('commentid');
  const voteType = $(this).find('.es-rating-like').length > 0 ? 'like' : 'dislike';

  $.ajax({
    url: '/api/comments/vote',
    method: 'POST',
    data: {
      commentId: commentId,
      voteType: voteType
    },
    success: function(data) {
      if (data.success) {
        // به‌روزرسانی UI
        updateVoteCount($ratingElement, voteType, data.newCount);
      } else if (data.error === 'already_voted') {
        // نمایش Toast
        $ratingElement.addClass('show-voted-tooltip');
      }
    },
    error: function() {
      // مدیریت خطا
      // می‌توانید از showErrorToast استفاده کنید
    }
  });
});
```

## پاسخ سرور

سرور باید یکی از این فرمت‌ها را برگرداند:

### موفقیت:
```json
{
  "success": true,
  "newCount": 6,
  "message": "Vote registered successfully"
}
```

### قبلاً رای داده:
```json
{
  "success": false,
  "error": "already_voted",
  "message": "You have already voted for this comment"
}
```

### خطا:
```json
{
  "success": false,
  "error": "invalid_comment",
  "message": "Comment not found"
}
```

## ساختار HTML (قدیمی - بدون tooltip)

⚠️ **این ساختار قدیمی است و tooltip ندارد. برای استفاده از tooltip به ساختار بالا مراجعه کنید.**

```html
<div class="es-rating" id="js-rating-265" data-commentid="265">
  <!-- ⚠️ tooltip element اینجا وجود ندارد -->
  <div class="es-rating__container">
    <div class="sprite">
      <i class="es esprit-fi-rr-thumbs-up"></i>
    </div>
    <div class="es-rating-like">5</div>
  </div>
  <div class="es-rating__container">
    <div class="sprite">
      <i class="es esprit-fi-rr-thumbs-down"></i>
    </div>
    <div class="es-rating-dislike">2</div>
  </div>
</div>
```

## سفارشی‌سازی پیام

### روش 1: با استفاده از i18n (ترجمه خودکار)

اگر از `data-i18n` استفاده می‌کنید، فایل‌های ترجمه را ویرایش کنید:

**فارسی** (`src/locales/fa.json`):
```json
{
  "rating": {
    "alreadyVoted": "شما قبلاً برای این نظر امتیاز ثبت کرده‌اید"
  }
}
```

**انگلیسی** (`src/locales/en.json`):
```json
{
  "rating": {
    "alreadyVoted": "You have already voted for this comment"
  }
}
```

### روش 2: مستقیم در HTML (بدون i18n)

اگر نیازی به i18n ندارید، می‌توانید مستقیماً متن را در HTML بنویسید:

```html
<div class="es-rating__tooltip">
  پیام سفارشی شما اینجا
</div>
```

## استفاده از Toast برای پیام‌های دیگر

برای پیام‌های دیگر (موفقیت، خطا، هشدار) از [سیستم Toast](TOAST_USAGE.md) استفاده کنید:

```javascript
import {
  showInfoToast,
  showSuccessToast,
  showWarningToast,
  showErrorToast
} from './features/common/toast';

// موفقیت در ثبت رای
showSuccessToast('رای شما با موفقیت ثبت شد', {
  position: 'top-center',
  duration: 2000
});

// خطا در ثبت رای
showErrorToast('خطا در ثبت رای. لطفاً دوباره تلاش کنید', {
  position: 'top-center',
  duration: 3000
});

// نیاز به ورود
showWarningToast('برای ثبت رای باید وارد شوید', {
  position: 'top-center',
  duration: 4000
});
```

## مستندات کامل

برای اطلاعات بیشتر درباره سیستم Toast، به فایل [TOAST_USAGE.md](TOAST_USAGE.md) مراجعه کنید.

## تست و دمو

برای مشاهده و تست Toast ها، فایل `toast-demo.html` را در مرورگر باز کنید:

```bash
# باز کردن در مرورگر پیش‌فرض (Windows)
start toast-demo.html
```

یا با یک سرور محلی:

```bash
npm run dev
# سپس به آدرس زیر بروید:
# http://localhost:5173/toast-demo.html
```

## نکات مهم

1. ✅ کلاس `show-voted-tooltip` به صورت خودکار بعد از نمایش Toast حذف می‌شود
2. ✅ Toast به صورت خودکار با تغییر زبان سایت تغییر می‌کند
3. ✅ چند Toast می‌تواند همزمان نمایش داده شود (حداکثر 5)
4. ✅ Toast ها در موبایل تمام عرض صفحه را می‌گیرند
5. ✅ کاربر می‌تواند با کلیک روی دکمه × هر Toast را ببندد
6. ⚠️ **مهم**: در `main.js` فقط `observeRatingElements()` را فراخوانی کنید، نه `initRatingTooltips()` (چون observeRatingElements خودش initRatingTooltips را صدا می‌زند)

## عیب‌یابی

### Toast نمایش داده نمی‌شود
- مطمئن شوید که `initToast()` در `main.js` فراخوانی شده است
- Console مرورگر را برای خطاها بررسی کنید
- مطمئن شوید که فایل CSS کامپایل شده است

### Toast دو بار نمایش داده می‌شود
- **دلیل**: احتمالاً هم `initRatingTooltips()` و هم `observeRatingElements()` فراخوانی شده‌اند
- **راه‌حل**: فقط `observeRatingElements()` را فراخوانی کنید (چون خودش initRatingTooltips را صدا می‌زند)

### پیام به زبان دیگری نمایش داده می‌شود
- مطمئن شوید که `<html lang="fa">` درست تنظیم شده است
- i18n باید قبل از Toast راه‌اندازی شود

---

**آخرین به‌روزرسانی:** 2025-11-11
