/**
 * Related Content Links Manager
 * Manages related content links and displays only links whose targets exist in the page.
 * If no targets exist, hides the entire related content section.
 */

/**
 * Check if an element with the specified ID exists in the DOM
 * @param {string} targetId - The element ID to check (without #)
 * @returns {boolean} - Returns true if element exists
 */
function isTargetExists(targetId) {
  const element = document.getElementById(targetId);
  return element !== null && element !== undefined;
}

/**
 * Filter related content links based on target existence
 */
function filterRelatedContentLinks() {
  const relatedContentContainer = document.querySelector('.esprit-article-related-content');
  const relatedContentList = document.getElementById('related-content-list');

  if (!relatedContentContainer || !relatedContentList) {
    console.warn('Related content container or list not found');
    return;
  }

  const listItems = relatedContentList.querySelectorAll('.esprit-article-related-content__item');
  let visibleItemsCount = 0;

  listItems.forEach(item => {
    const link = item.querySelector('.esprit-article-related-content__link');

    if (link) {
      const href = link.getAttribute('href');

      // Check if link is an anchor link (starts with #)
      if (href && href.startsWith('#')) {
        const targetId = href.substring(1); // Remove # from the beginning

        // Check if target exists
        if (isTargetExists(targetId)) {
          item.style.display = '';
          visibleItemsCount++;
        } else {
          item.style.display = 'none';
        }
      } else {
        // If link is not an anchor, hide it
        item.style.display = 'none';
      }
    }
  });

  // If no items are visible, hide the entire section
  if (visibleItemsCount === 0) {
    relatedContentContainer.style.display = 'none';
  } else {
    relatedContentContainer.style.display = '';
  }
}

/**
 * Initialize related content filter
 */
export function initRelatedContent() {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', filterRelatedContentLinks);
  } else {
    filterRelatedContentLinks();
  }
}
