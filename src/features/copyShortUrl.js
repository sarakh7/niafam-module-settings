async function copyToClipboard(text) {
  if (navigator.clipboard && window.isSecureContext) {
    // modern and safe method
    return navigator.clipboard
      .writeText(text)
      .then(() => true)
      .catch((err) => {
        console.error("Clipboard write failed:", err);
        return false;
      });
  } else {
    // fallback for old browsers
    return new Promise((resolve, reject) => {
      const textarea = document.createElement("textarea");
      textarea.value = text;

      //To prevent the textarea from being displayed to the user
      textarea.style.position = "fixed";
      textarea.style.top = 0;
      textarea.style.left = 0;
      textarea.style.opacity = 0;

      document.body.appendChild(textarea);
      textarea.focus();
      textarea.select();

      try {
        const successful = document.execCommand("copy");
        resolve(successful);
      } catch (err) {
        console.error("Fallback: Oops, unable to copy", err);
        reject(false);
      } finally {
        document.body.removeChild(textarea);
      }
    });
  }
}

function showAlert(options = {}) {
  const { el, duration = 2000, alertClass = "default", content = "" } = options;
  if (el) {
    el.innerHTML = content;

    el.classList.add("show", alertClass);
    setTimeout(() => {
      el.classList.remove("show", alertClass);
    }, duration);
  }
}

export function copyShortUrl(options = {}) {
  const {
    btnId = "copy-shorturl-btn",
    inputId = "shorturlitem",
    alertId = "shortur-alert",
  } = options;
  const copyLinkButton = document.getElementById(btnId);

  if (!copyLinkButton) return;

  copyLinkButton.addEventListener("click", (e) => {
    e.preventDefault();
    const shortUrlItem = document.getElementById(inputId);
    const shortUlrTolltip = document.getElementById(alertId);

    if (shortUrlItem) {
      const text = shortUrlItem.getAttribute("value");
      copyToClipboard(text || "").then((success) => {
        if (success && shortUlrTolltip) {
          const alertContent = `<i class="es esprit-fi-rr-check"></i><span>کپی شد</span>`;
          showAlert({ el: shortUlrTolltip, content: alertContent });
        } else {
          const alertContent = `<i class="es esprit-fi-rr-cross"></i><span>کپی نشد!</span>`;
          showAlert({
            el: shortUlrTolltip,
            alertClass: "error",
            content: alertContent,
          });
        }
      });
    }
  });
}
