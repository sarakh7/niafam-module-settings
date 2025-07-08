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

export function initAccessibilitySliders() {
  const newsContainer = document.querySelector(".esprit-article");

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

  // Create sliders
  createSlider("fontSizeSlider", initialFontPercent, function (value) {
    const em = minFontEm + ((maxFontEm - minFontEm) * value) / 100;
    const roundedFontSizeEm = Math.ceil(em * 1000) / 1000; // round up to 3 decimal places
    newsContainer.style.fontSize = roundedFontSizeEm + "em";
  });

  createSlider(
    "wordSpacingSlider",
    initialWordSpacingPercent,
    function (value) {
      const px =
        minWordSpacing + ((maxWordSpacing - minWordSpacing) * value) / 100;
      newsContainer.style.wordSpacing = px + "px";
    }
  );

  createSlider("lineHeightSlider", initialLineHeightPercent, function (value) {
    const lh = minLineHeight + ((maxLineHeight - minLineHeight) * value) / 100;
    newsContainer.style.lineHeight = lh;
  });

  // Handle button toggling
  const buttons = document.querySelectorAll(
    ".esprit-article-accessibility__button"
  );
  buttons.forEach((button) => {
    button.addEventListener("click", (e) => {
      buttons.forEach((btn) => btn.classList.remove("active"));
      e.currentTarget.classList.add("active");
    });
  });
}
