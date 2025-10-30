import { SELECTORS, CSS_CLASSES, getMinWidth } from "./constants.js";
import { moveArticleTools } from "./elementMover.js";
import { setupToggle, closeToggle } from "./toggle.js";

/**
 * Initialize responsive layout system
 * Handles element repositioning based on viewport width
 * @returns {void}
 */
export function setLayout() {
  const articleSelector = SELECTORS.ARTICLE_MAIN;

  let lastWasSmall = null;

  /**
   * Check viewport width and adjust layout accordingly
   */
  function checkWidth() {
    const article = document.querySelector(articleSelector);

    if (!article) {
      console.warn("setLayout: Article element not found");
      return;
    }

    const contentWidth = Math.round(article.getBoundingClientRect().width);
    const viewportWidth = window.innerWidth;
    const DESKTOP_VIEWPORT_MIN = 992; // Fixed breakpoint
    const mobileContentMax = getMinWidth(); // e.g., 1200


    // Apply mobile layout if:
    // 1. Viewport width <= 991 → mobile
    // 2. Viewport width >= 992 AND container width < mobileContentMax → mobile
    // 3. Otherwise → desktop
    let isSmall;
    if (viewportWidth <= DESKTOP_VIEWPORT_MIN - 1) {
      isSmall = true; // Always mobile if viewport <= 991
    } else {
      isSmall = contentWidth < mobileContentMax; // Check container width if viewport >= 992
    }

    // Toggle visibility class on article tools
    const myElement = document.querySelector(SELECTORS.ESPRIT_ARTICLE_TOOLS);
    if (myElement) {
      myElement.classList.toggle(CSS_CLASSES.SHOW, isSmall);
    }

    if (isSmall) {
      // Apply mobile layout: move elements and initialize toggles
      if (!article.classList.contains(CSS_CLASSES.HIDE_SIDEBAR)) {
        article.classList.add(CSS_CLASSES.HIDE_SIDEBAR);
      }

      const sidebar = document.querySelector(SELECTORS.SIDEBAR);
      const shortLinksWrapper = document.querySelector(
        SELECTORS.SHORTLINK_WRAPPER
      );
      // Apply mobile styles
      article.style.gridTemplateColumns = "1fr";

      if (sidebar) {
        sidebar.style.width = "100%";
      }
      if (shortLinksWrapper) {
        shortLinksWrapper.style.display = "none";
      }

      if (lastWasSmall !== true) {
        // Move elements to mobile layout
        moveArticleTools(article, false);

        // Initialize toggle for tools
        setupToggle({
          btnSelector: SELECTORS.TOGGLE_TOOLS_BOX,
          listSelector: SELECTORS.ES_ARTICLE_TOOLS,
          wrapperSelector: SELECTORS.ESPRIT_ARTICLE_TOOLS_ACTIONS,
          bodyFlagName: "toolsBound",
        });

        // Initialize toggle for share
        setupToggle({
          btnSelector: SELECTORS.TOGGLE_SHARE_BOX,
          listSelector: SELECTORS.ES_ARTICLE_SHARE,
          wrapperSelector: SELECTORS.ESPRIT_ARTICLE_TOOLS_SHARE,
          bodyFlagName: "shareBound",
        });
      }
    } else {
      // Apply desktop layout: reset elements
      if (article.classList.contains(CSS_CLASSES.HIDE_SIDEBAR)) {
        article.classList.remove(CSS_CLASSES.HIDE_SIDEBAR);
      }

      // Remove mobile styles
      article.style.gridTemplateColumns = "";

      const sidebar = document.querySelector(SELECTORS.SIDEBAR);
      const shortLinksWrapper = document.querySelector(
        SELECTORS.SHORTLINK_WRAPPER
      );

      // Reset sidebar and shortlink wrapper styles
      if (sidebar) {
        sidebar.style.width = "";
      }
      if (shortLinksWrapper) {
        shortLinksWrapper.style.display = "";
      }

      const shortlinkElement = document.querySelector(
        SELECTORS.ESPRIT_ARTICLE_TOOLS_SHORTLINK
      );
      if (shortlinkElement) {
        shortlinkElement.style.display = "";
      }

      if (lastWasSmall === true) {
        // Reset element movements
        moveArticleTools(article, true);

        // Close any open toggles and reset their state
        closeToggle(SELECTORS.ES_ARTICLE_TOOLS);
        closeToggle(SELECTORS.ES_ARTICLE_SHARE);

        // Note: Event listeners are not removed as elements return to original positions
        // and will continue to work naturally. For complete cleanup, listeners could be
        // removed, but for simplicity, we only close the toggle state here.
      }
    }

    lastWasSmall = isSmall;
  }

  /**
   * Debounced resize handler using requestAnimationFrame
   */
  let rafId = null;
  function debouncedCheck() {
    if (rafId) cancelAnimationFrame(rafId);
    rafId = requestAnimationFrame(() => {
      checkWidth();
      rafId = null;
    });
  }

  window.addEventListener("DOMContentLoaded", checkWidth);
  window.addEventListener("resize", debouncedCheck);

  // Run immediately if DOM is already loaded
  if (
    document.readyState === "complete" ||
    document.readyState === "interactive"
  ) {
    checkWidth();
  }
}
