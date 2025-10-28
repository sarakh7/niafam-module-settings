import StickySidebar from "../../utils/sticky-sidebar.esm";
import { getSettings } from '../../config/settings.js';

/**
 * Initialize sticky sidebar
 * @param {Object} options - Sticky sidebar options
 * @param {string} [options.sidebarSelector='.es-page-sidebar'] - Sidebar element selector
 * @param {number} [options.topSpacing=20] - Top spacing in pixels
 * @param {number} [options.bottomSpacing=20] - Bottom spacing in pixels
 * @param {string} [options.containerSelector='.es-page-content-container'] - Container selector
 * @param {string} [options.innerWrapperSelector='.sidebar__inner'] - Inner wrapper selector
 * @param {number} [options.minWidth] - Minimum width for sticky behavior (defaults to DESKTOP_VIEWPORT_MIN - 1)
 * @param {string} [options.articleSelector='#page-content-main-article'] - Article element selector for width check
 * @returns {StickySidebar|null} Sticky sidebar instance or null
 */
export function initStickySidebar(options = {}) {
  const settings = getSettings();
  const {
    sidebarSelector = '.es-page-sidebar',
    topSpacing = 20,
    bottomSpacing = 20,
    containerSelector = '.es-page-content-container',
    innerWrapperSelector = '.sidebar__inner',
    minWidth = settings.layout.desktopViewportMin - 1,
    articleSelector = '#page-content-main-article'
  } = options;

  const sidebarElement = document.querySelector(sidebarSelector);

  if (!sidebarElement) {
    console.warn(`Sticky sidebar element not found: ${sidebarSelector}`);
    return null;
  }

  // Check article width before initializing sticky sidebar
  const articleElement = document.querySelector(articleSelector);
  if (articleElement) {
    const contentWidth = Math.round(articleElement.getBoundingClientRect().width);
    if (contentWidth < settings.layout.mobileContentMax) {
      console.info('Sticky sidebar disabled: article width is below MOBILE_CONTENT_MAX threshold');
      return null;
    }
  }

  const sidebar = new StickySidebar(sidebarSelector, {
    topSpacing,
    bottomSpacing,
    containerSelector,
    innerWrapperSelector,
    minWidth,
  });

  // Recalculate dimensions after images and content are fully loaded
  // This fixes the issue where container height is miscalculated on initial load
  if (window.addEventListener) {
    window.addEventListener('load', () => {
      setTimeout(() => {
        sidebar.updateSticky({ type: 'resize' });
      }, 100);
    });

    // Track previous window width to detect significant layout changes
    let previousWidth = window.innerWidth;
    const breakpoint = settings.layout.desktopViewportMin;

    // Handle resize events and force recalculation when crossing breakpoint or large width changes
    let resizeTimeout;
    window.addEventListener('resize', () => {
      const currentWidth = window.innerWidth;
      const widthDifference = Math.abs(currentWidth - previousWidth);

      // Check if we crossed the breakpoint
      const crossedBreakpoint =
        (previousWidth < breakpoint && currentWidth >= breakpoint) ||
        (previousWidth >= breakpoint && currentWidth < breakpoint);

      // Check for large width changes (e.g., closing DevTools, toggling device toolbar)
      const largeWidthChange = widthDifference > 100;

      if (crossedBreakpoint || largeWidthChange) {
        // Clear any pending timeout
        if (resizeTimeout) {
          clearTimeout(resizeTimeout);
        }

        // Force recalculation with a delay to ensure layout has updated
        resizeTimeout = setTimeout(() => {
          sidebar.updateSticky({ type: 'resize' });
          resizeTimeout = null;
        }, 150);
      }

      previousWidth = currentWidth;
    });
  }

  return sidebar;
}