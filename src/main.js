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
import { initTtsVisibility, initReadingModeTtsVisibility } from "./features/news/ttsManager";
import { initRelatedContent } from "./features/news/relatedContent";
import { loadSettingsFromFile } from "./config/settings";
import { initCommentReplyToggle } from "./features/news/commentReplyToggle";
import { initTtsAutoLoader } from "./features/news/ttsAutoLoader";
import { initArticleMetadata } from "./features/news/articleMetadata";
import { initRatingTooltips, observeRatingElements } from "./features/news/ratingTooltip";
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

    // Initialize article metadata (icons and labels for cast roles)
    // Only if metadata container exists
    if (document.querySelector(".esprit-article__metadata") || document.getElementById("esprit-article-info")) {
      initArticleMetadata();
    }

    // Initialize gallery - only if pictures section exists
    if (document.getElementById("article-pictures") || document.querySelector(".esprit-article__gallery")) {
      initGallery();
    }

    // Initialize video player - only if videos section exists
    if (document.getElementById("article-videos") || document.getElementById("main-video")) {
      initVideoPlayer();
    }

    // Initialize audio player - only if sounds section exists
    if (document.getElementById("article-sounds") || document.getElementById("main-audio")) {
      initAudioPlayer();
    }

    // Initialize accessibility controls - only if controls container exists
    if (document.getElementById("esprit-article-accessibility-controls")) {
      initAccessibilityActions();
    }

    // Initialize related content - only if related news section exists
    if (document.getElementById("article-related-news") || document.querySelector(".esprit-article__related-news")) {
      initRelatedContent();
      initScrollNav("related-content-list");
    }

    // Initialize copy short URL - only if button exists
    if (document.getElementById("copy-shorturl-btn")) {
      initCopyShortUrl();
    }

    // Initialize PDF generator - only if button exists
    if (document.getElementById("create-pdf")) {
      initPdfGeneratorLazy();
    }

    // Initialize print - only if button exists
    if (document.getElementById("print-content")) {
      initPrintNewsContent();
    }

    // Initialize share links - only if share container exists
    if (document.getElementById("es-article-share") || document.getElementById("esprit-article-tools-share")) {
      setShareLinks("");
    }

    // Auto-load generated TTS files into both players BEFORE initializing
    // Only if TTS container exists
    if (document.getElementById("tts-container")) {
      initTtsAutoLoader();
    }

    // Check TTS visibility and initialize players
    if (document.getElementById("tts-container") && initTtsVisibility()) {
      initTts();
    }

    // Initialize reading mode TTS - only if modal exists
    if (document.getElementById("modal-reading-mode") && initReadingModeTtsVisibility()) {
      initReadingModeTts();
    }

    // Initialize sticky sidebar - only if sidebar exists
    if (document.getElementById("es-page-sidebar") || document.querySelector(".esprit-aside.es-page-sidebar")) {
      initStickySidebar();
    }

    // Initialize modals - only if any modal exists
    if (document.querySelector(".modal.micromodal-slide")) {
      initModal();
    }

    // Initialize layout (always runs as it manages global layout)
    setLayout();

    // Initialize comment reply toggle - only if product reviews section exists
    if (document.querySelector(".product-reviews")) {
      initCommentReplyToggle();
    }

    // Initialize rating tooltips - only if rating elements exist
    if (document.querySelector(".es-rating")) {
      initRatingTooltips();
      observeRatingElements();
    }

    // console.log("Application initialized successfully");
  } catch (error) {
    console.error("Failed to initialize application:", error);
  }
}

// Start initialization when DOM is ready
document.addEventListener("DOMContentLoaded", initializeApp);
