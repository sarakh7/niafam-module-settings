import { initI18n } from "./config/i18n";
import { initLocalization } from "./utils/i18n-localizer";
import { loadSettingsFromFile } from "./config/settings";
import { initContentsList } from "./features/contents/contentsList";
import "./assets/scss/contents-list.scss";

/**
 * Initialize the Contents List page
 * CRITICAL: Follow strict initialization order
 * 1. loadSettingsFromFile() - FIRST
 * 2. initI18n() - SECOND
 * 3. initLocalization() - THIRD
 * 4. Feature initialization - FOURTH
 */
async function initializeApp() {
  try {
    // CRITICAL: Load settings from file FIRST (before i18n)
    await loadSettingsFromFile();

    // CRITICAL: Initialize i18n SECOND
    await initI18n();
    initLocalization();

    // Initialize contents list feature (animations, interactions)
    if (document.querySelector(".esprit-contents-list-items")) {
      initContentsList();
    }

    console.log("Contents List page initialized successfully");
  } catch (error) {
    console.error("Failed to initialize Contents List page:", error);
  }
}

// Start initialization when DOM is ready
document.addEventListener("DOMContentLoaded", initializeApp);
