import { initGallery } from "./features/gallery";
import { initAudioPlayer, initTts, initVideoPlayer } from "./features/mediaPlayer";
import { initAccessibilityActions } from "./features/accessibilityControls";
import { initScrollNav } from "./utils/scrollNav";
import "./assets/scss/main.scss";
import { initCopyShortUrl } from "./features/copyShortUrl";
import { initPdfGenerator } from "./features/pdfGenerator";
import { initPrintNewsContent } from "./features/printNewsContent";
import { setShareLinks } from "./features/shareLinks";
import StickySidebar from "./utils/sticky-sidebar.esm";
import { initStickySidebar } from "./features/stickySidebar";
import { initModal } from "./features/modal";
// import { initStickySidebar } from "./features/stickySidebars";

document.addEventListener("DOMContentLoaded", () => {
  initGallery();
  initVideoPlayer();
  initAudioPlayer();
  initAccessibilityActions();
  initScrollNav("related-content-list");
  initCopyShortUrl();
  initPdfGenerator();
  initPrintNewsContent();
  setShareLinks("");
  initTts();
  initStickySidebar();
  initModal();
});
