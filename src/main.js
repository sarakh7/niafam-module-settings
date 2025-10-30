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
 * Initialize PDF generator with lazy loading
 * Loads the heavy jsPDF library only when user clicks the PDF button
 * @returns {void}
 */
function initPdfGeneratorLazy() {
  const button = document.getElementById("create-pdf");

  if (!button) {
    console.warn("PDF generator button not found: #create-pdf");
    return;
  }

  // Add click handler that lazy loads the PDF generator module
  button.addEventListener("click", async () => {
    try {
      button.disabled = true;
      button.classList.add("disabled");

      // Dynamically import the PDF generator module (includes jsPDF ~150KB)
      const { generatePDF } = await import("./features/news/pdfGenerator");

      // Generate the PDF
      await generatePDF();

      button.disabled = false;
      button.classList.remove("disabled");
    } catch (error) {
      console.error("PDF generation error:", error);
      // Use i18next for error message if available
      const errorMessage = window.i18next?.t("pdf.generationError") || "خطا در تولید PDF";
      alert(errorMessage);
      button.disabled = false;
      button.classList.remove("disabled");
    }
  }, { once: false }); // Allow multiple PDF generations
}

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
    initPdfGeneratorLazy();
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
