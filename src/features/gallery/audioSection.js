import { initAudioPlayer } from '../common/mediaPlayer';

/**
 * Initialize audio section
 */
export function initAudioSection() {
  const audioElement = document.getElementById('gallery-audio');

  if (!audioElement) {
    console.warn('Audio element not found');
    return;
  }

  // Initialize with standard selectors (same as index.html)
  initAudioPlayer(
    '#gallery-audio',
    '.sound-list__item'
  );
}
