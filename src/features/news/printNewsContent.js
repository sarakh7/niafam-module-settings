import i18next from "../../config/i18n";
import { getDirectionFromHTML } from "../../config/settings";

/**
 * Convert Blob to data URL
 * @param {Blob} blob - Blob object
 * @returns {Promise<string>} Data URL
 */
function blobToDataURL(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Failed to read blob"));
    reader.onload = () => resolve(reader.result);
    reader.readAsDataURL(blob);
  });
}

/**
 * Draw image on canvas and convert to data URL
 * @param {HTMLImageElement} img - Image element
 * @returns {Promise<string>} Data URL
 */
function imageToDataURL(img) {
  return new Promise((resolve, reject) => {
    try {
      const canvas = document.createElement("canvas");
      const w = img.naturalWidth || img.width || 1;
      const h = img.naturalHeight || img.height || 1;

      // Limit size to prevent crash
      const maxSize = 2048;
      let finalW = w,
        finalH = h;

      if (w > maxSize || h > maxSize) {
        const scale = Math.min(maxSize / w, maxSize / h);
        finalW = Math.floor(w * scale);
        finalH = Math.floor(h * scale);
      }

      canvas.width = finalW;
      canvas.height = finalH;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, finalW, finalH);
      const dataUrl = canvas.toDataURL("image/png");
      resolve(dataUrl);
    } catch (err) {
      reject(err);
    }
  });
}

/**
 * Create safe metadata item element
 * @param {string} label - Label text
 * @param {string} value - Value text
 * @returns {HTMLElement|null} Metadata element or null
 */
function createSafeMetaItem(label, value) {
  if (!label || !value) return null;

  const div = document.createElement("div");
  div.className = "meta-item";

  const labelSpan = document.createElement("span");
  labelSpan.className = "meta-label";
  labelSpan.textContent = label + ":";

  const valueSpan = document.createElement("span");
  valueSpan.textContent = " " + value;

  div.appendChild(labelSpan);
  div.appendChild(valueSpan);

  return div;
}

/**
 * Main print function - simplified version
 * @returns {Promise<void>}
 */
