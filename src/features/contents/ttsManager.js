/**
 * TTS Manager
 * Manages visibility of TTS containers based on audio source availability
 */

/**
 * Check if audio element has a valid source
 * @param {HTMLElement} audioElement - Audio element to check
 * @returns {boolean} True if has valid source
 */
function hasValidAudioSource(audioElement) {
  if (!audioElement) return false;

  const sourceElement = audioElement.querySelector("source");
  if (!sourceElement) return false;

  const src = sourceElement.getAttribute("src");
  return src && src.trim() !== "";
}

/**
 * Initialize TTS container visibility
 * Hides the TTS container if no valid audio source exists
 * @param {Object} options - Configuration options
 * @param {string} [options.audioSelector='#tts-audio'] - Audio element selector
 * @param {string} [options.containerSelector='#tts-container'] - Container selector
 * @returns {boolean} True if container is visible, false if hidden
 */
export function initTtsVisibility(options = {}) {
  const {
    audioSelector = "#tts-audio",
    containerSelector = "#tts-container",
  } = options;

  const audioElement = document.querySelector(audioSelector);
  const container = document.querySelector(containerSelector);

  if (!container) {
    console.warn(`TTS container not found: ${containerSelector}`);
    return false;
  }

  if (!audioElement) {
    console.warn(`TTS audio element not found: ${audioSelector}`);
    container.style.display = "none";
    return false;
  }

  // Check if audio has a valid source
  if (!hasValidAudioSource(audioElement)) {
    container.style.display = "none";
    console.info("TTS container hidden: no valid audio source");
    return false;
  }

  return true;
}

/**
 * Initialize Reading Mode TTS container visibility
 * Hides the TTS container if no valid audio source exists
 * @param {Object} options - Configuration options
 * @param {string} [options.audioSelector='#reading-mode-tts-audio'] - Audio element selector
 * @returns {boolean} True if container is visible, false if hidden
 */
export function initReadingModeTtsVisibility(options = {}) {
  const {
    audioSelector = "#reading-mode-tts-audio",
  } = options;

  const audioElement = document.querySelector(audioSelector);

  if (!audioElement) {
    console.warn(`Reading mode TTS audio element not found: ${audioSelector}`);
    return false;
  }

  // Find the parent container with class 'tts__container'
  const container = audioElement.closest(".tts__container");

  if (!container) {
    console.warn("Reading mode TTS container (.tts__container) not found");
    return false;
  }

  // Check if audio has a valid source
  if (!hasValidAudioSource(audioElement)) {
    container.style.display = "none";
    // console.info("Reading mode TTS container hidden: no valid audio source");
    return false;
  }

  return true;
}
