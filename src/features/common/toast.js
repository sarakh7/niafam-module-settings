/**
 * Toast Notification System
 *
 * A reusable toast notification component with 4 states: info, warning, error, success
 * Supports i18n, RTL/LTR, auto-dismiss, and multiple toast management
 *
 * @module features/common/toast
 */

import i18next from 'i18next';

/**
 * Toast configuration
 */
const TOAST_CONFIG = {
  duration: 3000, // Default duration in milliseconds
  position: 'top-right', // Default position
  maxToasts: 5, // Maximum number of simultaneous toasts
  animationDuration: 300, // Animation duration in milliseconds
};

/**
 * Toast types and their icons
 */
const TOAST_TYPES = {
  info: 'esprit-fi-rr-info',
  success: 'esprit-fi-rr-check-circle',
  warning: 'esprit-fi-rr-exclamation-triangle',
  error: 'esprit-fi-rr-cross-circle',
};

/**
 * Active toasts array
 */
let activeToasts = [];

/**
 * Toast container element
 */
let toastContainer = null;

/**
 * Initialize toast container
 * Creates the container element if it doesn't exist
 */
function initToastContainer() {
  if (toastContainer) return toastContainer;

  toastContainer = document.createElement('div');
  toastContainer.className = 'es-toast-container';
  toastContainer.setAttribute('role', 'region');
  toastContainer.setAttribute('aria-label', 'Notifications');
  document.body.appendChild(toastContainer);

  return toastContainer;
}

/**
 * Create a toast element
 * @param {string} message - The message to display
 * @param {string} type - Toast type (info, success, warning, error)
 * @param {Object} options - Additional options
 * @returns {HTMLElement} The toast element
 */
function createToastElement(message, type = 'info', options = {}) {
  const toast = document.createElement('div');
  toast.className = `es-toast es-toast--${type}`;
  toast.setAttribute('role', 'alert');
  toast.setAttribute('aria-live', type === 'error' ? 'assertive' : 'polite');

  // Get icon class
  const iconClass = TOAST_TYPES[type] || TOAST_TYPES.info;

  // Create toast content
  const content = `
    <div class="es-toast__content">
      <div class="es-toast__icon">
        <i class="es ${iconClass}"></i>
      </div>
      <div class="es-toast__message">${message}</div>
      <button class="es-toast__close" aria-label="${i18next.t('common.close')}" type="button">
        <i class="es esprit-fi-rr-cross-small"></i>
      </button>
    </div>
    <div class="es-toast__progress"></div>
  `;

  toast.innerHTML = content;

  // Add close button handler
  const closeBtn = toast.querySelector('.es-toast__close');
  closeBtn.addEventListener('click', () => {
    removeToast(toast);
  });

  return toast;
}

/**
 * Show a toast notification near an element (like a tooltip)
 * @param {string} message - The message to display
 * @param {HTMLElement} targetElement - The element to show toast near
 * @param {string} type - Toast type (info, success, warning, error)
 * @param {Object} options - Additional options
 * @param {number} options.duration - Duration in milliseconds
 * @param {string} options.placement - Placement relative to element (top, bottom, left, right)
 * @param {number} options.offset - Offset in pixels from element
 * @returns {HTMLElement} The toast element
 */
export function showToastNear(message, targetElement, type = 'info', options = {}) {
  if (!targetElement) {
    console.warn('Target element is required for showToastNear');
    return showToast(message, type, options);
  }

  const config = {
    duration: options.duration !== undefined ? options.duration : TOAST_CONFIG.duration,
    placement: options.placement || 'top',
    offset: options.offset || 10,
    onClose: options.onClose || null,
  };

  // Create a single-toast container near the element
  const nearContainer = document.createElement('div');
  nearContainer.className = 'es-toast-near-container';
  nearContainer.style.position = 'absolute';
  nearContainer.style.zIndex = '9999';
  nearContainer.style.maxWidth = '400px';
  nearContainer.style.width = 'auto';

  // Create toast element
  const toast = createToastElement(message, type, config);
  toast.classList.add('es-toast-near'); // Special class for near toasts
  nearContainer.appendChild(toast);
  document.body.appendChild(nearContainer);

  // Position the container near the target element after it's in DOM
  requestAnimationFrame(() => {
    positionToastNear(nearContainer, targetElement, config.placement, config.offset);

    // Show toast
    requestAnimationFrame(() => {
      toast.classList.add('es-toast--show');
    });
  });

  // Auto-dismiss if duration > 0
  if (config.duration > 0) {
    const progressBar = toast.querySelector('.es-toast__progress');
    if (progressBar) {
      progressBar.style.transitionDuration = `${config.duration}ms`;
      setTimeout(() => {
        progressBar.classList.add('es-toast__progress--complete');
      }, 10);
    }

    setTimeout(() => {
      removeToastNear(toast, nearContainer, config.onClose);
    }, config.duration);
  }

  return toast;
}

/**
 * Position toast container near target element
 * @param {HTMLElement} container - Toast container
 * @param {HTMLElement} target - Target element
 * @param {string} placement - Placement (top, bottom, left, right)
 * @param {number} offset - Offset in pixels
 */
