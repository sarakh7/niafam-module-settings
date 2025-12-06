/**
 * TTS Auto Loader
 * Automatically finds and loads generated TTS files into TTS players
 * Also syncs the audio source between main TTS and reading mode TTS
 */

/**
 * Initialize TTS auto-loader
 * Finds audio files starting with "generated_tts" in sound list and loads them into TTS players
 * If no generated_tts file is found, does nothing
 */
export function initTtsAutoLoader() {
  // Find all sound list containers
  const soundListContainers = document.querySelectorAll('.sound-list__scroll');

  let foundTtsFile = false;

  soundListContainers.forEach(container => {
    // Find all sound items in this container
    const soundItems = container.querySelectorAll('.sound-list__item');

    soundItems.forEach(item => {
      const audioSrc = item.getAttribute('data-audio-src');

      // Check if this is a generated TTS file
      if (audioSrc && isGeneratedTtsFile(audioSrc)) {
        // Load this audio into both TTS players
        loadTtsAudio(audioSrc);

        // Mark this item as TTS-generated (for CSS hiding)
        item.classList.add('sound-list__item--tts-generated');

        foundTtsFile = true;
      }
    });
  });

  if (!foundTtsFile) {
    console.info('No generated TTS files found in sound list');
  }
}

/**
 * Check if an audio file is a generated TTS file
 * @param {string} audioSrc - Audio source path
 * @returns {boolean}
 */
function isGeneratedTtsFile(audioSrc) {
  // Extract filename from path
  const filename = audioSrc.split('/').pop();

  // Check if filename starts with "generated_tts"
  return filename.startsWith('generated_tts');
}

/**
 * Load TTS audio into all TTS players
 * @param {string} audioSrc - Audio source path
 */
function loadTtsAudio(audioSrc) {
  // Main TTS player (sidebar)
  const mainTtsAudio = document.getElementById('tts-audio');
  if (mainTtsAudio) {
    setAudioSource(mainTtsAudio, audioSrc);
  }

  // Reading mode TTS player
  const readingModeTtsAudio = document.getElementById('reading-mode-tts-audio');
  if (readingModeTtsAudio) {
    setAudioSource(readingModeTtsAudio, audioSrc);
  }
}

/**
 * Set audio source for an audio element
 * @param {HTMLAudioElement} audioElement - Audio element
 * @param {string} src - Audio source path
 */
function setAudioSource(audioElement, src) {
  // Find or create source element
  let sourceElement = audioElement.querySelector('source');

  if (!sourceElement) {
    sourceElement = document.createElement('source');
    sourceElement.type = 'audio/mp3';
    audioElement.appendChild(sourceElement);
  }

  // Set the source
  sourceElement.src = src;

  // Reload the audio element to apply new source
  audioElement.load();

  console.log(`TTS audio loaded: ${src}`);
}
