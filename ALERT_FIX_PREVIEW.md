# پیش‌نمایش تغییرات برای رفع XSS در Alert Messages

## فایل‌های تغییر یافته

اگر قرار باشد این آسیب‌پذیری رفع شود، **فقط 1 فایل** تغییر می‌کند:

---

## 📁 فایل تغییر یافته

### 1. `src/features/common/copyShortUrl.js`

**تعداد تغییرات:** 3 بخش
**خطوط تغییر یافته:** ~60 خط از 144 خط کل

---

## 📝 جزئیات تغییرات

### تغییر 1: تابع `showAlert` (خطوط 47-69)

#### ❌ قبل (استفاده از innerHTML):

```javascript
/**
 * Show temporary alert notification
 * @param {Object} options - Alert options
 * @param {HTMLElement} options.el - Alert element
 * @param {number} [options.duration=2000] - Display duration in ms
 * @param {string} [options.alertClass='default'] - Alert CSS class
 * @param {string} [options.content=''] - Alert HTML content
 */
function showAlert(options = {}) {
  const { el, duration = 2000, alertClass = "default", content = "" } = options;

  if (!el) {
    console.warn("Alert element not provided");
    return;
  }

  el.innerHTML = content; // ⚠️ آسیب‌پذیر
  el.classList.add("show", alertClass);

  setTimeout(() => {
    el.classList.remove("show", alertClass);
  }, duration);
}
```

#### ✅ بعد (استفاده از textContent):

```javascript
/**
 * Show temporary alert notification
 * @param {Object} options - Alert options
 * @param {HTMLElement} options.el - Alert element
 * @param {number} [options.duration=2000] - Display duration in ms
 * @param {string} [options.alertClass='default'] - Alert CSS class
 * @param {string} [options.iconClass=''] - Icon CSS class
 * @param {string} [options.message=''] - Alert text message
 */
function showAlert(options = {}) {
  const { el, duration = 2000, alertClass = "default", iconClass = "", message = "" } = options;

  if (!el) {
    console.warn("Alert element not provided");
    return;
  }

  // Security: Use DOM methods instead of innerHTML to prevent XSS
  el.textContent = ""; // Clear existing content

  // Add icon if provided
  if (iconClass) {
    const icon = document.createElement('i');
    icon.className = iconClass;
    el.appendChild(icon);
  }

  // Add message as text (safe - no HTML injection)
  if (message) {
    const span = document.createElement('span');
    span.textContent = message; // ✅ ایمن
    el.appendChild(span);
  }

  el.classList.add("show", alertClass);

  setTimeout(() => {
    el.classList.remove("show", alertClass);
  }, duration);
}
```

**تفاوت کلیدی:**
- ❌ قبل: `content` (HTML string)
- ✅ بعد: `iconClass` + `message` (جدا شده)

---

### تغییر 2: فراخوانی موفق (خط 132-133)

#### ❌ قبل:

```javascript
if (success) {
  const alertContent = `<i class="es esprit-fi-rr-check"></i><span>${i18next.t("tools.shortlink.copied")}</span>`;
  showAlert({ el: shortUrlTooltip, content: alertContent });
}
```

#### ✅ بعد:

```javascript
if (success) {
  showAlert({
    el: shortUrlTooltip,
    iconClass: "es esprit-fi-rr-check",
    message: i18next.t("tools.shortlink.copied")
  });
}
```

---

### تغییر 3: فراخوانی خطا (خط 135-140)

#### ❌ قبل:

```javascript
else {
  const alertContent = `<i class="es esprit-fi-rr-cross"></i><span>${i18next.t("tools.shortlink.failed")}</span>`;
  showAlert({
    el: shortUrlTooltip,
    alertClass: "error",
    content: alertContent,
  });
}
```

#### ✅ بعد:

```javascript
else {
  showAlert({
    el: shortUrlTooltip,
    alertClass: "error",
    iconClass: "es esprit-fi-rr-cross",
    message: i18next.t("tools.shortlink.failed")
  });
}
```

---

## 📊 خلاصه تغییرات

| بخش | خطوط قبل | خطوط بعد | تفاوت |
|-----|----------|----------|-------|
| تابع `showAlert` | 18 خط | 35 خط | +17 خط |
| فراخوانی موفق | 3 خط | 5 خط | +2 خط |
| فراخوانی خطا | 6 خط | 6 خط | 0 خط |
| **جمع کل** | **27 خط** | **46 خط** | **+19 خط** |

---

## 🔍 مقایسه کامل فایل

### کل فایل قبل از تغییر:

