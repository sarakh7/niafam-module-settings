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

function showTooltip(el, duration = 2000, tooltipClass = "show") {
  el.classList.add(tooltipClass);
  setTimeout(() => {
    el.classList.remove(tooltipClass);
  }, duration);
}

export function copyShortUrl(
  btnId = "copy-shorturl-btn",
  inputId = "shorturlitem",
  tooltipId = "shortur-alert"
) {
  const copyLinkButton = document.getElementById(btnId);

  if (!copyLinkButton) return;

  copyLinkButton.addEventListener("click", (e) => {
    e.preventDefault();
    const shortUrlItem = document.getElementById(inputId);
    const shortUlrTolltip = document.getElementById(tooltipId);

    if (shortUrlItem) {
      const text = shortUrlItem.getAttribute("value");
      copyToClipboard(text || "").then((success) => {
        if (success && shortUlrTolltip) {
          shortUlrTolltip.innerHTML = `<i class="es esprit-fi-rr-check"></i><span>کپی شد</span>`;
          showTooltip(shortUlrTolltip);
        } else {
          shortUlrTolltip.innerHTML = `<i class="es esprit-fi-rr-cross"></i><span>کپی نشد!</span>`;
          showTooltip(shortUlrTolltip, 2000, "show--error");
        }
      });
    }
  });
}
