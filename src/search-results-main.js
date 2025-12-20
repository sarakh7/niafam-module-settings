import { initI18n } from "./config/i18n";
import { initLocalization } from "./utils/i18n-localizer";
import { loadSettingsFromFile } from "./config/settings";
import { initSearchResults } from "./features/general/searchResults";
import "./assets/scss/search-results.scss";

/**
 * Initialize search results application features
 */
async function initializeSearchResultsApp() {
  try {
    // CRITICAL: Load settings from file FIRST (before i18n)
    await loadSettingsFromFile();

    // CRITICAL: Initialize i18n SECOND
    await initI18n();
    initLocalization();

    // Initialize search results features
    initSearchResults();

    console.log("Search results application initialized successfully");
  } catch (error) {
    console.error("Failed to initialize search results application:", error);
  }
}

// Start initialization when DOM is ready
document.addEventListener("DOMContentLoaded", initializeSearchResultsApp);
