import noUiSlider from "nouislider";
import "nouislider/dist/nouislider.css";

// Default slider settings (percentage-based)
const DEFAULT_SETTINGS = {
  fontSize: 50, // %
  wordSpacing: 50,
  lineHeight: 50,
};

function createSlider(id, start, callback) {
  const slider = document.getElementById(id);

  noUiSlider.create(slider, {
    start: [start],
    connect: [true, false],
    range: {
      min: 0,
      max: 100,
    },
    step: 0.01,
    tooltips: {
      to: function (value) {
        return Math.round(value) + "%";
      },
      from: function (value) {
        return Number(value.replace("%", ""));
      },
    },
    pips: {
      mode: "positions",
      values: [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
      density: 10,
      format: {
        to: function (value) {
          return Math.round(value) + "%";
        },
      },
    },
  });

  slider.noUiSlider.on("update", function (values, handle) {
    const percentValue = parseFloat(values[handle]);
    callback(percentValue);
  });
}

export function initAccessibilitySliders() {
  const newsContainer = document.querySelector(".esprit-article");

  // Read actual font-size in px and convert to em based on root font-size
  const computedFontSizePx = parseFloat(
    getComputedStyle(newsContainer).fontSize
  );
  const rootFontSizePx = parseFloat(
    getComputedStyle(document.documentElement).fontSize
  );
  const computedFontSizeEm = computedFontSizePx / rootFontSizePx;

  const minFontEm = 0.75; // equals ~12px on 16px root
  const maxFontEm = 1.875; // equals ~30px

  const initialFontPercent =
    ((computedFontSizeEm - minFontEm) / (maxFontEm - minFontEm)) * 100;

  // Read actual word-spacing (px)
  const computedWordSpacing = parseFloat(
    getComputedStyle(newsContainer).wordSpacing
  );
  const minWordSpacing = 0;
  const maxWordSpacing = 10;
  const initialWordSpacingPercent =
    ((computedWordSpacing - minWordSpacing) /
      (maxWordSpacing - minWordSpacing)) *
    100;

  // Read actual line-height (unitless, usually)
  const computedLineHeight =
    parseFloat(getComputedStyle(newsContainer).lineHeight) || 1.5;
  const minLineHeight = 1;
  const maxLineHeight = 3;
  const initialLineHeightPercent =
    ((computedLineHeight - minLineHeight) / (maxLineHeight - minLineHeight)) *
    100;

  // function roundToNearestWithCeil(
  //   value,
  //   base = 1,
  //   precision = 3,
  //   threshold = 0.002
  // ) {
  //   const diff = base - value;
  //   if (diff > 0 && diff <= threshold) {
  //     return base; // اگر خیلی نزدیک بود، گرد به بالا
  //   }
  //   return Math.ceil(value * Math.pow(10, precision)) / Math.pow(10, precision);
  // }

  // Create font-size slider and apply in em
  createSlider("fontSizeSlider", initialFontPercent, function (value) {
    console.log("value", value);
    const em = minFontEm + ((maxFontEm - minFontEm) * value) / 100;
    // const roundedFontSizeEm = roundToNearestWithCeil(em, 1, 3, 0.002);
    console.log("initialFontPercent", initialFontPercent);
    newsContainer.style.fontSize = em + "em";
  });

  // Create word-spacing slider and apply in px
  createSlider(
    "wordSpacingSlider",
    initialWordSpacingPercent,
    function (value) {
      const px =
        minWordSpacing + ((maxWordSpacing - minWordSpacing) * value) / 100;
      newsContainer.style.wordSpacing = px + "px";
    }
  );

  // Create line-height slider and apply as unitless
  createSlider("lineHeightSlider", initialLineHeightPercent, function (value) {
    const lh = minLineHeight + ((maxLineHeight - minLineHeight) * value) / 100;
    newsContainer.style.lineHeight = lh;
  });

  // Toggle "active" class on accessibility buttons
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
