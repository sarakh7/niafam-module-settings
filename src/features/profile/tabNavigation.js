/**
 * Profile Edit Tab Navigation
 * Handles tab switching with animations, ARIA attributes, and state management
 */

/**
 * Initialize tab navigation for profile edit page
 */
export function initTabNavigation() {
  const tabLinks = document.querySelectorAll('.profile-edit__tab-link');
  const tabPanes = document.querySelectorAll('.profile-edit__tab-pane');

  if (tabLinks.length === 0 || tabPanes.length === 0) {
    console.warn('Profile Edit: Tab navigation elements not found');
    return;
  }

  // Restore last active tab from sessionStorage
  const lastActiveTab = sessionStorage.getItem('profile-edit-active-tab');
  if (lastActiveTab) {
    const tabElement = document.querySelector(`#${lastActiveTab}`);
    if (tabElement) {
      activateTab(lastActiveTab);
    }
  }

  // Attach click handlers to all tab links
  tabLinks.forEach((link) => {
    link.addEventListener('click', handleTabClick);
  });

  // console.log('Profile Edit: Tab navigation initialized');
}

/**
 * Handle tab link click event
 * @param {Event} e - Click event
 */
function handleTabClick(e) {
  e.preventDefault();

  const targetHref = this.getAttribute('href');
  if (!targetHref) return;

  const targetId = targetHref.substring(1); // Remove # from href
  activateTab(targetId);

  // Save active tab to sessionStorage
  sessionStorage.setItem('profile-edit-active-tab', targetId);
}

/**
 * Activate a specific tab and deactivate others
 * @param {string} tabId - ID of the tab pane to activate
 */
function activateTab(tabId) {
  // Update tab links
  const allLinks = document.querySelectorAll('.profile-edit__tab-link');
  allLinks.forEach((link) => {
    const linkTarget = link.getAttribute('href');
    if (!linkTarget) return;

    const linkTargetId = linkTarget.substring(1);

    if (linkTargetId === tabId) {
      // Activate this tab link
      link.classList.add('profile-edit__tab-link--active');
      link.setAttribute('aria-selected', 'true');
    } else {
      // Deactivate other tab links
      link.classList.remove('profile-edit__tab-link--active');
      link.setAttribute('aria-selected', 'false');
    }
  });

  // Update tab panes
  const allPanes = document.querySelectorAll('.profile-edit__tab-pane');
  allPanes.forEach((pane) => {
    if (pane.id === tabId) {
      // Show this tab pane
      pane.classList.add('profile-edit__tab-pane--active');
    } else {
      // Hide other tab panes
      pane.classList.remove('profile-edit__tab-pane--active');
    }
  });
}
