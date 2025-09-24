// helper: تبدیل Blob به data URL
function blobToDataURL(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Failed to read blob'));
    reader.onload = () => resolve(reader.result);
    reader.readAsDataURL(blob);
  });
}

// helper: رسم تصویر روی canvas و گرفتن dataURL (fallback)
function imageToDataURL(img) {
  return new Promise((resolve, reject) => {
    try {
      const canvas = document.createElement('canvas');
      const w = img.naturalWidth || img.width || 1;
      const h = img.naturalHeight || img.height || 1;
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, w, h);
      const dataUrl = canvas.toDataURL('image/png');
      resolve(dataUrl);
    } catch (err) {
      reject(err);
    }
  });
}

// فانکشن اصلی پرینت با متادیتا
export async function printPDFContent() {
  const content = document.getElementById('pdf-content');
  if (!content) {
    alert('عنصر مورد نظر پیدا نشد!');
    return;
  }

  // 1) ساخت iframe مخفی
  const iframe = document.createElement('iframe');
  iframe.style.position = 'fixed';
  iframe.style.right = '0';
  iframe.style.bottom = '0';
  iframe.style.width = '0';
  iframe.style.height = '0';
  iframe.style.border = '0';
  iframe.style.overflow = 'hidden';
  iframe.setAttribute('aria-hidden', 'true');
  document.body.appendChild(iframe);

  const idoc = iframe.contentDocument || iframe.contentWindow.document;
  idoc.open();
  idoc.write('<!doctype html><html><head><meta charset="utf-8"><title>Print</title></head><body></body></html>');
  idoc.close();

  // 2) درج استایل مخصوص پرینت
  const style = idoc.createElement('style');
  style.textContent = `
    @media print {
      body { font-family: Vazir, sans-serif; margin: 20px; color: #1a1a1a; direction: rtl; line-height: 1.6; }
      .esprit-article { font-size: 1em; }
      .esprit-article__image-wrapper { float: left; border-radius: 8px; overflow: hidden; width: 44%; max-width: 396px; aspect-ratio: 396/264; box-shadow: 0px 12px 16px -4px rgba(10,13,18,0.08), 0px 4px 6px -2px rgba(10,13,18,0.03); margin: 0 24px 24px 0; }
      .esprit-article__image-wrapper img { width: 100%; height: 100%; object-fit: cover; }
      .esprit-article__title, h1,h2,h3,h4,h5,h6 { font-size: 16px !important; font-weight: 700 !important; margin: 12px 0 8px 0; line-height: 1.4; }
      .esprit-article__paragraph { text-align: justify; color: #1a1a1a; font-size: 16px; font-weight: 400; margin: 0 0 8px 0; line-height: 1.6; }
      .esprit-article__paragraph a { text-decoration: underline; color: #1a1a1a; transition: all 0.3s ease; }
      img { max-width: 100%; height: auto !important; page-break-inside: avoid; }
      h2,h3,h4,h5,h6 { page-break-after: avoid; }
      /* متادیتا */
      .print-meta { border-top:1px solid #ccc; margin-top:20px; padding-top:10px; font-size:14px; color:#555; }
      .print-meta .meta-item { margin-bottom:4px; }
      .print-meta .meta-label { font-weight:700; margin-left:4px; }
      .print-meta i { display:none; }
    }
  `;
  idoc.head.appendChild(style);

  // 3) کلون کردن محتوا
  const clone = content.cloneNode(true);

  // 4) آماده‌سازی تصاویر داخل clone
  const originalImgs = content.querySelectorAll('img');
  const cloneImgs = clone.querySelectorAll('img');

  const imagePromises = Array.from(cloneImgs).map(async (clonedImg, idx) => {
    const orig = originalImgs[idx];
    const src = (orig && orig.src) ? orig.src : (clonedImg.src || '');
    clonedImg.setAttribute('data-original-src', src || '');

    if (!src) return Promise.resolve();

    if (src.startsWith('blob:')) {
      try {
        const resp = await fetch(src);
        const blob = await resp.blob();
        const dataUrl = await blobToDataURL(blob);
        clonedImg.src = dataUrl;
      } catch {
        try {
          if (orig) {
            const dataUrl = await imageToDataURL(orig);
            clonedImg.src = dataUrl;
          } else {
            clonedImg.src = src;
          }
        } catch {
          clonedImg.src = src;
        }
      }
    } else {
      clonedImg.src = src;
    }

    return new Promise(resolve => {
      if (clonedImg.complete && clonedImg.naturalWidth !== 0) resolve();
      else { clonedImg.onload = () => resolve(); clonedImg.onerror = () => resolve(); }
    });
  });

  await Promise.all(imagePromises);

  // 5) اضافه کردن متادیتا زیر محتوا
  const metaContainer = document.createElement('div');
  metaContainer.className = 'print-meta';

  // متادیتای نویسنده
  const authorMeta = document.querySelector('.esprit-article-info');
  if (authorMeta) {
    const fields = [
      { label: 'نویسنده', selector: '#author' },
      { label: 'تاریخ انتشار', selector: '#publish-date' },
      { label: 'تعداد بازدید', selector: '#views' },
      { label: 'زمان مطالعه', selector: '#reading-time' },
      { label: 'عکاس', selector: '#photographer' },
      { label: 'فیلمبردار', selector: '#videographer' },
      { label: 'تدوین‌گر', selector: '#editor' },
    ];
    fields.forEach(f => {
      const span = authorMeta.querySelector(f.selector);
      if (span) {
        const div = document.createElement('div');
        div.className = 'meta-item';
        div.innerHTML = `<span class="meta-label">${f.label}:</span> <span>${span.textContent}</span>`;
        metaContainer.appendChild(div);
      }
    });
  }

  // متادیتای اضافی
  const otherMeta = document.querySelector('.esprit-article__metadata');
  if (otherMeta) {
    otherMeta.querySelectorAll('.esprit-article__metadata-item').forEach(item => {
      const label = item.querySelector('.esprit-article__metadata-item-label')?.textContent || '';
      const value = item.querySelector('.esprit-article__metadata-item-value')?.textContent || '';
      if (label && value) {
        const div = document.createElement('div');
        div.className = 'meta-item';
        div.innerHTML = `<span class="meta-label">${label}:</span> <span>${value}</span>`;
        metaContainer.appendChild(div);
      }
    });
  }

  clone.appendChild(metaContainer);

   // تبدیل همه‌ی تصاویر کلون‌شده به DataURL
async function ensureImagesAsDataURL(container) {
  const imgs = container.querySelectorAll("img");
  const promises = Array.from(imgs).map(img => {
    return new Promise(resolve => {
      const src = img.src;
      if (!src) return resolve();

      // اگر blob یا relative هست، با canvas به dataURL تبدیل کن
      const image = new Image();
      image.crossOrigin = "anonymous";
      image.onload = function() {
        try {
          const canvas = document.createElement("canvas");
          canvas.width = image.naturalWidth;
          canvas.height = image.naturalHeight;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(image, 0, 0);
          img.src = canvas.toDataURL("image/png");
        } catch (e) {
          // fallback: همون src بمونه
          img.src = src;
        }
        resolve();
      };
      image.onerror = () => resolve();
      image.src = src;
    });
  });
  await Promise.all(promises);
}

  // 5) الصاق کلون به body iframe
await ensureImagesAsDataURL(clone);
idoc.body.appendChild(clone);

  // 7) صبر برای فونت‌ها (اختیاری)
  try { if (idoc.fonts && idoc.fonts.ready) await idoc.fonts.ready; } catch {}

  // 8) پرینت و cleanup
  const win = iframe.contentWindow;
  const cleanup = () => { try { if (iframe && iframe.parentNode) iframe.parentNode.removeChild(iframe); } catch {} };
  win.onafterprint = () => { cleanup(); win.onafterprint = null; };
  setTimeout(cleanup, 3000);

  win.focus();
  try { win.print(); } catch (e) { console.error('print failed', e); }
}

// init
export function initPrintNewsContent() {
  const button = document.getElementById('print-content');
  if (button) {
    button.addEventListener('click', () => {
      printPDFContent().catch(err => console.error(err));
    });
  }
}
