import { initGallery } from "./features/gallery";
import { initAudioPlayer, initVideoPlayer } from "./features/mediaPlayer";
import { initAccessibilitySliders } from "./features/accessibilityControls";
import { initScrollNav } from "./utils/scrollNav";
import "./assets/scss/main.scss";

document.addEventListener("DOMContentLoaded", () => {
  initGallery();
  initVideoPlayer();
  initAudioPlayer();
  initAccessibilitySliders();
  initScrollNav("related-content-list");
});
