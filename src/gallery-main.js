import { initI18n } from "./config/i18n";
import { initLocalization } from "./utils/i18n-localizer";
import { loadSettingsFromFile, getDirectionFromHTML } from "./config/settings";
import { initImageGallery } from "./features/gallery/imageGallery";
import { initVideoSection } from "./features/gallery/videoSection";
import { initAudioSection } from "./features/gallery/audioSection";
import { initCopyShortUrl } from "./features/common/copyShortUrl";
import "./assets/scss/gallery.scss";

/**
 * Initialize gallery application features
 */
async function initializeGalleryApp() {
  try {
    // CRITICAL ORDER:
    // 1. Load settings FIRST (before i18n)
    await loadSettingsFromFile();

    // 2. Initialize i18n SECOND
    await initI18n();

    // Auto-detect and set direction if not already set in HTML
    if (!document.documentElement.dir) {
      document.documentElement.dir = getDirectionFromHTML();
    }

    initLocalization();

    // 3. Initialize gallery sections
    if (document.getElementById('gallery-section-images')) {
      initImageGallery();
    }

    if (document.getElementById('gallery-section-videos')) {
      initVideoSection();
    }

    if (document.getElementById('gallery-section-sounds')) {
      initAudioSection();
    }

    // Initialize short URL copy functionality
    initCopyShortUrl();

    console.log("Gallery page initialized successfully");
  } catch (error) {
    console.error("Failed to initialize gallery page:", error);
  }
}

// Start initialization when DOM is ready
document.addEventListener("DOMContentLoaded", initializeGalleryApp);
