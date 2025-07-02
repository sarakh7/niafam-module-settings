import noUiSlider from "nouislider";
import "nouislider/dist/nouislider.css";

// Default settings
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
    step: 1,
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
    // تبدیل مقدار رشته‌ای به عدد
    const percentValue = parseFloat(values[handle]);
    callback(percentValue);
  });
}

export function initAccessibilitySliders() {
  //  خواندن font-size واقعی
  const computedFontSize = parseFloat(getComputedStyle(document.body).fontSize);
  const minFont = 12;
  const maxFont = 30;
  const initialFontPercent =
    ((computedFontSize - minFont) / (maxFont - minFont)) * 100;

  //  خواندن word-spacing واقعی
  const computedWordSpacing = parseFloat(
    getComputedStyle(document.body).wordSpacing
  );
  const minWordSpacing = 0;
  const maxWordSpacing = 10;
  const initialWordSpacingPercent =
    ((computedWordSpacing - minWordSpacing) /
      (maxWordSpacing - minWordSpacing)) *
    100;

  //  خواندن line-height واقعی
  const computedLineHeight =
    parseFloat(getComputedStyle(document.body).lineHeight) || 1.5;
  const minLineHeight = 1;
  const maxLineHeight = 3;
  const initialLineHeightPercent =
    ((computedLineHeight - minLineHeight) / (maxLineHeight - minLineHeight)) *
    100;

  //  ساخت اسلایدرها
  createSlider("fontSizeSlider", initialFontPercent, function (value) {
    const px = minFont + ((maxFont - minFont) * value) / 100;
    document.body.style.fontSize = px + "px";
  });

  createSlider(
    "wordSpacingSlider",
    initialWordSpacingPercent,
    function (value) {
      const px =
        minWordSpacing + ((maxWordSpacing - minWordSpacing) * value) / 100;
      document.body.style.wordSpacing = px + "px";
    }
  );

  createSlider("lineHeightSlider", initialLineHeightPercent, function (value) {
    const lh = minLineHeight + ((maxLineHeight - minLineHeight) * value) / 100;
    document.body.style.lineHeight = lh;
  });

  //  دکمه‌ها
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
