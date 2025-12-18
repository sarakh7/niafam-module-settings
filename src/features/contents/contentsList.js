/**
 * Contents List Feature
 * Manages the contents list page functionality
 * - Load more button interaction
 * - Smooth scroll animations
 * - Dynamic filtering (future enhancement)
 */

/**
 * Initialize load more button
 */
function initLoadMore() {
  const loadMoreBtn = document.querySelector('.esprit-contents-list-btn');

  if (!loadMoreBtn) return;

  loadMoreBtn.addEventListener('click', () => {
    // Future implementation: Load more content from API
    console.log('Load more clicked');

    // For now, just show a message
    loadMoreBtn.textContent = loadMoreBtn.getAttribute('data-loading-text') || 'در حال بارگذاری...';
    loadMoreBtn.disabled = true;

    // Simulate loading
    setTimeout(() => {
      loadMoreBtn.textContent = loadMoreBtn.getAttribute('data-i18n') || 'بارگذاری محتوای بیشتر';
      loadMoreBtn.disabled = false;
    }, 1500);
  });
}

/**
 * Add staggered fade-in animation to items
 */
function initAnimations() {
  const items = document.querySelectorAll('.esprit-contents-list-item');

  // Add fade-in class to trigger CSS animations
  items.forEach((item, index) => {
    item.classList.add('esprit-contents-list-item--animate');
  });
}

/**
 * Initialize smooth scrolling
 */
function initSmoothScroll() {
  const links = document.querySelectorAll('.esprit-contents-list-breadcrumb-link');

  links.forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (href && href.startsWith('#')) {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
          target.scrollIntoView({ behavior: 'smooth' });
        }
      }
    });
  });
}

/**
 * Initialize contents list
 */
export function initContentsList() {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      initAnimations();
      initLoadMore();
      initSmoothScroll();
    });
  } else {
    initAnimations();
    initLoadMore();
    initSmoothScroll();
  }

  console.log('Contents list feature initialized');
}
