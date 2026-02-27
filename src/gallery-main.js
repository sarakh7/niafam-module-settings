import { initI18n } from "./config/i18n";
import { initLocalization } from "./utils/i18n-localizer";
import { loadSettingsFromFile, getDirectionFromHTML } from "./config/settings";
import { initImageGallery } from "./features/gallery/imageGallery";
import { initVideoSection } from "./features/gallery/videoSection";
import { initAudioSection } from "./features/gallery/audioSection";
import { initCopyShortUrl } from "./features/common/copyShortUrl";
import "./assets/scss/gallery.scss";

/**
 * Hide empty gallery sections
 */
function hideEmptySections() {
  // Hide images section if gallery is empty
  const imagesSection = document.getElementById('gallery-section-images');
  const galleryImages = document.getElementById('gallery-images');
  if (imagesSection && galleryImages && galleryImages.children.length === 0) {
    imagesSection.style.display = 'none';
  }

  // Hide videos section if video list is empty
  const videosSection = document.getElementById('gallery-section-videos');
  const videoListScroll = videosSection?.querySelector('.video-list__scroll');
  if (videosSection && videoListScroll && videoListScroll.children.length === 0) {
    videosSection.style.display = 'none';
  }

  // Hide sounds section if sound list is empty
  const soundsSection = document.getElementById('gallery-section-sounds');
  const soundListScroll = soundsSection?.querySelector('.sound-list__scroll');
  if (soundsSection && soundListScroll && soundListScroll.children.length === 0) {
    soundsSection.style.display = 'none';
  }

  // Hide related galleries section if there are no news items
  const relatedGalleriesSection = document.getElementById('gallery-related-galleries');
  const relatedNewsItems = relatedGalleriesSection?.querySelectorAll('.esprit-article__news-item');
  if (relatedGalleriesSection && (!relatedNewsItems || relatedNewsItems.length === 0)) {
    relatedGalleriesSection.style.display = 'none';
  }
}

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

    // Hide empty sections
    hideEmptySections();

    // console.log("Gallery page initialized successfully");
  } catch (error) {
    console.error("Failed to initialize gallery page:", error);
  }
}

// Start initialization when DOM is ready
document.addEventListener("DOMContentLoaded", initializeGalleryApp);