export async function printPDFContent() {
  console.log("Starting print process...");

  const content = document.getElementById("pdf-content");
  if (!content) {
    alert(i18next.t("print.contentNotFound"));
    return;
  }

  // 1) Create iframe
  const iframe = document.createElement("iframe");
  iframe.style.cssText =
    "position:fixed; right:0; bottom:0; width:0; height:0; border:0; overflow:hidden;";
  iframe.setAttribute("aria-hidden", "true");
  document.body.appendChild(iframe);

  try {
    const idoc = iframe.contentDocument;

    // Get current direction from settings
    const currentDirection = getDirectionFromHTML();
    const isRTL = currentDirection === 'rtl';

    // 2) Write base HTML
    idoc.open();
    idoc.write(
      '<!doctype html><html><head><meta charset="utf-8"><title>Print</title></head><body></body></html>'
    );
    idoc.close();

    // 3) Add styles
    const style = idoc.createElement("style");
    style.textContent = `
      @media print {
        body {
          font-family: Vazir, Tahoma, Arial, sans-serif;
          margin: 20px;
          color: #1a1a1a;
          direction: ${currentDirection};
          line-height: 1.6;
        }
        .esprit-article { font-size: 1em; }
        .esprit-article__image-wrapper {
          float: ${isRTL ? 'left' : 'right'};
          border-radius: 8px;
          overflow: hidden;
          width: 44%;
          max-width: 396px;
          aspect-ratio: 396/264;
          box-shadow: 0px 12px 16px -4px rgba(10,13,18,0.08);
          margin: ${isRTL ? '0 24px 24px 0' : '0 0 24px 24px'};
        }
        .esprit-article__image-wrapper img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .esprit-article__title, h1,h2,h3,h4,h5,h6 {
          font-size: 16px !important;
          font-weight: 700 !important;
          margin: 12px 0 8px 0;
          line-height: 1.4;
        }
        .esprit-article__paragraph {
          text-align: justify;
          color: #1a1a1a;
          font-size: 16px;
          font-weight: 400;
          margin: 0 0 8px 0;
          line-height: 1.6;
        }
        .esprit-article__paragraph a {
          text-decoration: underline;
          color: #1a1a1a;
        }
        img {
          max-width: 100%;
          height: auto !important;
          page-break-inside: avoid;
        }
        h2,h3,h4,h5,h6 {
          page-break-after: avoid;
        }
        .print-meta {
          border-top:1px solid #ccc;
          margin-top:20px;
          padding-top:10px;
          font-size:14px;
          color:#555;
        }
        .meta-item {
          margin-bottom:4px;
        }
        .meta-label {
          font-weight:700;
          ${isRTL ? 'margin-left:4px;' : 'margin-right:4px;'}
        }
      }
    `;
    idoc.head.appendChild(style);

    // 4) Clone content
    const clone = content.cloneNode(true);

    // 5) Process images - simplified
    const originalImgs = content.querySelectorAll("img");
    const cloneImgs = clone.querySelectorAll("img");

    console.log(`Processing ${cloneImgs.length} images...`);

    // Process images one by one
    for (let i = 0; i < cloneImgs.length; i++) {
      const clonedImg = cloneImgs[i];
      const originalImg = originalImgs[i];

      try {
        const src =
          originalImg && originalImg.src ? originalImg.src : clonedImg.src;
        if (!src) continue;

        clonedImg.setAttribute("data-original-src", src);

        if (src.startsWith("blob:")) {
          try {
            const resp = await fetch(src);
            const blob = await resp.blob();
            const dataUrl = await blobToDataURL(blob);
            clonedImg.src = dataUrl;
          } catch (e) {
            console.warn("Blob conversion failed, trying canvas method:", e);
            if (originalImg) {
              const dataUrl = await imageToDataURL(originalImg);
              clonedImg.src = dataUrl;
            }
          }
        } else {
          clonedImg.src = src;
        }

        // Wait for load
        await new Promise((resolve) => {
          if (clonedImg.complete) {
            resolve();
          } else {
            clonedImg.onload = resolve;
            clonedImg.onerror = resolve;
            setTimeout(resolve, 3000); // timeout
          }
        });
      } catch (e) {
        console.warn(`Image ${i} processing failed:`, e);
      }
    }

    // 6) Add metadata
    const metaContainer = document.createElement("div");
    metaContainer.className = "print-meta";

    // Author metadata
    const authorMeta = document.querySelector(".esprit-article-info");
    if (authorMeta) {
      const fields = [
        { labelKey: i18next.t('metadata.author'), selector: "#author" },
        { labelKey: i18next.t("metadata.publishDate"), selector: "#publish-date" },
        { labelKey: i18next.t("metadata.views"), selector: "#views" },
        { labelKey: i18next.t("metadata.readingTime"), selector: "#reading-time" },
        { labelKey: i18next.t("metadata.photographer"), selector: "#photographer" },
        { labelKey: i18next.t("metadata.videographer"), selector: "#videographer" },
        { labelKey: i18next.t("metadata.editor"), selector: "#editor" },
      ];

      fields.forEach((field) => {
        const span = authorMeta.querySelector(field.selector);
        if (span && span.textContent && span.textContent.trim()) {
          const label = i18next.t(field.labelKey);
          const metaItem = createSafeMetaItem(label, span.textContent.trim());
          if (metaItem) metaContainer.appendChild(metaItem);
        }
      });
    }

    // Additional metadata
    const otherMeta = document.querySelector(".esprit-article__metadata");
    if (otherMeta) {
      otherMeta
        .querySelectorAll(".esprit-article__metadata-item")
        .forEach((item) => {
          const label = item.querySelector(
            ".esprit-article__metadata-item-label"
          );
          const value = item.querySelector(
            ".esprit-article__metadata-item-value"
          );

          if (label && value && label.textContent && value.textContent) {
            const metaItem = createSafeMetaItem(
              label.textContent.trim(),
              value.textContent.trim()
            );
            if (metaItem) metaContainer.appendChild(metaItem);
          }
        });
    }

    clone.appendChild(metaContainer);

    // 7) Add to iframe
    idoc.body.appendChild(clone);

    console.log("Content added to iframe, preparing to print...");

    // 8) Print
    const win = iframe.contentWindow;

    // cleanup function
    const cleanup = () => {
      try {
        if (iframe && iframe.parentNode) {
          iframe.parentNode.removeChild(iframe);
        }
      } catch (e) {
        console.error("Cleanup failed:", e);
      }
    };

    // Setup cleanup
    win.onafterprint = cleanup;
    setTimeout(cleanup, 5000);

    // Focus and print
    win.focus();

    // Wait for content to fully load
    setTimeout(() => {
      console.log("Opening print dialog...");
      win.print();
    }, 500);
  } catch (error) {
    console.error("Print failed:", error);
    alert("خطا در پرینت: " + error.message);

    // Cleanup on error
    try {
      if (iframe && iframe.parentNode) {
        iframe.parentNode.removeChild(iframe);
      }
    } catch (e) {
      console.error("Error cleanup failed:", e);
    }
  }
}

/**
 * Initialize print news content functionality
 * @returns {void}
 */
/**
 * Initialize print news content functionality
 * @returns {void}
 */
export function initPrintNewsContent() {
  const button = document.getElementById("print-content");

  if (!button) {
    console.warn("Print button not found: #print-content");
    return;
  }

  button.addEventListener("click", (e) => {
    e.preventDefault();

    printPDFContent().catch((err) => {
      console.error("Print function error:", err);
      alert(i18next.t("print.error") + ": " + err.message);
    });
  });
}
