import StickySidebar from "../utils/sticky-sidebar.esm";

/**
 * Initialize sticky sidebar
 * @param {Object} options - Sticky sidebar options
 * @param {string} [options.sidebarSelector='.es-page-sidebar'] - Sidebar element selector
 * @param {number} [options.topSpacing=20] - Top spacing in pixels
 * @param {number} [options.bottomSpacing=20] - Bottom spacing in pixels
 * @param {string} [options.containerSelector='.es-page-content-container'] - Container selector
 * @param {string} [options.innerWrapperSelector='.sidebar__inner'] - Inner wrapper selector
 * @param {number} [options.minWidth=991] - Minimum width for sticky behavior
 * @returns {StickySidebar|null} Sticky sidebar instance or null
 */
export function initStickySidebar(options = {}) {
  const {
    sidebarSelector = '.es-page-sidebar',
    topSpacing = 20,
    bottomSpacing = 20,
    containerSelector = '.es-page-content-container',
    innerWrapperSelector = '.sidebar__inner',
    minWidth = 991
  } = options;

  const sidebarElement = document.querySelector(sidebarSelector);
  
  if (!sidebarElement) {
    console.warn(`Sticky sidebar element not found: ${sidebarSelector}`);
    return null;
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