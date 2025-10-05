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
 * @param {string} [options.content=''] - Alert HTML content
 */
function showAlert(options = {}) {
  const { el, duration = 2000, alertClass = "default", content = "" } = options;
  
  if (!el) {
    console.warn("Alert element not provided");
    return;
  }

  el.innerHTML = content;
  el.classList.add("show", alertClass);
  
  setTimeout(() => {
    el.classList.remove("show", alertClass);
  }, duration);
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

    const text = shortUrlItem.getAttribute("value");
    
    copyToClipboard(text || "").then((success) => {
      if (!shortUrlTooltip) return;

      if (success) {
        const alertContent = `<i class="es esprit-fi-rr-check"></i><span>کپی شد</span>`;
        showAlert({ el: shortUrlTooltip, content: alertContent });
      } else {
        const alertContent = `<i class="es esprit-fi-rr-cross"></i><span>کپی نشد!</span>`;
        showAlert({
          el: shortUrlTooltip,
          alertClass: "error",
          content: alertContent,
        });
      }
    });
  });
}