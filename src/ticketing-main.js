import { initI18n } from "./config/i18n";
import { initLocalization } from "./utils/i18n-localizer";
import { loadSettingsFromFile } from "./config/settings";
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
    initLocalization();

    // Initialize ticket tracking feature
    initTicketTracking();

    // console.log("Ticketing application initialized successfully");
  } catch (error) {
    console.error("Failed to initialize ticketing application:", error);
  }
}

// Start initialization when DOM is ready
document.addEventListener("DOMContentLoaded", initializeTicketingApp);
