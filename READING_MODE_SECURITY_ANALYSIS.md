# تحلیل امنیتی Reading Mode

## تاریخ تحلیل: 2025-10-30

---

## خلاصه نتیجه‌گیری

✅ **خطر واقعی در حال حاضر: کم**
⚠️ **خطر بالقوه در آینده: متوسط**
💡 **توصیه: پیاده‌سازی محافظت بدون تغییر عملکرد**

---

## 1️⃣ تحلیل کد فعلی

### عملکرد Reading Mode:

```javascript
// مرحله 1: کپی کامل محتوا
const clone = source.cloneNode(true);

// مرحله 2: حذف تصاویر
clone.querySelectorAll("img").forEach((img) => img.remove());

// مرحله 3: حذف برخی attributes
el.removeAttribute("style");
el.removeAttribute("role");
el.removeAttribute("aria-label");
el.removeAttribute("aria-hidden");
el.removeAttribute("tabindex");
```

### ✅ چه چیزهایی حذف می‌شود:
- ✅ تصاویر (`<img>`)
- ✅ استایل‌های inline (`style`)
- ✅ کلاس‌های CSS (به جز `accessible-keep`, `accessible-hidden`, `esprit-article-accessibility__reloadPageBtn`)
- ✅ Accessibility attributes (`role`, `aria-*`, `tabindex`)

### ❌ چه چیزهایی حذف نمی‌شود:
- ❌ Event handlers (`onclick`, `onerror`, `onload`, `onmouseover`, ...)
- ❌ تگ‌های `<script>`
- ❌ تگ‌های `<iframe>`, `<object>`, `<embed>`
- ❌ لینک‌های `javascript:` در `href`
- ❌ تگ‌های `<form>` و `<input>`

---

## 2️⃣ بررسی محتوای واقعی (index.html)

### محتوای `.esprit-article__main-content`:

```html
<div class="esprit-article__main-content">
  <header class="esprit-article__header">
    <p class="esprit-article__subtitle">...</p>
    <h1 class="esprit-article__title">...</h1>
    <p class="esprit-article__summary">...</p>
  </header>

  <div class="esprit-article__content">
    <div class="esprit-article__image-wrapper">
      <img src="..." /> <!-- حذف می‌شود ✅ -->
    </div>

    <div class="esprit-article__paragraph">
      <p>متن مقاله...</p>
      <h3>عنوان فرعی</h3>
      <p>متن با <a href="###">لینک</a></p>
    </div>
  </div>
</div>
```

### 🔍 یافته‌های مهم:

1. **هیچ event handler inline وجود ندارد** در محتوای مقاله
2. **هیچ `<script>` tag وجود ندارد** در محتوای مقاله
3. **فقط HTML ساده:** `<p>`, `<h1>`, `<h3>`, `<a>`, `<div>`
4. لینک‌های موجود: فقط با `href="###"` یا `href="#"` (placeholder)

### Event handlers موجود در صفحه:

```html
<!-- خط 962-965: خارج از .esprit-article__main-content -->
<button onclick="handleVote(this, 'like')">
<button onclick="handleVote(this, 'dislike')">
```

**نتیجه:** این دکمه‌ها **خارج از** `.esprit-article__main-content` هستند و به reading mode کپی نمی‌شوند ✅

---

## 3️⃣ ارزیابی خطر

### سناریوهای حمله محتمل:

#### سناریو 1: محتوا از پایگاه داده می‌آید ✅ ایمن

**فرض:** شما محتوا را در CMS/Admin خودتان می‌نویسید

**خطر:** کم
- ✅ شما کنترل کامل روی محتوا دارید
- ✅ هیچ کاربر خارجی نمی‌تواند محتوا بنویسد
- ✅ فقط admin ها دسترسی دارند

**توصیه:** فعلاً نیازی به تغییر ندارد (اما برای آینده پیشگیرانه عمل کنید)

---

#### سناریو 2: محتوا از API خارجی می‌آید ⚠️ خطر متوسط

**فرض:** محتوا از سرور دیگری یا API شخص ثالث fetch می‌شود

**خطر:** متوسط تا بالا
- ⚠️ اگر API compromise شود، محتوای مخرب تزریق می‌شود
- ⚠️ اگر Man-in-the-Middle attack رخ دهد

**مثال حمله:**
```javascript
// API response مخرب
{
  "content": "<p>متن عادی</p><img src=x onerror='steal_cookies()'>"
}
```

**نتیجه در Reading Mode:**
```javascript
const clone = source.cloneNode(true);
// تصویر حذف می‌شود ✅
clone.querySelectorAll("img").forEach((img) => img.remove());

// اما اگر این باشد:
// <div onclick="alert('XSS')">کلیک کنید</div>
// onclick باقی می‌ماند! ❌
```

---

