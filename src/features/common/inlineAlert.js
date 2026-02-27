/**
 * Inline Alert System
 * Displays alerts inline within a container (not floating toasts)
 */

/**
 * Show an inline alert message
 * @param {string} type - Alert type: 'success', 'error', 'warning', 'info'
 * @param {string} message - Alert message to display
 * @param {string} containerId - ID of container to insert alert into (without #)
 */
export function showInlineAlert(type, message, containerId = 'alerts') {
  const container = document.getElementById(containerId);

  if (!container) {
    console.warn(`Alert container #${containerId} not found`);
    return;
  }

  // Clear previous alerts
  container.innerHTML = '';

  // Determine icon based on type
  const icons = {
    success: 'esprit-fi-rr-check-circle',
    error: 'esprit-fi-rr-cross-circle',
    warning: 'esprit-fi-rr-exclamation-triangle',
    info: 'esprit-fi-rr-info'
  };

  const icon = icons[type] || icons.info;

  // Create alert element
  const alertEl = document.createElement('div');
  alertEl.className = `inline-alert inline-alert--${type}`;
  alertEl.setAttribute('role', 'alert');

  alertEl.innerHTML = `
    <div class="inline-alert__content">
      <i class="es ${icon} inline-alert__icon"></i>
      <span class="inline-alert__message">${message}</span>
    </div>
    <button type="button" class="inline-alert__close" aria-label="Close">
      <i class="es esprit-fi-rr-cross"></i>
    </button>
  `;

  // Add to container
  container.appendChild(alertEl);

  // Add dismiss functionality
  const closeBtn = alertEl.querySelector('.inline-alert__close');
  closeBtn?.addEventListener('click', () => {
    alertEl.classList.add('inline-alert--dismissing');
    setTimeout(() => alertEl.remove(), 300);
  });

  // Trigger animation
  setTimeout(() => alertEl.classList.add('inline-alert--visible'), 10);
}

/**
 * Clear all alerts from a container
 * @param {string} containerId - ID of container to clear (without #)
 */
export function clearInlineAlerts(containerId = 'alerts') {
  const container = document.getElementById(containerId);
  if (container) {
    container.innerHTML = '';
  }
}
