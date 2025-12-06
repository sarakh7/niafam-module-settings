import { getSettings } from "../../../config/settings";

/**
 * Initializes the background color dropdown for accessibility
 * Allows users to change background and text colors for better readability
 * @param {string} containerSelector - CSS selector for the container to apply colors to
 * @param {string} dropdownSelector - CSS selector for the dropdown element
 * @returns {Object|undefined} Object with reset function, or undefined if elements not found
 */
export function initBackgroundColorDropdown(
  containerSelector,
  dropdownSelector
) {
  const container = document.querySelector(containerSelector);
  const dropdown = document.querySelector(dropdownSelector);
  if (!container || !dropdown) return;

  const toggleBtn = dropdown.querySelector(".accessibility-bg-dropdown-toggle");
  const menu = dropdown.querySelector(".accessibility-bg-dropdown-menu");

  if (!toggleBtn || !menu) {
    console.warn('Toggle button or menu not found');
    return;
  }

  // Get default theme from settings
  const settings = getSettings();
  const defaultTheme = settings.readingMode.backgroundThemes[settings.readingMode.defaultTheme];
  const defaultColor = defaultTheme.color;
  const defaultBgColor = defaultTheme.backgroundColor;

  // Set initial colors on load
  container.style.backgroundColor = defaultBgColor;
  container.style.color = defaultColor;
  toggleBtn.style.backgroundColor = defaultBgColor;
  toggleBtn.style.color = defaultColor;

  // Toggle menu open/close
  toggleBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    dropdown.classList.toggle("accessibility-bg-dropdown-open");
  });

  document.addEventListener("click", (e) => {
    if (!dropdown.contains(e.target)) {
      dropdown.classList.remove("accessibility-bg-dropdown-open");
    }
  });

  // Handle menu item clicks
  menu.querySelectorAll("li").forEach((item) => {
    const color = item.dataset.color;
    const bgColor = item.dataset.bg;
    // Store color as CSS variable
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

  // Close menu when clicking outside
  document.addEventListener("click", (e) => {
    if (!dropdown.contains(e.target)) {
      dropdown.classList.remove("dropdown-open");
    }
  });

  return {
    /**
     * Resets the background colors to default values
     */
    reset: () => {
      container.style.backgroundColor = defaultBgColor;
      container.style.color = defaultColor;
      toggleBtn.style.backgroundColor = "";
      toggleBtn.style.color = "";
    },
  };
}
