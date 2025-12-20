import { initI18n } from "./config/i18n";
import { initLocalization } from "./utils/i18n-localizer";
import { loadSettingsFromFile } from "./config/settings";
import "./assets/scss/gallery-categories.scss";

/**
 * Initialize gallery categories page
 */
async function initializeGalleryCategoriesApp() {
  try {
    // CRITICAL ORDER:
    // 1. Load settings FIRST (before i18n)
    await loadSettingsFromFile();

    // 2. Initialize i18n SECOND
    await initI18n();
    initLocalization();

    console.log("Gallery categories page initialized successfully");
  } catch (error) {
    console.error("Failed to initialize gallery categories page:", error);
  }
}

// Start initialization when DOM is ready
document.addEventListener("DOMContentLoaded", initializeGalleryCategoriesApp);
