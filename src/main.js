import { initGallery } from "./features/gallery";
import { initAudioPlayer, initVideoPlayer } from "./features/mediaPlayer";
import { initAccessibilitySliders } from "./features/accessibilityControls";
import { initScrollNav } from "./utils/scrollNav";
import "./assets/scss/main.scss";
import { initCopyShortUrl } from "./features/copyShortUrl";
import { initPdfGenerator } from "./features/pdfGenerator";
import { initPrintNewsContent } from "./features/printNewsContent";

document.addEventListener("DOMContentLoaded", () => {
  initGallery();
  initVideoPlayer();
  initAudioPlayer();
  initAccessibilitySliders();
  initScrollNav("related-content-list");
  initCopyShortUrl();
  initPdfGenerator();
  initPrintNewsContent();
});
