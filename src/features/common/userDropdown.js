/**
 * User Dropdown Component
 * Reusable dropdown menu for logged-in users
 * Can be used on any page by including the HTML markup and calling initUserDropdown()
 */

/**
 * Initialize user dropdown functionality
 */
export function initUserDropdown() {
  const dropdown = document.querySelector('.user-dropdown');
  if (!dropdown) {
    console.warn('User dropdown not found');
    return;
  }

  const wrapper = dropdown.querySelector('.user-dropdown__wrapper');
  const trigger = dropdown.querySelector('.user-dropdown__trigger');
  const menu = dropdown.querySelector('.user-dropdown__menu');

  if (!wrapper || !trigger || !menu) {
    console.warn('User dropdown elements not found');
    return;
  }

  // Toggle dropdown on wrapper click
  wrapper.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleDropdown(dropdown);
  });

  // Close dropdown when clicking outside
  document.addEventListener('click', (e) => {
    if (!dropdown.contains(e.target)) {
      closeDropdown(dropdown);
    }
  });

  // Close dropdown when pressing Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeDropdown(dropdown);
    }
  });

  // Handle logout button
  const logoutBtn = dropdown.querySelector('.user-dropdown__logout');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', handleLogout);
  }
}

/**
 * Toggle dropdown open/closed
 * @param {HTMLElement} dropdown - Dropdown element
 */
function toggleDropdown(dropdown) {
  const isOpen = dropdown.classList.contains('user-dropdown--open');

  if (isOpen) {
    closeDropdown(dropdown);
  } else {
    openDropdown(dropdown);
  }
}

/**
 * Open dropdown
 * @param {HTMLElement} dropdown - Dropdown element
 */
function openDropdown(dropdown) {
  dropdown.classList.add('user-dropdown--open');

  // Set aria-expanded for accessibility
  const trigger = dropdown.querySelector('.user-dropdown__trigger');
  if (trigger) {
    trigger.setAttribute('aria-expanded', 'true');
  }
}

/**
 * Close dropdown
 * @param {HTMLElement} dropdown - Dropdown element
 */
function closeDropdown(dropdown) {
  dropdown.classList.remove('user-dropdown--open');

  // Set aria-expanded for accessibility
  const trigger = dropdown.querySelector('.user-dropdown__trigger');
  if (trigger) {
    trigger.setAttribute('aria-expanded', 'false');
  }
}

/**
 * Handle logout action
 * @param {Event} e - Click event
 */
function handleLogout(e) {
  e.preventDefault();

  // Mock logout action - in production this would call the backend
  const confirmed = confirm('Are you sure you want to logout?');

  if (confirmed) {
    console.log('User logged out');
    // In production: clear session, redirect to login, etc.
    // For demo: just show a message
    alert('You have been logged out successfully!');
  }
}

/**
 * Update user dropdown with user data
 * @param {Object} userData - User data object
 * @param {string} userData.name - User's full name
 * @param {string} userData.avatar - User's avatar URL (optional)
 * @param {string} userData.email - User's email (optional)
 */
export function updateUserDropdown(userData) {
  const dropdown = document.querySelector('.user-dropdown');
  if (!dropdown) return;

  // Update user name in wrapper
  const nameElement = dropdown.querySelector('.user-dropdown__name');
  if (nameElement && userData.name) {
    nameElement.textContent = userData.name;
  }

  // Update user name in menu header
  const headerNameElement = dropdown.querySelector('.user-dropdown__header-name');
  if (headerNameElement && userData.name) {
    headerNameElement.textContent = userData.name;
  }

  // Update user email in menu header
  const headerEmailElement = dropdown.querySelector('.user-dropdown__header-email');
  if (headerEmailElement && userData.email) {
    headerEmailElement.textContent = userData.email;
  }

  // Update avatar
  const avatarElement = dropdown.querySelector('.user-dropdown__avatar');
  if (avatarElement && userData.avatar) {
    avatarElement.src = userData.avatar;
  } else if (avatarElement && userData.name) {
    // Show initials if no avatar
    const initials = userData.name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);

    avatarElement.alt = initials;
    avatarElement.setAttribute('data-initials', initials);
    avatarElement.classList.add('user-dropdown__avatar--initials');
  }
}
