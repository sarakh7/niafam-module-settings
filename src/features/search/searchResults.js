/**
 * Search Results Page Features
 * Handles animations and interactions for the search results page
 */

/**
 * Initialize all search results features
 */
export function initSearchResults() {
  initAnimations();
  // initSmoothScroll();
  // console.log("Search results features initialized");
}

/**
 * Initialize staggered fade-in animations for result items
 */
function initAnimations() {
  const items = document.querySelectorAll('.esprit-search-results-item');

  if (!items.length) {
    console.warn("No search result items found");
    return;
  }

  items.forEach((item, index) => {
    // Stagger animation by 0.1s, reset every 8 items
    const delay = (index % 8) * 0.1;
    item.style.animationDelay = `${delay}s`;
    item.classList.add('esprit-search-results-item--animate');
  });

  // console.log(`Initialized animations for ${items.length} result items`);
}

/**
 * Initialize smooth scroll for breadcrumb links
 */
function initSmoothScroll() {
  const breadcrumbLinks = document.querySelectorAll('.esprit-search-results-breadcrumb a');

  breadcrumbLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');

      // Only handle hash links
      if (href && href.startsWith('#')) {
        e.preventDefault();
        const target = document.querySelector(href);

        if (target) {
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      }
    });
  });

  if (breadcrumbLinks.length) {
    // console.log("Initialized smooth scroll for breadcrumb links");
  }
}
