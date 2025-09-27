export function setShareLinks(text = "") {
    const currentUrl = encodeURIComponent(window.location.href); // گرفتن لینک جاری و encode کردن
    const shareText = encodeURIComponent(text); // متن دلخواه (اختیاری)

    // گرفتن دکمه‌ها
    const fb = document.querySelector("#shareto-facebook");
    const tw = document.querySelector("#shareto-twitter");
    const tg = document.querySelector("#shareto-telegram");
    const wa = document.querySelector("#shareto-whatsapp");

    // آپدیت کردن لینک‌ها
    if (fb) fb.href = `https://www.facebook.com/sharer/sharer.php?u=${currentUrl}`;
    if (tw) tw.href = `https://twitter.com/intent/tweet?url=${currentUrl}&text=${shareText}`;
    if (tg) tg.href = `https://t.me/share/url?url=${currentUrl}&text=${shareText}`;
    if (wa) wa.href = `https://api.whatsapp.com/send?text=${shareText}%20${currentUrl}`;
  }