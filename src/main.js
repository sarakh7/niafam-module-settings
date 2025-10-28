import { initGallery } from "./features/common/gallery";
import {
  initAudioPlayer,
  initReadingModeTts,
  initTts,
  initVideoPlayer,
} from "./features/common/mediaPlayer";
import { initAccessibilityActions } from "./features/news/accessibility";
import { initScrollNav } from "./utils/scrollNav";
import { initCopyShortUrl } from "./features/common/copyShortUrl";
import { initPdfGenerator } from "./features/news/pdfGenerator";
import { initPrintNewsContent } from "./features/news/printNewsContent";
import { setShareLinks } from "./features/news/shareLinks";
import { initStickySidebar } from "./features/news/stickySidebar";
import { initModal } from "./features/common/modal";
import { setLayout } from "./features/news/layout";
import { initI18n } from "./config/i18n";
import { initLocalization } from "./utils/i18n-localizer";
import { initTtsVisibility, initReadingModeTtsVisibility, syncTtsSource } from "./features/news/ttsManager";
import { initRelatedContent } from "./features/news/relatedContent";
import { loadSettingsFromFile } from "./config/settings";
import "./assets/scss/news.scss";

/**
 * Initialize all application features
 */
async function initializeApp() {
  try {
    // CRITICAL: Load settings from file FIRST (before i18n)
    await loadSettingsFromFile();

    // CRITICAL: Initialize i18n SECOND
    await initI18n();
    // console.log("i18n initialized successfully");
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

    // console.log("Application initialized successfully");
  } catch (error) {
    console.error("Failed to initialize application:", error);
  }
}

// Start initialization when DOM is ready
document.addEventListener("DOMContentLoaded", initializeApp);
