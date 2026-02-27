import { initGallery } from "./features/common/gallery";
import { initAccessibilityActions } from "./features/contents/accessibility";
import { initScrollNav } from "./utils/scrollNav";
import { initCopyShortUrl } from "./features/common/copyShortUrl";
import { initPrintNewsContent } from "./features/contents/printNewsContent";
import { setShareLinks } from "./features/contents/shareLinks";
import { initStickySidebar } from "./features/contents/stickySidebar";
import { initModal } from "./features/common/modal";
import { setLayout } from "./features/contents/layout";
import { initI18n } from "./config/i18n";
import { initLocalization } from "./utils/i18n-localizer";
import { initTtsVisibility, initReadingModeTtsVisibility } from "./features/contents/ttsManager";
import { initRelatedContent } from "./features/contents/relatedContent";
import { initRelatedNews } from "./features/contents/relatedNews";
import { loadSettingsFromFile, getDirectionFromHTML } from "./config/settings";
import { initCommentReplyToggle } from "./features/contents/commentReplyToggle";
import { initTtsAutoLoader } from "./features/contents/ttsAutoLoader";
import { initArticleMetadata } from "./features/contents/articleMetadata";
import { initVideoPlayer, initAudioPlayer, initTts, initReadingModeTts } from "./features/common/mediaPlayer";
import "./features/contents/ratingTooltip"; // Make showRatingTooltip globally accessible
import "./assets/scss/contents.scss";

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
  button.addEventListener(
    "click",
    async () => {
      try {
        button.disabled = true;
        button.classList.add("disabled");

        // Dynamically import the PDF generator module (includes jsPDF ~150KB)
        const { generatePDF } = await import("./features/contents/pdfGenerator");

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
    },
    { once: false },
  ); // Allow multiple PDF generations
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

    // Auto-detect and set direction if not already set in HTML
    if (!document.documentElement.dir) {
      document.documentElement.dir = getDirectionFromHTML();
    }

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

    // === Media Player (dynamic import — only loads on pages with media elements) ===

    // 1. Auto-load TTS files FIRST (sets audio src before visibility check)
    if (document.getElementById("tts-container")) {
      initTtsAutoLoader();
    }

    // 2. Determine which player features are needed
    const hasVideo = !!(document.getElementById("article-videos") || document.getElementById("main-video"));
    const hasAudio = !!(document.getElementById("article-sounds") || document.getElementById("main-audio"));
    const hasTts = !!(document.getElementById("tts-container") && initTtsVisibility());
    const hasReadMode = !!(document.getElementById("modal-reading-mode") && initReadingModeTtsVisibility());

    // 3. Only download Plyr/mediaPlayer if at least one media element exists
    if (hasVideo) initVideoPlayer();
    if (hasAudio) initAudioPlayer();
    if (hasTts) initTts();
    if (hasReadMode) initReadingModeTts();

    // Initialize accessibility controls - only if controls container exists
    if (document.getElementById("esprit-article-accessibility-controls")) {
      initAccessibilityActions();
    }

    // Initialize related content - only if related news section exists
    if (document.getElementById("article-related-news") || document.querySelector(".esprit-article__related-news")) {
      initRelatedNews();
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

    // console.log("Application initialized successfully");
  } catch (error) {
    console.error("Failed to initialize application:", error);
  }
}

// Start initialization when DOM is ready
document.addEventListener("DOMContentLoaded", initializeApp);
