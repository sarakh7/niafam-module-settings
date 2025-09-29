import noUiSlider from "nouislider";
import "nouislider/dist/nouislider.css";

function createSlider(id, start, callback) {
  const slider = document.getElementById(id);
  let hasInteracted = false;

  noUiSlider.create(slider, {
    start: [start],
    connect: [true, false],
    range: {
      min: 0,
      max: 100,
    },
    step: 1,
    tooltips: {
      to: (value) => Math.round(value) + "%",
      from: (value) => Number(value.replace("%", "")),
    },
    pips: {
      mode: "positions",
      values: [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
      density: 10,
      format: {
        to: (value) => Math.round(value) + "%",
      },
    },
  });

  // Only run the callback when the user interacts.
  slider.noUiSlider.on(
    "update",
    function (values, handle, unencoded, tap, positions) {
      if (!hasInteracted) return;
      const percentValue = parseFloat(values[handle]);
      callback(percentValue);
    }
  );

  // Activate the flag when the user touches (changes) the slider.
  slider.noUiSlider.on("start", function () {
    hasInteracted = true;
  });
}

function oldShowTextOnly() {
  const textOnlyBtn = document.querySelector(
    ".esprit-article-accessibility__text-only"
  );

  if (!textOnlyBtn) return;

  textOnlyBtn.addEventListener("click", function () {
    document.getElementById("reloadPageBtn").classList.add("active");

    const container = document.querySelector(".page-content-main__article");
    if (!container) return;

    container.removeAttribute("class");

    const allElements = container.querySelectorAll("*");
    const keepClasses = [
      "accessible-keep",
      "accessible-hidden",
      "esprit-article-accessibility__reloadPageBtn",
    ]; // لیست کلاس‌هایی که نباید حذف بشن

    // مرحله ۱: مشخص‌کردن المان‌هایی که باید حفظ شوند
    const protectedElements = new Set();
    const keepRoots = container.querySelectorAll(".accessible-keep");
    keepRoots.forEach((el) => {
      protectedElements.add(el);
      const descendants = el.querySelectorAll("*");
      descendants.forEach((child) => protectedElements.add(child));
    });

    // مرحله ۳: حذف کلاس‌ها و ویژگی‌ها از بقیه عناصر
    allElements.forEach((el) => {
      if (protectedElements.has(el)) return;

      const kept = [...el.classList].filter((cls) => keepClasses.includes(cls));
      el.className = kept.join(" ");

      el.removeAttribute("style");
      el.removeAttribute("role");
      el.removeAttribute("aria-label");
      el.removeAttribute("aria-hidden");
      el.removeAttribute("tabindex");
    });

    // مرحله ۲: پنهان‌سازی المان‌هایی که باید مخفی شوند
    const hiddenElements = container.querySelectorAll(".accessible-hidden");
    hiddenElements.forEach((el) => {
      el.style.display = "none";
    });
  });

  document
    .getElementById("reloadPageBtn")
    .addEventListener("click", function () {
      location.reload();
    });
}

function showTextOnly() {
  const textOnlyBtn = document.querySelector(
    ".esprit-article-accessibility__text-only"
  );

  if (!textOnlyBtn) return;

  textOnlyBtn.addEventListener("click", function () {
    const source = document.querySelector(".esprit-article__main-content");
    const target = document.getElementById("modal-reading-mode-content");

    if (!source || !target) return;

    // هر بار جایگزینی کامل
    target.innerHTML = "";
    const clone = source.cloneNode(true);

    // حذف همه عکس‌ها
    clone.querySelectorAll("img").forEach((img) => img.remove());

    target.appendChild(clone);

    // حالا روی نسخه‌ی کپی‌شده تمیزکاری انجام می‌دیم
    const allElements = target.querySelectorAll("*");
    const keepClasses = [
      "accessible-keep",
      "accessible-hidden",
      "esprit-article-accessibility__reloadPageBtn",
    ]; // لیست کلاس‌هایی که نباید حذف بشن

    // مشخص کردن المان‌هایی که باید حفظ بشن
    const protectedElements = new Set();
    const keepRoots = target.querySelectorAll(".accessible-keep");
    keepRoots.forEach((el) => {
      protectedElements.add(el);
      const descendants = el.querySelectorAll("*");
      descendants.forEach((child) => protectedElements.add(child));
    });

    // حذف کلاس‌ها و ویژگی‌ها از بقیه عناصر
    allElements.forEach((el) => {
      if (protectedElements.has(el)) return;

      const kept = [...el.classList].filter((cls) => keepClasses.includes(cls));
      el.className = kept.join(" ");

      el.removeAttribute("style");
      el.removeAttribute("role");
      el.removeAttribute("aria-label");
      el.removeAttribute("aria-hidden");
      el.removeAttribute("tabindex");
    });

    // پنهان‌سازی المان‌های خاص
    const hiddenElements = target.querySelectorAll(".accessible-hidden");
    hiddenElements.forEach((el) => {
      el.style.display = "none";
    });
  });
}

function initAccessibilitySliders(
  containerSelector = "body",
  sliders = {
    fontSizeSlider: "fontSizeSlider",
    wordSpacingSlider: "wordSpacingSlider",
    lineHeightSlider: "lineHeightSlider",
  }
) {
  const newsContainer = document.querySelector(containerSelector);
  console.log(containerSelector, newsContainer);

  // 1. Get the parent element's font size in pixels
  const parentFontSizePx = parseFloat(
    getComputedStyle(newsContainer.parentElement).fontSize
  );

  // 2. Get the current container font size in pixels
  const containerFontSizePx = parseFloat(
    getComputedStyle(newsContainer).fontSize
  );

  // 3. Calculate container's font size in em relative to parent
  const containerFontSizeEm = containerFontSizePx / parentFontSizePx;

  // 4. Define min and max em values
  const minFontEm = 0.75; // ~12px if base is 16px
  const maxFontEm = 1.875; // ~30px if base is 16px

  // 5. Calculate initial percentage for slider based on current em
  const initialFontPercent =
    ((containerFontSizeEm - minFontEm) / (maxFontEm - minFontEm)) * 100;

  // Word spacing setup
  const minWordSpacing = 0;
  const maxWordSpacing = 10;
  const computedWordSpacing = parseFloat(
    getComputedStyle(newsContainer).wordSpacing
  );
  const initialWordSpacingPercent =
    ((computedWordSpacing - minWordSpacing) /
      (maxWordSpacing - minWordSpacing)) *
    100;

  // Line height setup
  const minLineHeight = 1;
  const maxLineHeight = 3;
  const computedLineHeight =
    parseFloat(getComputedStyle(newsContainer).lineHeight) || 1.5;
  const initialLineHeightPercent =
    ((computedLineHeight - minLineHeight) / (maxLineHeight - minLineHeight)) *
    100;

  // Create article sliders
  createSlider(sliders.fontSizeSlider, initialFontPercent, function (value) {
    const em = minFontEm + ((maxFontEm - minFontEm) * value) / 100;
    const roundedFontSizeEm = Math.ceil(em * 1000) / 1000; // round up to 3 decimal places
    newsContainer.style.fontSize = roundedFontSizeEm + "em";
  });

  createSlider(
    sliders.wordSpacingSlider,
    initialWordSpacingPercent,
    function (value) {
      const px =
        minWordSpacing + ((maxWordSpacing - minWordSpacing) * value) / 100;
      newsContainer.style.wordSpacing = px + "px";
    }
  );

  createSlider(
    sliders.lineHeightSlider,
    initialLineHeightPercent,
    function (value) {
      const lh =
        minLineHeight + ((maxLineHeight - minLineHeight) * value) / 100;
      newsContainer.style.lineHeight = lh;
    }
  );

}

export function initAccessibilityActions() {
  // Create article sliders
  initAccessibilitySliders(".esprit-article__main-content");
  // Create reading mode modal sliders
  initAccessibilitySliders("#modal-reading-mode-content", {
    fontSizeSlider: "reading-mode-fontSizeSlider",
    wordSpacingSlider: "reading-mode-wordSpacingSlider",
    lineHeightSlider: "reading-mode-lineHeightSlider",
  });
  // Handle button toggling
  const buttons = document.querySelectorAll(
    ".es-article-accessibility-control-btn"
  );
  buttons.forEach((button) => {
    button.addEventListener("click", (e) => {
      buttons.forEach((btn) => btn.classList.remove("active"));
      e.currentTarget.classList.add("active");
    });
  });

  showTextOnly();
}
