import { initAccessibilitySliders } from "./slider";
import { showTextOnly } from "./readingMode";
import { initBackgroundColorDropdown } from "./backgroundColorDropdown";

/**
 * Initializes all accessibility actions for the article page
 * This includes sliders, reading mode, background color dropdown, and button toggling
 * Creates separate instances for article content and reading mode modal
 */
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

  // Handle button toggling for all accessibility control buttons
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

  // Initialize reading mode background color dropdown
  const { reset: readingModeBackgroundReset } = initBackgroundColorDropdown(
    "#modal-reading-mode-content",
    ".accessibility-bg-dropdown"
  );

  // Initialize reading mode with reset callbacks
  showTextOnly(() => {
    readingModeResetAllSlider();
    readingModeBackgroundReset();
  });
}
