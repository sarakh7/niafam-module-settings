import lightGallery from "lightgallery";
import lgZoom from "lightgallery/plugins/zoom";
import lgThumbnail from "lightgallery/plugins/thumbnail";
import lgFullscreen from "lightgallery/plugins/fullscreen";
import lgAutoplay from "lightgallery/plugins/autoplay";
import lgVideo from "lightgallery/plugins/video";
import lgRotate from "lightgallery/plugins/rotate";
import lgShare from "lightgallery/plugins/share";
import justifiedLayout from "justified-layout";

import "lightgallery/css/lightgallery.css";
import "lightgallery/css/lg-zoom.css";
import "lightgallery/css/lg-thumbnail.css";
import "lightgallery/css/lg-fullscreen.css";
import "lightgallery/css/lg-autoplay.css";
import "lightgallery/css/lg-video.css";
import "lightgallery/css/lg-rotate.css";
import "lightgallery/css/lg-share.css";

import { isDirectionRTL } from "./language";

//  Debounce Utility
function debounce(func, wait) {
  let timeout;
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}

//  Load all images
function waitForImages(images) {
  return Promise.all(
    images.map((img) =>
      img.complete
        ? Promise.resolve()
        : new Promise((res) => {
            img.onload = img.onerror = res;
          })
    )
  );
}

export function initGallery(selector = ".esprit-article__gallery") {
  const galleryElem = document.querySelector(selector);
  if (!galleryElem) return;

  const loaderElem = document.getElementById("gallery-loader");
  galleryElem.style.visibility = "hidden";
  if (loaderElem) loaderElem.style.display = "block";

  const isRTL = isDirectionRTL();
  const items = Array.from(galleryElem.querySelectorAll("a"));
  const images = items.map((el) => el.querySelector("img"));

  const layoutGallery = () => {
    const sizes = images.map((img) => {
      const width =
        parseInt(img.getAttribute("data-width")) || img.naturalWidth || 600;
      const height =
        parseInt(img.getAttribute("data-height")) || img.naturalHeight || 400;
      return { width, height };
    });

    const geometry = justifiedLayout(sizes, {
      containerWidth: galleryElem.clientWidth,
      boxSpacing: 5,
      targetRowHeight: 200,
    });

    items.forEach((el) => {
      el.style.position = "";
      el.style.top = "";
      el.style.left = "";
      el.style.right = "";
      el.style.width = "";
      el.style.height = "";
    });

    geometry.boxes.forEach((box, i) => {
      const el = items[i];
      el.style.position = "absolute";

      if (isRTL) {
        el.style.right = `${box.left}px`;
        el.style.left = "auto";
      } else {
        el.style.left = `${box.left}px`;
        el.style.right = "auto";
      }

      el.style.top = `${box.top}px`;
      el.style.width = `${box.width}px`;
      el.style.height = `${box.height}px`;

      const img = el.querySelector("img");
      img.style.objectFit = "cover";
      img.style.width = "100%";
      img.style.height = "100%";
    });

    galleryElem.style.position = "relative";
    galleryElem.style.height = `${geometry.containerHeight}px`;
    galleryElem.style.direction = isRTL ? "rtl" : "ltr";
  };

  try {
    // galleryElem.style.visibility = "hidden"; // حذف کن
    galleryElem.classList.remove("is-visible"); // اگه قبلاً ست شده باشه

    waitForImages(images).then(() => {
      layoutGallery(); // initial layout after images loaded

      galleryElem.classList.add("is-visible");

      if (loaderElem) loaderElem.style.display = "none";

      // نمایش گالری، مخفی کردن لودر
      if (loaderElem) loaderElem.style.display = "none";
      galleryElem.style.visibility = "visible";
      galleryElem.classList.add("visible"); // اضافه کردن opacity: 1 با ترنزیشن

      //  Responsive with Debounce
      window.addEventListener("resize", debounce(layoutGallery, 200));

      // Init lightGallery
      lightGallery(galleryElem, {
        plugins: [
          lgZoom,
          lgThumbnail,
          lgFullscreen,
          lgAutoplay,
          lgVideo,
          lgRotate,
          lgShare,
        ],
        selector: ".esprit-article__gallery-item",
        download: false,
        counter: false,
        enableDrag: false,
        enableSwipe: false,
      });
    });
  } catch (err) {
    console.error("گالری بارگذاری نشد:", err);
  }
}
