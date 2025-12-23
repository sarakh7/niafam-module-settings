import { initI18n } from "./config/i18n";
import { initLocalization } from "./utils/i18n-localizer";
import { loadSettingsFromFile } from "./config/settings";
import "./assets/scss/general-subcategories.scss";

/**
 * Initialize general subcategories page
 *
 * CRITICAL INITIALIZATION ORDER:
 * 1. loadSettingsFromFile() - FIRST (loads configuration from JSON files)
 * 2. initI18n() - SECOND (initializes internationalization)
 * 3. initLocalization() - THIRD (sets up DOM localization)
 */
async function initializeGeneralSubcategoriesApp() {
  try {
    // CRITICAL: Load settings from file FIRST (before i18n)
    await loadSettingsFromFile();

    // CRITICAL: Initialize i18n SECOND
    await initI18n();
    initLocalization();

    console.log("General subcategories page initialized successfully");
  } catch (error) {
    console.error("Failed to initialize general subcategories page:", error);
  }
}

// Start initialization when DOM is ready
document.addEventListener("DOMContentLoaded", initializeGeneralSubcategoriesApp);
