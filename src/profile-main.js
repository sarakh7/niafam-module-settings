import { initI18n } from "./config/i18n";
import { initLocalization } from "./utils/i18n-localizer";
import { loadSettingsFromFile, getDirectionFromHTML } from "./config/settings";
import { initDashboardMenu } from "./features/profile/dashboardMenu";
import { initTabNavigation } from "./features/profile/tabNavigation";
import { initProfileForm } from "./features/profile/profileForm";
import { initPasswordForm } from "./features/profile/passwordForm";
import { initAvatarUpload } from "./features/profile/avatarUpload";
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

    // Auto-detect and set direction if not already set in HTML
    if (!document.documentElement.dir) {
      document.documentElement.dir = getDirectionFromHTML();
    }

    initLocalization();

    // Initialize dashboard menu toggle
    initDashboardMenu();

    // Initialize profile edit page features
    initTabNavigation();
    initProfileForm();
    initPasswordForm();
    initAvatarUpload();

    console.log("Profile application initialized successfully");
  } catch (error) {
    console.error("Failed to initialize profile application:", error);
  }
}

// Start initialization when DOM is ready
document.addEventListener("DOMContentLoaded", initializeProfileApp);
