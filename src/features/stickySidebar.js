import StickySidebar from "../utils/sticky-sidebar.esm";
import { LAYOUT_BREAKPOINTS } from '../config/constants.js';

/**
 * Initialize sticky sidebar
 * @param {Object} options - Sticky sidebar options
 * @param {string} [options.sidebarSelector='.es-page-sidebar'] - Sidebar element selector
 * @param {number} [options.topSpacing=20] - Top spacing in pixels
 * @param {number} [options.bottomSpacing=20] - Bottom spacing in pixels
 * @param {string} [options.containerSelector='.es-page-content-container'] - Container selector
 * @param {string} [options.innerWrapperSelector='.sidebar__inner'] - Inner wrapper selector
 * @param {number} [options.minWidth=991] - Minimum width for sticky behavior
 * @param {string} [options.articleSelector='#page-content-main-article'] - Article element selector for width check
 * @returns {StickySidebar|null} Sticky sidebar instance or null
 */
export function initStickySidebar(options = {}) {
  const {
    sidebarSelector = '.es-page-sidebar',
    topSpacing = 20,
    bottomSpacing = 20,
    containerSelector = '.es-page-content-container',
    innerWrapperSelector = '.sidebar__inner',
    minWidth = 991,
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
    if (contentWidth < LAYOUT_BREAKPOINTS.MOBILE_CONTENT_MAX) {
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

  return sidebar;
}