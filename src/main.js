import { initGallery } from "./features/gallery";
import {
  initAudioPlayer,
  initReadingModeTts,
  initTts,
  initVideoPlayer,
} from "./features/mediaPlayer";
import { initAccessibilityActions } from "./features/accessibility";
import { initScrollNav } from "./utils/scrollNav";
// import "./assets/scss/main.scss";
import { initCopyShortUrl } from "./features/copyShortUrl";
import { initPdfGenerator } from "./features/pdfGenerator";
import { initPrintNewsContent } from "./features/printNewsContent";
import { setShareLinks } from "./features/shareLinks";
import { initStickySidebar } from "./features/stickySidebar";
import { initModal } from "./features/modal";
import { setLayout } from "./features/layout";
import { initI18n } from "./config/i18n";
import { initLocalization } from "./utils/i18n-localizer";
import { initTtsVisibility, initReadingModeTtsVisibility, syncTtsSource } from "./features/ttsManager";
import { initRelatedContent } from "./features/relatedContent";

/**
 * Initialize all application features
 */
async function initializeApp() {
  try {
    // CRITICAL: Initialize i18n FIRST
    await initI18n();
    console.log("i18n initialized successfully");
    initLocalization();

    // Then initialize all other features
    initGallery();
    initVideoPlayer();
    initAudioPlayer();
    initAccessibilityActions();
    initRelatedContent();
    initScrollNav("related-content-list");
    initCopyShortUrl();
    initPdfGenerator();
    initPrintNewsContent();
    setShareLinks("");

    // Check TTS visibility before initializing player
    if (initTtsVisibility()) {
      initTts();
    }

    // Sync TTS source from main to reading mode
    syncTtsSource();

    // Check Reading Mode TTS visibility before initializing player
    if (initReadingModeTtsVisibility()) {
      initReadingModeTts();
    }
    initStickySidebar();
    initModal();
    setLayout();

    console.log("Application initialized successfully");
  } catch (error) {
    console.error("Failed to initialize application:", error);
  }
}

// Start initialization when DOM is ready
document.addEventListener("DOMContentLoaded", initializeApp);
