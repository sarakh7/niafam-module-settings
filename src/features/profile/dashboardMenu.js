/**
 * Dashboard Menu Toggle
 * Handles submenu toggle functionality and adds arrow icons
 */
import PerfectScrollbar from 'perfect-scrollbar';
import 'perfect-scrollbar/css/perfect-scrollbar.css';

export function initDashboardMenu() {
  const navigationElement = document.querySelector('.profile-dashboard__navigation');

  if (!navigationElement) {
    console.warn('Dashboard navigation not found');
    return;
  }

  // Initialize PerfectScrollbar for navigation
  const ps = new PerfectScrollbar(navigationElement, {
    wheelSpeed: 0.5,
    wheelPropagation: false,
    minScrollbarLength: 20,
    suppressScrollX: true,
  });

  // Find all links with submenus (links that have a UL as next sibling)
  const allLinks = navigationElement.querySelectorAll('a');
  const menuToggles = Array.from(allLinks).filter(link => {
    const nextSibling = link.nextElementSibling;
    return nextSibling && nextSibling.tagName === 'UL';
  });

  menuToggles.forEach((toggle) => {
    // Add arrow icon if it doesn't exist
    if (!toggle.querySelector('.arrow')) {
      const arrow = document.createElement('i');
      arrow.className = 'es esprit-fi-rr-angle-down arrow';
      toggle.appendChild(arrow);
    }

    // Add click event to toggle submenu
    toggle.addEventListener('click', (e) => {
      e.preventDefault();

      // Close other open submenus
      menuToggles.forEach((otherToggle) => {
        if (otherToggle !== toggle && otherToggle.classList.contains('open')) {
          otherToggle.classList.remove('open');
          const otherSubmenu = otherToggle.nextElementSibling;
          if (otherSubmenu && otherSubmenu.tagName === 'UL') {
            otherSubmenu.classList.remove('open');
          }
        }
      });

      // Toggle current submenu
      toggle.classList.toggle('open');

      // Get the next sibling (submenu ul)
      const submenu = toggle.nextElementSibling;

      if (submenu && submenu.tagName === 'UL') {
        submenu.classList.toggle('open');

        // Update PerfectScrollbar after submenu animation
        setTimeout(() => {
          ps.update();
        }, 300);
      }
    });
  });

  // Handle active state for current page
  const currentPath = window.location.pathname;
  const regularLinks = Array.from(navigationElement.querySelectorAll('a')).filter(link => {
    const nextSibling = link.nextElementSibling;
    return !(nextSibling && nextSibling.tagName === 'UL');
  });

  regularLinks.forEach((link) => {
    // Skip hash-only links (they're placeholders, not real navigation)
    const href = link.getAttribute('href');
    if (!href || href === '#' || href === 'javascript:void(0)' || href === 'javascript:;') {
      return;
    }

    try {
      const linkPath = new URL(link.href, window.location.origin).pathname;

      if (linkPath === currentPath) {
        link.classList.add('active');

        // If this link is in a submenu, open the parent submenu
        const parentLi = link.closest('li').parentElement.closest('li');
        if (parentLi) {
          const parentLink = parentLi.querySelector('a');
          if (parentLink && parentLink.nextElementSibling && parentLink.nextElementSibling.tagName === 'UL') {
            parentLink.classList.add('open');
            const submenu = parentLink.nextElementSibling;
            submenu.classList.add('open');

            // Update PerfectScrollbar after submenu is opened
            setTimeout(() => {
              ps.update();
            }, 300);
          }
        }
      }
    } catch (e) {
      console.warn('Invalid URL for link:', link.href);
    }
  });
}
