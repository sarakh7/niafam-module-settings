import { initI18n } from "./config/i18n";
import { initLocalization } from "./utils/i18n-localizer";
import { loadSettingsFromFile, getDirectionFromHTML } from "./config/settings";
import { initTicketTracking } from "./features/ticketing/ticketTracking";
import "./assets/scss/ticketing.scss";

/**
 * Initialize ticketing application features
 */
async function initializeTicketingApp() {
  try {
    // CRITICAL: Load settings from file FIRST (before i18n)
    await loadSettingsFromFile();

    // CRITICAL: Initialize i18n SECOND
    await initI18n();

    // Auto-detect and set direction if not already set in HTML
    if (!document.documentElement.dir) {
      document.documentElement.dir = getDirectionFromHTML();
    }

    initLocalization();

    // Initialize ticket tracking feature
    // initTicketTracking();

    // console.log("Ticketing application initialized successfully");
  } catch (error) {
    console.error("Failed to initialize ticketing application:", error);
  }
}

// Start initialization when DOM is ready
document.addEventListener("DOMContentLoaded", initializeTicketingApp);
