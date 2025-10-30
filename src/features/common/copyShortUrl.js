import i18next from "i18next";

/**
 * Copy text to clipboard with fallback for older browsers
 * @param {string} text - Text to copy
 * @returns {Promise<boolean>} Success status
 */
async function copyToClipboard(text) {
  if (navigator.clipboard && window.isSecureContext) {
    // Modern and secure method
    return navigator.clipboard
      .writeText(text)
      .then(() => true)
      .catch((err) => {
        console.error("Clipboard write failed:", err);
        return false;
      });
  } else {
    // Fallback for older browsers
    return new Promise((resolve) => {
      const textarea = document.createElement("textarea");
      textarea.value = text;

      // Prevent the textarea from being displayed
      textarea.style.position = "fixed";
      textarea.style.top = "0";
      textarea.style.left = "0";
      textarea.style.opacity = "0";

      document.body.appendChild(textarea);
      textarea.focus();
      textarea.select();

      try {
        const successful = document.execCommand("copy");
        resolve(successful);
      } catch (err) {
        console.error("Fallback: Unable to copy", err);
        resolve(false);
      } finally {
        document.body.removeChild(textarea);
      }
    });
  }
}

/**
 * Show temporary alert notification
 * @param {Object} options - Alert options
 * @param {HTMLElement} options.el - Alert element
 * @param {number} [options.duration=2000] - Display duration in ms
 * @param {string} [options.alertClass='default'] - Alert CSS class
 * @param {string} [options.iconClass=''] - Icon CSS class
 * @param {string} [options.message=''] - Alert text message
 */
function showAlert(options = {}) {
  const { el, duration = 2000, alertClass = "default", iconClass = "", message = "" } = options;

  if (!el) {
    console.warn("Alert element not provided");
    return;
  }

  // Security: Use DOM methods instead of innerHTML to prevent XSS
  el.textContent = ""; // Clear existing content

  // Add icon if provided
  if (iconClass) {
    const icon = document.createElement('i');
    icon.className = iconClass;
    el.appendChild(icon);
  }

  // Add message as text (safe - no HTML injection)
  if (message) {
    const span = document.createElement('span');
    span.textContent = message;
    el.appendChild(span);
  }

  el.classList.add("show", alertClass);

  setTimeout(() => {
    el.classList.remove("show", alertClass);
  }, duration);
}

/**
 * Validate if a string is a valid URL
 * @param {string} string - String to validate
 * @returns {boolean} True if valid URL
 */
function isValidUrl(string) {
  if (!string || string.trim() === "") {
    return false;
  }

  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
}

/**
 * Initialize short URL copy functionality
 * @param {Object} options - Configuration options
 * @param {string} [options.btnId='copy-shorturl-btn'] - Copy button ID
 * @param {string} [options.inputId='shorturlitem'] - Hidden input ID
 * @param {string} [options.alertId='shortur-alert'] - Alert element ID
 * @returns {void}
 */
export function initCopyShortUrl(options = {}) {
  const {
    btnId = "copy-shorturl-btn",
    inputId = "shorturlitem",
    alertId = "shortur-alert",
  } = options;

  const copyLinkButton = document.getElementById(btnId);
  if (!copyLinkButton) {
    console.warn(`Copy button not found: #${btnId}`);
    return;
  }

  copyLinkButton.addEventListener("click", (e) => {
    e.preventDefault();

    const shortUrlItem = document.getElementById(inputId);
    const shortUrlTooltip = document.getElementById(alertId);

    if (!shortUrlItem) {
      console.warn(`Short URL input not found: #${inputId}`);
      return;
    }

    let text = shortUrlItem.getAttribute("value");

    // If value is empty or not a valid URL, use current page URL
    if (!isValidUrl(text)) {
      text = window.location.href;
    }

    copyToClipboard(text).then((success) => {
      if (!shortUrlTooltip) return;

      if (success) {
        showAlert({
          el: shortUrlTooltip,
          iconClass: "es esprit-fi-rr-check",
          message: i18next.t("tools.shortlink.copied")
        });
      } else {
        showAlert({
          el: shortUrlTooltip,
          alertClass: "error",
          iconClass: "es esprit-fi-rr-cross",
          message: i18next.t("tools.shortlink.failed")
        });
      }
    });
  });
}