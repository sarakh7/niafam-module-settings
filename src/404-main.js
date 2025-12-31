/**
 * 404 Error Page Module - Main Entry Point
 * Independent module for 404 Not Found page
 */

import { initI18n } from "./config/i18n";
import { initLocalization } from "./utils/i18n-localizer";
import { loadSettingsFromFile, getDirectionFromHTML } from "./config/settings";
import { init404Page } from "./features/404/notFound404";
import "./assets/scss/404.scss";

/**
 * Initialize 404 page application features
 */
async function initialize404App() {
  try {
    // CRITICAL ORDER:
    // 1. Load settings from file FIRST
    await loadSettingsFromFile();

    // 2. Initialize i18n SECOND
    await initI18n();

    // 3. Auto-detect and set direction
    if (!document.documentElement.dir) {
      document.documentElement.dir = getDirectionFromHTML();
    }

    initLocalization();

    // 4. Initialize 404 page features
    init404Page();

    console.log("404 page initialized successfully");
  } catch (error) {
    console.error("Failed to initialize 404 page:", error);
  }
}

// Start initialization when DOM is ready
document.addEventListener("DOMContentLoaded", initialize404App);
