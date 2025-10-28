import noUiSlider from "nouislider";
import "nouislider/dist/nouislider.css";

/**
 * Creates a single slider instance with NoUiSlider
 * @param {string} id - The DOM element ID for the slider
 * @param {number} start - Initial value (0-100)
 * @param {Function} callback - Callback function to execute when slider value changes
 * @returns {Object|null} The slider instance or null if element not found
 */
export function createSlider(id, start, callback) {
  const slider = document.getElementById(id);
  if (!slider) return null;

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

  // Only run the callback when the user interacts
  slider.noUiSlider.on(
    "update",
    function (values, handle, unencoded, tap, positions) {
      if (!hasInteracted) return;
      const percentValue = parseFloat(values[handle]);
      callback(percentValue);
    }
  );

  // Activate the flag when the user touches (changes) the slider
  slider.noUiSlider.on("start", function () {
    hasInteracted = true;
  });

  return slider;
}

/**
 * Configuration for slider instances
 * @typedef {Object} SliderConfig
 * @property {string} fontSizeSlider - ID for font size slider
 * @property {string} wordSpacingSlider - ID for word spacing slider
 * @property {string} lineHeightSlider - ID for line height slider
 */

/**
 * Initializes accessibility sliders for a container
 * @param {string} containerSelector - CSS selector for the target container
 * @param {SliderConfig} sliders - Configuration object with slider IDs
 * @returns {Object} Object with reset functions
 */
export function initAccessibilitySliders(
  containerSelector = "body",
  sliders = {
    fontSizeSlider: "fontSizeSlider",
    wordSpacingSlider: "wordSpacingSlider",
    lineHeightSlider: "lineHeightSlider",
  }
) {
  const newsContainer = document.querySelector(containerSelector);
  if (!newsContainer) return { resetSlider: () => {}, resetAllSliders: () => {} };

  // Local store: keys are the same as slider property names
  const localSlidersStore = {};

  /**
   * Creates a local slider instance and stores it
   * @param {string} name - Property name for the slider
   * @param {string} id - DOM element ID
   * @param {number} start - Initial value
   * @param {Function} callback - Value change callback
   */
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

    // Store with property name as key, not id
    localSlidersStore[name] = { slider, initial: start, callback };
  }

  /**
   * Resets a single slider to its initial value
   * @param {string} name - The slider name to reset
   */
  function resetSlider(name) {
    const entry = localSlidersStore[name];
    if (!entry) return;
    entry.slider.noUiSlider.set(entry.initial);
    entry.callback(entry.initial);
  }

  /**
   * Resets all sliders to their initial values
   */
  function resetAllSliders() {
    Object.keys(localSlidersStore).forEach(resetSlider);
  }

  // Calculate initial values
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
  const computedLineHeightPx = parseFloat(
    getComputedStyle(newsContainer).lineHeight
  );
  const computedFontSizePx = parseFloat(
    getComputedStyle(newsContainer).fontSize
  );

  // Calculate relative line-height
  const computedLineHeight =
    computedLineHeightPx && computedFontSizePx
      ? computedLineHeightPx / computedFontSizePx
      : 1.5;

  const initialLineHeightPercent =
    ((computedLineHeight - minLineHeight) / (maxLineHeight - minLineHeight)) *
    100;

  // Create sliders with property names
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

  // Return reset functions for external use
  return { resetSlider, resetAllSliders };
}
