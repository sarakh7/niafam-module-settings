/**
 * Handles the toggling of active state for accessibility control buttons
 * Ensures only one button is active at a time within a container
 * @param {string} containerSelector - CSS selector for the container holding the buttons
 */
export function handleButtonToggling(containerSelector) {
  console.log("containerSelector", containerSelector);

  // First, find the slider container
  const container = document.querySelector(containerSelector);
  console.log("containerSelector", containerSelector, container);

  if (!container) return;

  // Find buttons only within that container
  const buttons = container.querySelectorAll(
    ".es-article-accessibility-control-btn"
  );

  buttons.forEach((button) => {
    button.addEventListener("click", (e) => {
      // Remove active class only within the same container
      buttons.forEach((btn) => btn.classList.remove("active"));
      e.currentTarget.classList.add("active");
    });
  });
}
