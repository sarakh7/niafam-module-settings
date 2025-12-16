/**
 * Authentication Navigation
 * Sticky navigation with smooth scroll and active section highlighting
 */

/**
 * Initialize authentication navigation
 */
export function initAuthNav() {
  const nav = document.getElementById('auth-nav');
  if (!nav) {
    console.warn('Auth navigation not found');
    return;
  }

  // Setup smooth scroll for navigation links
  setupSmoothScroll(nav);

  // Setup intersection observer for active section detection
  setupActiveSectionDetection(nav);
}

/**
 * Setup smooth scroll behavior for navigation links
 * @param {HTMLElement} nav - Navigation element
 */
function setupSmoothScroll(nav) {
  const links = nav.querySelectorAll('a[href^="#"]');

  links.forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();

      const targetId = link.getAttribute('href').slice(1);
      const targetElement = document.getElementById(targetId);

      if (targetElement) {
        // Calculate offset for sticky nav
        const navHeight = nav.offsetHeight;
        const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navHeight - 20;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth',
        });

        // Update active link immediately
        setActiveLink(targetId);
      }
    });
  });
}

/**
 * Setup Intersection Observer for active section detection
 * @param {HTMLElement} nav - Navigation element
 */
function setupActiveSectionDetection(nav) {
  const sections = document.querySelectorAll('.auth-section');
  const links = nav.querySelectorAll('.auth-nav__link');

  // Create a map of section IDs to link elements
  const sectionLinkMap = new Map();
  links.forEach((link) => {
    const href = link.getAttribute('href');
    if (href && href.startsWith('#')) {
      sectionLinkMap.set(href.slice(1), link);
    }
  });

  // Intersection Observer options
  const options = {
    root: null,
    rootMargin: '-100px 0px -60% 0px',
    threshold: 0,
  };

  // Create observer
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        setActiveLink(entry.target.id);
      }
    });
  }, options);

  // Observe all sections
  sections.forEach((section) => {
    observer.observe(section);
  });
}

/**
 * Set active link in navigation
 * @param {string} sectionId - ID of the active section
 */
function setActiveLink(sectionId) {
  const links = document.querySelectorAll('.auth-nav__link');

  links.forEach((link) => {
    const href = link.getAttribute('href');

    if (href === `#${sectionId}`) {
      link.classList.add('auth-nav__link--active');
    } else {
      link.classList.remove('auth-nav__link--active');
    }
  });
}
