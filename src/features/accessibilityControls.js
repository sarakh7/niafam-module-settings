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

function showTextOnly(resetSettings) {
  const textOnlyBtn = document.querySelector("#open-reading-mode");

  if (!textOnlyBtn) return;

  textOnlyBtn.addEventListener("click", function () {
    if (resetSettings) {
      resetSettings();
    }

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
  if (!newsContainer) return;

  // store محلی: کلیدها همان نام property های sliders هستند
  const localSlidersStore = {};

  function createLocalSlider(name, id, start, callback) {
    const slider = document.getElementById(id);
    if (!slider) return;

    let hasInteracted = false;

    noUiSlider.create(slider, {
      start: [start],
      connect: [true, false],
      range: { min: 0, max: 100 },
      step: 1,
      tooltips: {
        to: (value) => Math.round(value) + "%",
        from: (value) => Number(value.replace("%", "")),
      },
      pips: {
        mode: "positions",
        values: [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
        density: 10,
        format: { to: (value) => Math.round(value) + "%" },
      },
    });

    slider.noUiSlider.on("update", (values, handle) => {
      if (!hasInteracted) return;
      callback(parseFloat(values[handle]));
    });

    slider.noUiSlider.on("start", () => {
      hasInteracted = true;
    });

    // ذخیره با کلید نام property، نه id
    localSlidersStore[name] = { slider, initial: start, callback };
  }

  function resetSlider(name) {
    const entry = localSlidersStore[name];
    if (!entry) return;
    entry.slider.noUiSlider.set(entry.initial);
    entry.callback(entry.initial);
  }

  function resetAllSliders() {
    Object.keys(localSlidersStore).forEach(resetSlider);
  }

  // محاسبه مقادیر اولیه
  const parentFontSizePx = parseFloat(
    getComputedStyle(newsContainer.parentElement).fontSize
  );
  const containerFontSizePx = parseFloat(
    getComputedStyle(newsContainer).fontSize
  );
  const containerFontSizeEm = containerFontSizePx / parentFontSizePx;

  const minFontEm = 0.75,
    maxFontEm = 1.875;
  const initialFontPercent =
    ((containerFontSizeEm - minFontEm) / (maxFontEm - minFontEm)) * 100;

  const minWordSpacing = 0,
    maxWordSpacing = 10;
  const computedWordSpacing =
    parseFloat(getComputedStyle(newsContainer).wordSpacing) || 0;
  const initialWordSpacingPercent =
    ((computedWordSpacing - minWordSpacing) /
      (maxWordSpacing - minWordSpacing)) *
    100;

  const minLineHeight = 1,
    maxLineHeight = 3;
  // const computedLineHeight =
  //   parseFloat(getComputedStyle(newsContainer).lineHeight) || 1.5;
  const computedLineHeightPx = parseFloat(
    getComputedStyle(newsContainer).lineHeight
  );
  const computedFontSizePx = parseFloat(
    getComputedStyle(newsContainer).fontSize
  );

  // محاسبه line-height نسبی
  const computedLineHeight =
    computedLineHeightPx && computedFontSizePx
      ? computedLineHeightPx / computedFontSizePx
      : 1.5;

  const initialLineHeightPercent =
    ((computedLineHeight - minLineHeight) / (maxLineHeight - minLineHeight)) *
    100;

  // ایجاد اسلایدرها با نام property
  createLocalSlider(
    "fontSizeSlider",
    sliders.fontSizeSlider,
    initialFontPercent,
    (value) => {
      const em = minFontEm + ((maxFontEm - minFontEm) * value) / 100;
      newsContainer.style.fontSize = Math.ceil(em * 1000) / 1000 + "em";
    }
  );

  createLocalSlider(
    "wordSpacingSlider",
    sliders.wordSpacingSlider,
    initialWordSpacingPercent,
    (value) => {
      const px =
        minWordSpacing + ((maxWordSpacing - minWordSpacing) * value) / 100;
      newsContainer.style.wordSpacing = px + "px";
    }
  );

  createLocalSlider(
    "lineHeightSlider",
    sliders.lineHeightSlider,
    initialLineHeightPercent,
    (value) => {
      const lh =
        minLineHeight + ((maxLineHeight - minLineHeight) * value) / 100;
      newsContainer.style.lineHeight = lh;
    }
  );

  // بازگرداندن توابع ریست برای استفاده خارجی
  return { resetSlider, resetAllSliders };
}

function HandleButtonToggling(containerSelector) {
  console.log("containerSelector", containerSelector);
  // ابتدا کانتینر اسلایدرها
  const container = document.querySelector(containerSelector);
  console.log("containerSelector", containerSelector, container);

  if (!container) return;

  // دکمه‌ها فقط در همان کانتینر
  const buttons = container.querySelectorAll(
    ".es-article-accessibility-control-btn"
  );

  buttons.forEach((button) => {
    button.addEventListener("click", (e) => {
      // حذف کلاس active فقط در همان کانتینر
      buttons.forEach((btn) => btn.classList.remove("active"));
      e.currentTarget.classList.add("active");
    });
  });
}

export function initBackgroundColorDropdown(
  containerSelector,
  dropdownSelector
) {
  const container = document.querySelector(containerSelector);
  const dropdown = document.querySelector(dropdownSelector);
  if (!container || !dropdown) return;

  const toggleBtn = dropdown.querySelector(".accessibility-bg-dropdown-toggle");
  const menu = dropdown.querySelector(".accessibility-bg-dropdown-menu");

  // باز و بسته کردن منو
  toggleBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    dropdown.classList.toggle("accessibility-bg-dropdown-open");
  });

  document.addEventListener("click", (e) => {
    if (!dropdown.contains(e.target)) {
      dropdown.classList.remove("accessibility-bg-dropdown-open");
    }
  });

  // کلیک روی گزینه‌ها
  menu.querySelectorAll("li").forEach((item) => {
    const color = item.dataset.color;
    const bgColor = item.dataset.bg;
    // رنگ رو به صورت CSS variable ذخیره کن
    item.style.setProperty("--color-circle", bgColor);
    item.style.setProperty("--color-circle-text", color);

    item.addEventListener("click", () => {
      container.style.backgroundColor = bgColor;
      container.style.color = color;
      toggleBtn.style.backgroundColor = bgColor;
      toggleBtn.style.color = color;
      dropdown.classList.remove("accessibility-bg-dropdown-open");
    });
  });

  // بستن منو با کلیک بیرون
  document.addEventListener("click", (e) => {
    if (!dropdown.contains(e.target)) {
      dropdown.classList.remove("dropdown-open");
    }
  });

  return {
    reset: (defaultColor = "#1f1f1fff", defaultBgColor = "#ffffffff") => {
      container.style.backgroundColor = defaultBgColor;
      container.style.color = defaultColor;
      toggleBtn.style.backgroundColor = "";
      toggleBtn.style.color = "";
    },
  };
}

export function initAccessibilityActions() {
  // Create article sliders
  const {
    resetSlider: articleResetSlider,
    resetAllSliders: articleResetAllSlider,
  } = initAccessibilitySliders(".esprit-article__main-content");
  // Create reading mode modal sliders
  const {
    resetSlider: readingModeResetSlider,
    resetAllSliders: readingModeResetAllSlider,
  } = initAccessibilitySliders("#modal-reading-mode-content", {
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
      const btnContainer = button.closest(
        ".esprit-article-accessibility__controls"
      );
      if (!btnContainer) return;
      const allBtns = btnContainer.querySelectorAll(
        ".es-article-accessibility-control-btn"
      );
      allBtns.forEach((btn) => btn.classList.remove("active"));
      e.currentTarget.classList.add("active");
    });
  });

  const { reset: readingModeBackgroundReset } = initBackgroundColorDropdown(
    "#modal-reading-mode-content",
    ".accessibility-bg-dropdown"
  );

  showTextOnly(() => {
    readingModeResetAllSlider();
    readingModeBackgroundReset();
  });
}
