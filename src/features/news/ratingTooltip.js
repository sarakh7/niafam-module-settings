/**
 * Rating Tooltip Module
 *
 * Handles displaying tooltip messages when users try to vote on comments they've already voted on.
 *
 * Usage:
 * After receiving server response indicating user has already voted, simply add the class:
 * ratingElement.classList.add('show-voted-tooltip');
 *
 * The tooltip will automatically appear, display for 3 seconds, and fade out.
 */

import i18next from 'i18next';

/**
 * Shows tooltip on a rating element
 * @param {HTMLElement} ratingElement - The .es-rating element to show tooltip on
 * @param {number} duration - Duration in milliseconds to show tooltip (default: 3000)
 */
export function showRatingTooltip(ratingElement, duration = 3000) {
  if (!ratingElement) {
    console.warn('Rating element not found');
    return;
  }

  // Check if tooltip already exists
  let tooltipElement = ratingElement.querySelector('.es-rating__tooltip');

  // If not, create it
  if (!tooltipElement) {
    tooltipElement = document.createElement('div');
    tooltipElement.className = 'es-rating__tooltip';
    tooltipElement.setAttribute('data-i18n', 'rating.alreadyVoted');
    tooltipElement.textContent = i18next.t('rating.alreadyVoted');
    ratingElement.appendChild(tooltipElement);
  } else {
    // Update text in case language has changed
    tooltipElement.textContent = i18next.t('rating.alreadyVoted');
  }

  // Add show class
  ratingElement.classList.add('show-voted-tooltip');

  // Remove class after duration
  setTimeout(() => {
    ratingElement.classList.remove('show-voted-tooltip');
  }, duration);
}

/**
 * Initialize rating tooltips for all rating elements
 * Sets up mutation observer to handle dynamically added tooltips
 */
export function initRatingTooltips() {
  // Update all existing tooltips when language changes
  document.addEventListener('DOMContentLoaded', () => {
    i18next.on('languageChanged', () => {
      const tooltips = document.querySelectorAll('.es-rating__tooltip');
      tooltips.forEach(tooltip => {
        tooltip.textContent = i18next.t('rating.alreadyVoted');
      });
    });
  });
}

/**
 * Auto-detect and show tooltip when 'show-voted-tooltip' class is added
 * This watches for class changes on .es-rating elements
 */
export function observeRatingElements() {
  // Create observer to watch for class changes
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
        const target = mutation.target;
        if (target.classList.contains('es-rating') && target.classList.contains('show-voted-tooltip')) {
          // Ensure tooltip element exists
          let tooltipElement = target.querySelector('.es-rating__tooltip');
          if (!tooltipElement) {
            tooltipElement = document.createElement('div');
            tooltipElement.className = 'es-rating__tooltip';
            tooltipElement.setAttribute('data-i18n', 'rating.alreadyVoted');
            tooltipElement.textContent = i18next.t('rating.alreadyVoted');
            target.appendChild(tooltipElement);
          }

          // Auto-remove class after 3 seconds
          setTimeout(() => {
            target.classList.remove('show-voted-tooltip');
          }, 3000);
        }
      }
    });
  });

  // Observe all existing rating elements
  const ratingElements = document.querySelectorAll('.es-rating');
  ratingElements.forEach(element => {
    observer.observe(element, {
      attributes: true,
      attributeFilter: ['class']
    });
  });

  // Watch for new rating elements added to DOM
  const bodyObserver = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (node.nodeType === 1) { // Element node
          // Check if the added node is a rating element
          if (node.classList && node.classList.contains('es-rating')) {
            observer.observe(node, {
              attributes: true,
              attributeFilter: ['class']
            });
          }
          // Check for rating elements within added node
          const ratings = node.querySelectorAll && node.querySelectorAll('.es-rating');
          if (ratings) {
            ratings.forEach(rating => {
              observer.observe(rating, {
                attributes: true,
                attributeFilter: ['class']
              });
            });
          }
        }
      });
    });
  });

  // Start observing body for new elements
  bodyObserver.observe(document.body, {
    childList: true,
    subtree: true
  });

  return observer;
}

// Auto-initialize on module load
if (typeof window !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      initRatingTooltips();
      observeRatingElements();
    });
  } else {
    initRatingTooltips();
    observeRatingElements();
  }
}
