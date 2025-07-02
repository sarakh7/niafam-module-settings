import noUiSlider from "nouislider";
import "nouislider/dist/nouislider.css";

// Default settings
const DEFAULT_SETTINGS = {
  fontSize: 16,
  wordSpacing: 1,
  lineHeight: 1.5,
  fontFamily: "vazir",
  fontWeight: 450,
  fontKashida: 0,
};

function createSlider(id, values, start, callback) {
  var slider = document.getElementById(id);
  noUiSlider.create(slider, {
    start: [start],
    connect: [true, false],
    range: {
      min: values[0],
      max: values[values.length - 1],
    },
    step: null,
    pips: {
      mode: "values",
      values: values,
      density: 5,
    },
  });
  slider.noUiSlider.on("update", function (values, handle) {
    callback(values[handle]);
  });
}

export function initAccessibilitySliders() {
  createSlider(
    "fontSizeSlider",
    [12, 16, 20, 24, 30],
    DEFAULT_SETTINGS.fontSize,
    function (value) {
      document.body.style.fontSize = value + "px";
    }
  );

  createSlider(
    "wordSpacingSlider",
    [0, 2, 4, 6, 10],
    DEFAULT_SETTINGS.wordSpacing,
    function (value) {
      document.body.style.wordSpacing = value + "px";
    }
  );

  createSlider(
    "lineHeightSlider",
    [1, 1.5, 2, 2.5, 3],
    DEFAULT_SETTINGS.lineHeight,
    function (value) {
      document.body.style.lineHeight = value;
    }
  );

  // همه دکمه‌ها را انتخاب کن
  const buttons = document.querySelectorAll(
    ".esprit-article-accessibility__button"
  );

  // روی هر کدام Listener بگذار
  buttons.forEach((button) => {
    button.addEventListener("click", (e) => {
      // اول همه دکمه‌ها را غیر فعال کن
      buttons.forEach((btn) => btn.classList.remove("active"));

      // بعد به این دکمه کلاس active بده
      e.currentTarget.classList.add("active");
    });
  });
}
