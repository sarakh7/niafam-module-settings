import { initVideoPlayer } from '../common/mediaPlayer';

/**
 * Initialize video section
 */
export function initVideoSection() {
  const videoElement = document.getElementById('gallery-video');

  if (!videoElement) {
    console.warn('Video element not found');
    return;
  }

  // Initialize with standard selectors (same as index.html)
  initVideoPlayer(
    '#gallery-video',
    '.video-list__item',
    '.video-list__scroll'
  );
}
