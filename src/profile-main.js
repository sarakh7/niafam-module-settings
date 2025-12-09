import { initI18n } from "./config/i18n";
import { initLocalization } from "./utils/i18n-localizer";
import { loadSettingsFromFile } from "./config/settings";
import { initDashboardMenu } from "./features/profile/dashboardMenu";
import "./assets/scss/profile.scss";

/**
 * Initialize profile application features
 */
async function initializeProfileApp() {
  try {
    // CRITICAL: Load settings from file FIRST (before i18n)
    await loadSettingsFromFile();

    // CRITICAL: Initialize i18n SECOND
    await initI18n();
    initLocalization();

    // Initialize dashboard menu toggle
    initDashboardMenu();

    // console.log("Profile application initialized successfully");
  } catch (error) {
    console.error("Failed to initialize profile application:", error);
  }
}

// Start initialization when DOM is ready
document.addEventListener("DOMContentLoaded", initializeProfileApp);
