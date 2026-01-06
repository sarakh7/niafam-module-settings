import { initI18n } from "./config/i18n";
import { initLocalization } from "./utils/i18n-localizer";
import { loadSettingsFromFile, getDirectionFromHTML } from "./config/settings";
import { initUserDropdown, updateUserDropdown } from "./features/common/userDropdown";
import { initAuthNav } from "./features/auth/authNav";
import { initLoginForm } from "./features/auth/loginForm";
import { initOTPForm } from "./features/auth/otpForm";
import { initRegistrationForm } from "./features/auth/registrationForm";
import { initPasswordResetForm } from "./features/auth/passwordResetForm";
import "./assets/scss/auth.scss";

/**
 * Initialize authentication application features
 * CRITICAL: Must follow strict initialization order
 */
async function initializeAuthApp() {
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

    // Initialize common features
    initUserDropdown();

    // Get user data from HTML
    const userNameElement = document.querySelector('.user-dropdown__header-name');
    const userEmailElement = document.querySelector('.user-dropdown__header-email');

    if (userNameElement && userEmailElement) {
      updateUserDropdown({
        name: userNameElement.textContent.trim(),
        email: userEmailElement.textContent.trim(),
      });
    }

    // Initialize auth-specific features
    // initAuthNav();
    initLoginForm();
    initOTPForm();
    initRegistrationForm();
    initPasswordResetForm();

    console.log("Authentication application initialized successfully");
  } catch (error) {
    console.error("Failed to initialize authentication application:", error);
  }
}

// Start initialization when DOM is ready
document.addEventListener("DOMContentLoaded", initializeAuthApp);
