import { CSS_CLASSES } from "./constants.js";

/**
 * Close a toggle element and reset its state
 * @param {string} selector - Selector for the toggle element
 * @returns {boolean} Success status
 */
export function closeToggle(selector) {
  const element = document.querySelector(selector);
  if (!element) return false;

  element.classList.remove(CSS_CLASSES.ACTIVE);
  element.style.overflow = "hidden";
  return true;
}

/**
 * @typedef {Object} ToggleOptions
 * @property {string} btnSelector - Button selector
 * @property {string} listSelector - List/content selector
 * @property {string} wrapperSelector - Wrapper selector
 * @property {string} [bodyFlagName] - Flag name to prevent duplicate listeners
 */

/**
 * Setup toggle behavior for collapsible elements
 * @param {ToggleOptions} opts - Toggle configuration options
 * @returns {boolean} Success status
 */
export function setupToggle(opts = {}) {
  const { btnSelector, listSelector, wrapperSelector, bodyFlagName } = opts;

  if (!btnSelector || !listSelector || !wrapperSelector) {
    console.warn("setupToggle: Missing required selectors");
    return false;
  }

  const btn = document.querySelector(btnSelector);
  const list = document.querySelector(listSelector);
  const wrapper = document.querySelector(wrapperSelector);

  if (!btn || !list || !wrapper) {
    console.warn("setupToggle: Required elements not found", {
      btn: !!btn,
      list: !!list,
      wrapper: !!wrapper,
    });
    return false;
  }

  // Ensure wrapper has relative positioning for absolute children
  if (!wrapper.style.position) {
    wrapper.style.position = "relative";
  }

  /**
   * Open the toggle list
   */
  const open = () => {
    // Hide overflow before opening to prevent content flash
    list.style.overflow = "hidden";
    list.classList.add(CSS_CLASSES.ACTIVE);
    // After transition ends, set overflow visible for tooltips to show
    list.addEventListener(
      "transitionend",
      () => {
        if (list.classList.contains(CSS_CLASSES.ACTIVE))
          list.style.overflow = "visible";
      },
      { once: true }
    );
  };

  /**
   * Close the toggle list
   */
  const close = () => {
    list.style.overflow = "hidden";
    list.classList.remove(CSS_CLASSES.ACTIVE);
  };

  // Prevent duplicate button binding
  if (!btn.dataset.bound) {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      list.classList.contains(CSS_CLASSES.ACTIVE) ? close() : open();
    });
    btn.dataset.bound = "true";
  }

  // Prevent duplicate document click listener
  const flag = bodyFlagName || "toggleBound";
  if (!document.body.dataset[flag]) {
    document.addEventListener("click", (e) => {
      if (!wrapper.contains(e.target)) {
        close();
      }
    });
    document.body.dataset[flag] = "true";
  }

  return true;
}