#### سناریو 3: محتوا از کاربران می‌آید 🔴 خطر بالا

**فرض:** کاربران می‌توانند مقاله بنویسند (مثل سیستم بلاگ)

**خطر:** بسیار بالا
- 🔴 کاربر مخرب می‌تواند هر HTML دلخواهی بنویسد
- 🔴 Stored XSS attack ممکن است

**مثال:**
```html
<!-- کاربر مخرب می‌نویسد: -->
<p>این یک مقاله معمولی است</p>
<svg onload="alert('XSS Attack')">
  <circle r="10"/>
</svg>
```

---

## 4️⃣ راه‌حل پیشنهادی (بدون خراب کردن عملکرد)

### گزینه A: حذف دستی Event Handlers (سبک‌تر)

```javascript
const clone = source.cloneNode(true);

// حذف تصاویر (فعلی)
clone.querySelectorAll("img").forEach((img) => img.remove());

// 🆕 امنیت: حذف event handlers
const allElements = clone.querySelectorAll('*');
allElements.forEach(el => {
  // حذف تمام on* attributes
  Array.from(el.attributes).forEach(attr => {
    if (attr.name.startsWith('on')) {
      el.removeAttribute(attr.name);
    }
  });

  // ایمن‌سازی href
  if (el.tagName === 'A' && el.href.startsWith('javascript:')) {
    el.removeAttribute('href');
  }
});

// حذف تگ‌های خطرناک
clone.querySelectorAll('script, iframe, object, embed, form').forEach(el => {
  el.remove();
});

target.appendChild(clone);
```

**مزایا:**
- ✅ بدون dependency اضافی
- ✅ سبک (فقط چند خط کد)
- ✅ سریع (< 1ms)
- ✅ همه عملکرد فعلی حفظ می‌شود

**معایب:**
- ⚠️ ممکن است edge case ها را از دست بدهد
- ⚠️ نیاز به تست دقیق

---

### گزینه B: استفاده از DOMPurify (امن‌تر)

```javascript
import DOMPurify from 'dompurify';

const clone = source.cloneNode(true);

// حذف تصاویر (فعلی)
clone.querySelectorAll("img").forEach((img) => img.remove());

// 🆕 امنیت: Sanitize با حفظ ساختار
const sanitizedHTML = DOMPurify.sanitize(clone.innerHTML, {
  ALLOWED_TAGS: [
    'p', 'div', 'span', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    'ul', 'ol', 'li', 'br', 'strong', 'em', 'b', 'i', 'a',
    'blockquote', 'pre', 'code', 'table', 'thead', 'tbody', 'tr', 'th', 'td',
    'header', 'section', 'article'
  ],
  ALLOWED_ATTR: [
    'class', 'id', 'href', 'target', 'rel',
    'data-i18n', 'aria-label'
  ],
  ALLOW_DATA_ATTR: true,
  FORBID_TAGS: ['script', 'style', 'iframe', 'object', 'embed', 'form', 'input'],
  FORBID_ATTR: ['onerror', 'onload', 'onclick', 'onmouseover', 'onfocus', 'onblur'],
  ALLOW_ARIA_ATTR: true
});

// Parse sanitized HTML
const tempContainer = document.createElement('div');
tempContainer.innerHTML = sanitizedHTML;

target.appendChild(tempContainer.firstChild);
```

**مزایا:**
- ✅ امنیت بسیار بالا
- ✅ توسط متخصصین نوشته شده
- ✅ پوشش edge case های زیاد
- ✅ همه عملکرد فعلی حفظ می‌شود

**معایب:**
- ⚠️ نیاز به DOMPurify (22 KB gzipped)
- ⚠️ کمی کندتر (اما همچنان < 5ms)

---

## 5️⃣ تست محافظت

### تست 1: محتوای عادی (باید حفظ شود)

**ورودی:**
```html
<header class="esprit-article__header">
  <h1>عنوان مقاله</h1>
  <p>خلاصه مقاله</p>
</header>
<div class="esprit-article__content">
  <p>متن با <a href="/link">لینک</a> و <strong>متن پررنگ</strong></p>
  <h3>عنوان فرعی</h3>
</div>
```

**خروجی مورد انتظار:**
```html
<!-- همه چیز حفظ شود ✅ -->
<header class="esprit-article__header">
  <h1>عنوان مقاله</h1>
  <p>خلاصه مقاله</p>
</header>
<div class="esprit-article__content">
  <p>متن با <a href="/link">لینک</a> و <strong>متن پررنگ</strong></p>
  <h3>عنوان فرعی</h3>
</div>
```

---

### تست 2: محتوای مخرب (باید پاک شود)

**ورودی:**
```html
<p>متن عادی</p>
<div onclick="alert('XSS')">کلیک کنید</div>
<img src=x onerror="steal()">
<script>malicious()</script>
<a href="javascript:alert('XSS')">لینک مخرب</a>
```