```javascript
// خطوط 1-46: بدون تغییر
// ├─ import
// ├─ copyToClipboard()
// └─ تا قبل از showAlert

// خطوط 47-69: تغییر می‌کند ❌
function showAlert(options = {}) {
  const { el, duration = 2000, alertClass = "default", content = "" } = options;
  if (!el) return;
  el.innerHTML = content; // ⚠️
  // ...
}

// خطوط 70-130: بدون تغییر
// ├─ isValidUrl()
// ├─ initCopyShortUrl()
// └─ تا قبل از success handling

// خطوط 131-133: تغییر می‌کند ❌
if (success) {
  const alertContent = `<i class="..."></i><span>${i18next.t("...")}</span>`;
  showAlert({ el: shortUrlTooltip, content: alertContent });
}

// خطوط 134-141: تغییر می‌کند ❌
else {
  const alertContent = `<i class="..."></i><span>${i18next.t("...")}</span>`;
  showAlert({ el: shortUrlTooltip, alertClass: "error", content: alertContent });
}

// خطوط 142-144: بدون تغییر
```

### کل فایل بعد از تغییر:

```javascript
// خطوط 1-46: بدون تغییر ✅

// خطوط 47-84: تغییر شده ✅
function showAlert(options = {}) {
  const { el, duration = 2000, alertClass = "default", iconClass = "", message = "" } = options;
  if (!el) return;

  el.textContent = ""; // ✅ ایمن

  if (iconClass) {
    const icon = document.createElement('i');
    icon.className = iconClass;
    el.appendChild(icon);
  }

  if (message) {
    const span = document.createElement('span');
    span.textContent = message; // ✅ ایمن
    el.appendChild(span);
  }

  // ...
}

// خطوط 85-145: بدون تغییر ✅

// خطوط 146-151: تغییر شده ✅
if (success) {
  showAlert({
    el: shortUrlTooltip,
    iconClass: "es esprit-fi-rr-check",
    message: i18next.t("tools.shortlink.copied")
  });
}

// خطوط 152-159: تغییر شده ✅
else {
  showAlert({
    el: shortUrlTooltip,
    alertClass: "error",
    iconClass: "es esprit-fi-rr-cross",
    message: i18next.t("tools.shortlink.failed")
  });
}

// خطوط 160-162: بدون تغییر ✅
```

---

## 📦 فایل‌های دیگر

### آیا فایل‌های دیگر تغییر می‌کنند?

#### ❌ فایل‌های ترجمه (بدون تغییر):
- `src/locales/fa.json` - بدون تغییر ✅
- `src/locales/en.json` - بدون تغییر ✅
- `src/locales/ar.json` - بدون تغییر ✅
- `src/locales/tr.json` - بدون تغییر ✅
- `src/locales/ru.json` - بدون تغییر ✅

#### ❌ HTML (بدون تغییر):
- `index.html` - بدون تغییر ✅

#### ❌ سایر ماژول‌ها (بدون تغییر):
- هیچ فایل دیگری استفاده نمی‌کند ✅

---

## 🎯 نتیجه‌گیری

### تنها 1 فایل تغییر می‌کند:

```
src/features/common/copyShortUrl.js
├─ تابع showAlert (تغییر API)
├─ فراخوانی در success case
└─ فراخوانی در error case
```

### آمار کلی:

- **تعداد فایل‌های تغییر یافته:** 1
- **تعداد خطوط اضافه شده:** +19
- **تعداد تابع‌های تغییر یافته:** 1 (showAlert)
- **تعداد فراخوانی‌های تغییر یافته:** 2
- **Breaking changes:** خیر (فقط داخلی)
- **نیاز به تست:** بله (copy short URL)

---

## ⚡ تأثیر بر سایر بخش‌ها

### تابع `showAlert` فقط داخلی است?

بله! بررسی کردم:

```bash
# جستجوی استفاده از showAlert
grep -r "showAlert" src/
```

**نتیجه:**
- فقط در `copyShortUrl.js` استفاده می‌شود ✅
- تابع `showAlert` export نشده (داخلی است) ✅
- هیچ فایل دیگری import نمی‌کند ✅

**یعنی:** تغییر API تابع `showAlert` فقط روی همین فایل تأثیر می‌گذارد!

---

## 🧪 تست‌های مورد نیاز

بعد از تغییر، باید این‌ها را تست کنید:

1. ✅ کلیک روی دکمه "کپی لینک"
2. ✅ بررسی نمایش پیام "کپی شد!"
3. ✅ بررسی نمایش آیکون چک
4. ✅ بررسی اتوماتیک محو شدن بعد از 2 ثانیه
5. ✅ بررسی حالت خطا (اگر کپی نشد)
6. ✅ بررسی نمایش پیام "کپی نشد!"
7. ✅ بررسی نمایش آیکون خطا

---

## ⏱️ زمان پیاده‌سازی

- **کد نویسی:** ~15 دقیقه
- **تست:** ~5 دقیقه
- **جمع کل:** ~20 دقیقه

---

**تاریخ:** 2025-10-30
**وضعیت:** پیش‌نمایش تغییرات
**آماده برای پیاده‌سازی:** بله