function positionToastNear(container, target, placement, offset) {
  const rect = target.getBoundingClientRect();
  const scrollX = window.pageXOffset || document.documentElement.scrollLeft;
  const scrollY = window.pageYOffset || document.documentElement.scrollTop;

  let top, left;

  switch (placement) {
    case 'top':
      top = rect.top + scrollY - container.offsetHeight - offset;
      left = rect.left + scrollX + (rect.width / 2) - (container.offsetWidth / 2);
      break;
    case 'bottom':
      top = rect.bottom + scrollY + offset;
      left = rect.left + scrollX + (rect.width / 2) - (container.offsetWidth / 2);
      break;
    case 'left':
      top = rect.top + scrollY + (rect.height / 2) - (container.offsetHeight / 2);
      left = rect.left + scrollX - container.offsetWidth - offset;
      break;
    case 'right':
      top = rect.top + scrollY + (rect.height / 2) - (container.offsetHeight / 2);
      left = rect.right + scrollX + offset;
      break;
    default:
      top = rect.top + scrollY - container.offsetHeight - offset;
      left = rect.left + scrollX + (rect.width / 2) - (container.offsetWidth / 2);
  }

  // Keep within viewport
  const maxLeft = window.innerWidth - container.offsetWidth - 10;
  const maxTop = window.innerHeight - container.offsetHeight - 10;

  left = Math.max(10, Math.min(left, maxLeft));
  top = Math.max(10, Math.min(top, maxTop));

  container.style.top = `${top}px`;
  container.style.left = `${left}px`;
}

/**
 * Remove a near toast
 * @param {HTMLElement} toast - Toast element
 * @param {HTMLElement} container - Container element
 * @param {Function} onClose - Callback
 */
function removeToastNear(toast, container, onClose) {
  toast.classList.remove('es-toast--show');
  toast.classList.add('es-toast--hide');

  setTimeout(() => {
    if (container && container.parentElement) {
      container.parentElement.removeChild(container);
    }
    if (onClose) {
      onClose();
    }
  }, TOAST_CONFIG.animationDuration);
}

/**
 * Show a toast notification
 * @param {string} message - The message to display
 * @param {string} type - Toast type (info, success, warning, error)
 * @param {Object} options - Additional options
 * @param {number} options.duration - Duration in milliseconds (0 for no auto-dismiss)
 * @param {string} options.position - Position of toast container
 * @param {Function} options.onClose - Callback when toast is closed
 * @returns {HTMLElement} The toast element
 */
export function showToast(message, type = 'info', options = {}) {
  // Initialize container if needed
  if (!toastContainer) {
    initToastContainer();
  }

  // Merge options with defaults
  const config = {
    duration: options.duration !== undefined ? options.duration : TOAST_CONFIG.duration,
    position: options.position || TOAST_CONFIG.position,
    onClose: options.onClose || null,
  };

  // Update container position if needed
  if (config.position !== toastContainer.dataset.position) {
    toastContainer.dataset.position = config.position;
    toastContainer.className = `es-toast-container es-toast-container--${config.position}`;
  }

  // Check max toasts limit
  if (activeToasts.length >= TOAST_CONFIG.maxToasts) {
    // Remove oldest toast
    removeToast(activeToasts[0]);
  }

  // Create toast element
  const toast = createToastElement(message, type, config);

  // Add to container
  toastContainer.appendChild(toast);

  // Add to active toasts
  activeToasts.push(toast);

  // Trigger reflow for animation
  toast.offsetHeight;

  // Add show class for animation
  toast.classList.add('es-toast--show');

  // Auto-dismiss if duration > 0
  if (config.duration > 0) {
    // Start progress animation
    const progressBar = toast.querySelector('.es-toast__progress');
    progressBar.style.transitionDuration = `${config.duration}ms`;
    setTimeout(() => {
      progressBar.classList.add('es-toast__progress--complete');
    }, 10);

    // Remove toast after duration
    const timeoutId = setTimeout(() => {
      removeToast(toast);
    }, config.duration);

    // Store timeout ID for manual dismissal
    toast.dataset.timeoutId = timeoutId;
  }

  return toast;
}

/**
 * Remove a toast
 * @param {HTMLElement} toast - The toast element to remove
 */
export function removeToast(toast) {
  if (!toast || !toast.parentElement) return;

  // Clear timeout if exists
  if (toast.dataset.timeoutId) {
    clearTimeout(parseInt(toast.dataset.timeoutId));
  }

  // Remove from active toasts
  const index = activeToasts.indexOf(toast);
  if (index > -1) {
    activeToasts.splice(index, 1);
  }

  // Add hide class for animation
  toast.classList.remove('es-toast--show');
  toast.classList.add('es-toast--hide');

  // Remove element after animation
  setTimeout(() => {
    if (toast.parentElement) {
      toast.parentElement.removeChild(toast);
    }
  }, TOAST_CONFIG.animationDuration);
}

/**
 * Remove all toasts
 */
export function removeAllToasts() {
  [...activeToasts].forEach(toast => removeToast(toast));
}

/**
 * Convenience methods for different toast types
 */

export function showInfoToast(message, options = {}) {
  return showToast(message, 'info', options);
}

export function showSuccessToast(message, options = {}) {
  return showToast(message, 'success', options);
}

export function showWarningToast(message, options = {}) {
  return showToast(message, 'warning', options);
}

export function showErrorToast(message, options = {}) {
  return showToast(message, 'error', options);
}

/**
 * Initialize toast system
 * Sets up the toast container and global event listeners
 */
export function initToast() {
  // Create container
  initToastContainer();

  // Update toast close button labels when language changes
  if (i18next) {
    i18next.on('languageChanged', () => {
      const closeButtons = document.querySelectorAll('.es-toast__close');
      closeButtons.forEach(btn => {
        btn.setAttribute('aria-label', i18next.t('common.close'));
      });
    });
  }

  // Optional: Close all toasts on page navigation (if using SPA)
  // window.addEventListener('beforeunload', removeAllToasts);
}

// Auto-initialize if DOM is ready
if (typeof window !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initToast);
  } else {
    initToast();
  }
}
