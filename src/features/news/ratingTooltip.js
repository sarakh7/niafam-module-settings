import i18next from "i18next";

/**
 * Show temporary tooltip for rating already voted
 * @param {HTMLElement} ratingElement - Rating element (.es-rating)
 * @param {Object} options - Options
 * @param {number} [options.duration=3000] - Display duration in ms
 */
export function showRatingTooltip(ratingElement, options = {}) {
  const { duration = 3000 } = options;

  if (!ratingElement) {
    console.warn("Rating element not provided");
    return;
  }

  // Get or create tooltip element
  let tooltip = ratingElement.querySelector(".es-rating__tooltip");
  let isNewTooltip = false;

  if (!tooltip) {
    // Create tooltip if doesn't exist
    tooltip = document.createElement("div");
    tooltip.className = "es-rating__tooltip";
    tooltip.setAttribute("role", "alert");
    tooltip.setAttribute("aria-live", "polite");

    // Insert at beginning of rating element
    ratingElement.insertBefore(tooltip, ratingElement.firstChild);
    isNewTooltip = true;
  }

  // Set message from translation
  tooltip.textContent = i18next.t("rating.alreadyVoted");

  // Show tooltip with animation
  if (isNewTooltip) {
    // For newly created tooltips, wait for next frame to allow browser to render initial state
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        ratingElement.classList.add("show-voted-tooltip");
      });
    });
  } else {
    // For existing tooltips, show immediately
    ratingElement.classList.add("show-voted-tooltip");
  }

  // Auto-hide after duration
  setTimeout(() => {
    ratingElement.classList.remove("show-voted-tooltip");
  }, duration);
}
