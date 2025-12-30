/**
 * Related News Section Manager
 * Hides the #article-related-news section if .article-related-news__inner is empty
 */

/**
 * Check if an element is empty (no children or only whitespace)
 * @param {HTMLElement} element - The element to check
 * @returns {boolean} - Returns true if element is empty
 */
function isElementEmpty(element) {
  if (!element) return true;

  // Check if element has no child elements
  if (element.children.length > 0) return false;

  // Check if element has only whitespace text
  const textContent = element.textContent || '';
  return textContent.trim().length === 0;
}

/**
 * Hide related news section if inner content is empty
 */
function checkRelatedNewsVisibility() {
  const relatedNewsSection = document.getElementById('article-related-news');
  const relatedNewsInner = document.querySelector('.article-related-news__inner');

  if (!relatedNewsSection) {
    console.warn('Related news section (#article-related-news) not found');
    return;
  }

  if (!relatedNewsInner) {
    console.warn('Related news inner container (.article-related-news__inner) not found');
    // Hide section if inner container doesn't exist
    relatedNewsSection.style.display = 'none';
    return;
  }

  // Hide section if inner container is empty
  if (isElementEmpty(relatedNewsInner)) {
    relatedNewsSection.style.display = 'none';
  } else {
    relatedNewsSection.style.display = '';
  }
}

/**
 * Initialize related news visibility check
 */
export function initRelatedNews() {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', checkRelatedNewsVisibility);
  } else {
    checkRelatedNewsVisibility();
  }
}