**خروجی مورد انتظار:**
```html
<p>متن عادی</p>
<div>کلیک کنید</div> <!-- onclick حذف شود ✅ -->
<!-- img و script حذف شوند ✅ -->
<a>لینک مخرب</a> <!-- href حذف شود ✅ -->
```

---

### تست 3: کلاس‌های خاص (باید حفظ شود)

**ورودی:**
```html
<div class="accessible-keep">
  <button class="esprit-article-accessibility__reloadPageBtn">
    بازنشانی
  </button>
</div>
<div class="accessible-hidden">محتوای مخفی</div>
```

**خروجی مورد انتظار:**
```html
<!-- همه چیز حفظ شود ✅ -->
<div class="accessible-keep">
  <button class="esprit-article-accessibility__reloadPageBtn">
    بازنشانی
  </button>
</div>
<div class="accessible-hidden">محتوای مخفی</div>
```

---

## 6️⃣ تصمیم‌گیری

### آیا باید الان رفع شود؟

| سناریو | خطر فعلی | نیاز به رفع فوری |
|--------|----------|------------------|
| محتوا داخلی است | کم | ❌ خیر |
| محتوا از API می‌آید | متوسط | ⚠️ پیشنهاد می‌شود |
| محتوا از کاربران می‌آید | بالا | ✅ بله |

### توصیه نهایی:

**🎯 پیاده‌سازی گزینه A (حذف دستی)**

**دلایل:**
1. ✅ بدون dependency اضافی
2. ✅ تأثیر کم روی bundle size
3. ✅ سریع و کارآمد
4. ✅ به اندازه کافی ایمن برای موارد استفاده فعلی
5. ✅ قابل ارتقا به DOMPurify در آینده در صورت نیاز

---

## 7️⃣ کد پیشنهادی برای رفع

```javascript
export function showTextOnly(resetSettings) {
  const textOnlyBtn = document.querySelector("#open-reading-mode");
  if (!textOnlyBtn) return;

  textOnlyBtn.addEventListener("click", function () {
    if (resetSettings) {
      resetSettings();
    }

    const source = document.querySelector(".esprit-article__main-content");
    const target = document.getElementById("modal-reading-mode-content");
    if (!source || !target) return;

    target.innerHTML = "";
    const clone = source.cloneNode(true);

    // حذف تصاویر (فعلی)
    clone.querySelectorAll("img").forEach((img) => img.remove());

    // 🆕 امنیت: حذف event handlers و تگ‌های خطرناک
    secureClonedContent(clone);

    target.appendChild(clone);

    // ادامه کد فعلی (cleanup)...
  });
}

/**
 * امن‌سازی محتوای clone شده
 * @param {HTMLElement} element - المنت برای امن‌سازی
 */
function secureClonedContent(element) {
  const allElements = element.querySelectorAll('*');

  allElements.forEach(el => {
    // حذف تمام event handler attributes
    Array.from(el.attributes).forEach(attr => {
      if (attr.name.startsWith('on')) {
        el.removeAttribute(attr.name);
      }
    });

    // ایمن‌سازی لینک‌ها
    if (el.tagName === 'A' && el.hasAttribute('href')) {
      const href = el.getAttribute('href');
      if (href.trim().toLowerCase().startsWith('javascript:')) {
        el.removeAttribute('href');
      }
    }
  });

  // حذف تگ‌های خطرناک
  element.querySelectorAll('script, iframe, object, embed, form, input, textarea, select').forEach(el => {
    el.remove();
  });
}
```

---

## 8️⃣ مقایسه قبل و بعد

| ویژگی | قبل از رفع | بعد از رفع |
|-------|-----------|-----------|
| محتوای معتبر | ✅ کار می‌کند | ✅ کار می‌کند |
| تصاویر | ✅ حذف می‌شوند | ✅ حذف می‌شوند |
| لینک‌های معتبر | ✅ کار می‌کنند | ✅ کار می‌کنند |
| `onclick` | ⚠️ باقی می‌ماند | ✅ حذف می‌شود |
| `onerror` | ⚠️ باقی می‌ماند | ✅ حذف می‌شود |
| `<script>` | ⚠️ باقی می‌ماند | ✅ حذف می‌شود |
| `<iframe>` | ⚠️ باقی می‌ماند | ✅ حذف می‌شود |
| `javascript:` در href | ⚠️ کار می‌کند | ✅ حذف می‌شود |
| Performance | ✅ سریع | ✅ سریع (< 1ms اضافه) |
| Bundle size | ✅ 0 KB | ✅ 0 KB (بدون dependency) |

---

**آخرین بروزرسانی:** 2025-10-30
**وضعیت:** آماده برای پیاده‌سازی
**توصیه:** رفع پیشگیرانه با گزینه A
