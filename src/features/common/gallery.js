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
import { defaultSettings } from "../../config/settings";

/**
 * Debounce utility function
 * @param {Function} func - Function to debounce
 * @param {number} wait - Delay in milliseconds
 * @returns {Function}
 */
function debounce(func, wait) {
  let timeout;
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}

/**
 * Wait for all images to load
 * @param {HTMLImageElement[]} images - Array of image elements
 * @returns {Promise<void[]>}
 */
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

/**
 * Get image dimensions from data attributes or natural size
 * @param {HTMLImageElement} img - Image element
 * @returns {{width: number, height: number}}
 */
function getImageDimensions(img) {
  const width = parseInt(img.getAttribute("data-width")) || img.naturalWidth || 600;
  const height = parseInt(img.getAttribute("data-height")) || img.naturalHeight || 400;
  return { width, height };
}

/**
 * Reset element styles
 * @param {HTMLElement} element - Element to reset
 */
function resetElementStyles(element) {
  element.style.position = "";
  element.style.top = "";
  element.style.left = "";
  element.style.right = "";
  element.style.width = "";
  element.style.height = "";
}

/**
 * Apply positioning styles to element
 * @param {HTMLElement} element - Element to style
 * @param {Object} box - Box geometry from justifiedLayout
 * @param {boolean} isRTL - Is right-to-left direction
 */
function applyElementStyles(element, box, isRTL) {
  element.style.position = "absolute";
  element.style.top = `${box.top}px`;
  element.style.width = `${box.width}px`;
  element.style.height = `${box.height}px`;

  if (isRTL) {
    element.style.right = `${box.left}px`;
    element.style.left = "auto";
  } else {
    element.style.left = `${box.left}px`;
    element.style.right = "auto";
  }
}

/**
 * Apply image cover styles
 * @param {HTMLImageElement} img - Image element
 */
function applyImageCoverStyles(img) {
  img.style.objectFit = "cover";
  img.style.width = "100%";
  img.style.height = "100%";
}

/**
 * Create justified layout for gallery
 * @param {HTMLElement} galleryElem - Gallery container element
 * @param {HTMLElement[]} items - Gallery item elements
 * @param {HTMLImageElement[]} images - Image elements
 */
function createJustifiedLayout(galleryElem, items, images) {
  const isRTL = isDirectionRTL();
  const settings = defaultSettings.gallery;

  const sizes = images.map(getImageDimensions);

  const geometry = justifiedLayout(sizes, {
    containerWidth: galleryElem.clientWidth,
    boxSpacing: settings.boxSpacing,
    targetRowHeight: settings.targetRowHeight,
    containerPadding: settings.containerPadding
  });

  // Reset all styles first
  items.forEach(resetElementStyles);

  // Apply new styles
  geometry.boxes.forEach((box, i) => {
    const element = items[i];
    const img = element.querySelector("img");
    
    applyElementStyles(element, box, isRTL);
    applyImageCoverStyles(img);
  });

  // Apply container styles
  galleryElem.style.position = "relative";
  galleryElem.style.height = `${geometry.containerHeight}px`;
  galleryElem.style.direction = isRTL ? "rtl" : "ltr";
}

/**
 * Show gallery and hide loader
 * @param {HTMLElement} galleryElem - Gallery element
 * @param {HTMLElement|null} loaderElem - Loader element
 */
function showGallery(galleryElem, loaderElem) {
  if (loaderElem) {
    loaderElem.style.display = "none";
  }
  galleryElem.classList.add("is-visible");
}

/**
 * Initialize lightGallery plugin
 * @param {HTMLElement} galleryElem - Gallery container element
 */
function initLightGallery(galleryElem) {
  const settings = defaultSettings;
  
  const pluginsMap = {
    zoom: lgZoom,
    thumbnail: lgThumbnail,
    fullscreen: lgFullscreen,
    autoplay: lgAutoplay,
    video: lgVideo,
    rotate: lgRotate,
    share: lgShare
  };

  const enabledPlugins = settings.gallery.plugins
    .map(name => pluginsMap[name])
    .filter(Boolean);

  lightGallery(galleryElem, {
    plugins: enabledPlugins,
    selector: ".esprit-article__gallery-item",
    ...settings.lightGallery
  });
}

/**
 * Initialize gallery
 * @param {string} selector - Gallery container selector
 */
export function initGallery(selector = ".esprit-article__gallery") {
  const galleryElem = document.querySelector(selector);
  if (!galleryElem) return;

  const loaderElem = document.getElementById("gallery-loader");

  // Initially hide gallery and show loader
  galleryElem.classList.remove("is-visible");
  if (loaderElem) {
    loaderElem.style.display = "block";
  }

  const items = Array.from(galleryElem.querySelectorAll("a"));
  const images = items.map((el) => el.querySelector("img"));

  // Calculate estimated initial height to prevent layout shift
  const settings = defaultSettings.gallery;
  const containerWidth = galleryElem.clientWidth || galleryElem.parentElement.clientWidth;
  const estimatedItemsPerRow = Math.floor(containerWidth / (settings.targetRowHeight * 1.5));
  const estimatedRows = Math.ceil(items.length / Math.max(estimatedItemsPerRow, 1));
  const estimatedHeight = (estimatedRows * settings.targetRowHeight) + ((estimatedRows - 1) * settings.boxSpacing);

  // Set estimated height to reserve space and prevent scrollbar flash
  galleryElem.style.height = `${estimatedHeight}px`;
  galleryElem.style.position = "relative";

  const layoutGallery = () => createJustifiedLayout(galleryElem, items, images);

  try {
    waitForImages(images)
      .then(() => {
        // Initial layout after images loaded
        layoutGallery();
        
        // Show gallery
        showGallery(galleryElem, loaderElem);

        // Responsive with debounce
        const settings = defaultSettings.gallery;
        window.addEventListener("resize", debounce(layoutGallery, settings.debounceDelay));

        // Initialize lightGallery
        if (settings.enableLightbox) {
          initLightGallery(galleryElem);
        }
      })
      .catch((err) => {
        console.error("Gallery failed to load:", err);
        if (loaderElem) {
          loaderElem.textContent = "Error loading gallery";
        }
      });
  } catch (err) {
    console.error("Gallery initialization error:", err);
  }
}