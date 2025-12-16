import { initI18n } from "./config/i18n";
import { initLocalization } from "./utils/i18n-localizer";
import { loadSettingsFromFile } from "./config/settings";
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
    initLocalization();

    // Initialize common features
    initUserDropdown();

    // Mock user data for demo
    updateUserDropdown({
      name: 'جان دو',
      email: 'john.doe@example.com',
    });

    // Initialize auth-specific features
    initAuthNav();
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
