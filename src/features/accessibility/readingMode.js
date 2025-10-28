/**
 * Initializes the reading mode functionality
 * This creates a text-only view of the article by cloning content and removing images
 * @param {Function} resetSettings - Callback function to reset reading mode settings
 */
export function showTextOnly(resetSettings) {
  const textOnlyBtn = document.querySelector("#open-reading-mode");

  if (!textOnlyBtn) return;

  textOnlyBtn.addEventListener("click", function () {
    if (resetSettings) {
      resetSettings();
    }

    const source = document.querySelector(".esprit-article__main-content");
    const target = document.getElementById("modal-reading-mode-content");

    if (!source || !target) return;

    // Complete replacement each time
    target.innerHTML = "";
    const clone = source.cloneNode(true);

    // Remove all images
    clone.querySelectorAll("img").forEach((img) => img.remove());

    target.appendChild(clone);

    // Now clean up the copied version
    const allElements = target.querySelectorAll("*");

    // List of classes that should not be removed
    const keepClasses = [
      "accessible-keep",
      "accessible-hidden",
      "esprit-article-accessibility__reloadPageBtn",
    ];

    // Identify elements that should be protected
    const protectedElements = new Set();
    const keepRoots = target.querySelectorAll(".accessible-keep");
    keepRoots.forEach((el) => {
      protectedElements.add(el);
      const descendants = el.querySelectorAll("*");
      descendants.forEach((child) => protectedElements.add(child));
    });

    // Remove classes and attributes from other elements
    allElements.forEach((el) => {
      if (protectedElements.has(el)) return;

      const kept = [...el.classList].filter((cls) => keepClasses.includes(cls));
      el.className = kept.join(" ");

      el.removeAttribute("style");
      el.removeAttribute("role");
      el.removeAttribute("aria-label");
      el.removeAttribute("aria-hidden");
      el.removeAttribute("tabindex");
    });

    // Hide specific elements
    const hiddenElements = target.querySelectorAll(".accessible-hidden");
    hiddenElements.forEach((el) => {
      el.style.display = "none";
    });
  });
}
