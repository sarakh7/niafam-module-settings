/**
 * General Module - Main Entry Point
 * For standalone pages like 404, 500, maintenance, etc.
 */

import { initI18n } from "./config/i18n";
import { initLocalization } from "./utils/i18n-localizer";
import { loadSettingsFromFile } from "./config/settings";
import { init404Page } from "./features/general/notFound404";
import "./assets/scss/general.scss";

/**
 * Initialize general module application features
 */
async function initializeGeneralApp() {
  try {
    // CRITICAL: Load settings from file FIRST (before i18n)
    await loadSettingsFromFile();

    // CRITICAL: Initialize i18n SECOND
    await initI18n();
    initLocalization();

    // Initialize 404 page features
    init404Page();

    console.log("General module initialized successfully");
  } catch (error) {
    console.error("Failed to initialize general module:", error);
  }
}

// Start initialization when DOM is ready
document.addEventListener("DOMContentLoaded", initializeGeneralApp);
