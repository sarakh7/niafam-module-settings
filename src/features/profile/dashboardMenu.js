/**
 * Dashboard Menu Toggle
 * Handles submenu toggle functionality and adds arrow icons
 */
import PerfectScrollbar from 'perfect-scrollbar';
import 'perfect-scrollbar/css/perfect-scrollbar.css';

export function initDashboardMenu() {
  const navigationElement = document.querySelector('.profile-dashboard__navigation');

  // Initialize PerfectScrollbar on navigation
  if (navigationElement) {
    new PerfectScrollbar(navigationElement, {
      wheelSpeed: 1,
      wheelPropagation: false,
      minScrollbarLength: 20
    });
  }

  const menuToggles = document.querySelectorAll('.profile-dashboard__navigation a.has-submenu');

  menuToggles.forEach((toggle) => {
    // Add arrow icon if it doesn't exist
    if (!toggle.querySelector('.arrow')) {
      const arrow = document.createElement('i');
      arrow.className = 'es esprit-fi-rr-angle-down arrow';
      toggle.appendChild(arrow);
    }

    toggle.addEventListener('click', (e) => {
      e.preventDefault();

      // Toggle open class on the link
      toggle.classList.toggle('open');

      // Get the next sibling (submenu ul)
      const submenu = toggle.nextElementSibling;

      if (submenu && submenu.tagName === 'UL') {
        submenu.classList.toggle('open');
      }
    });
  });
}
