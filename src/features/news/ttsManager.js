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
 * Sync TTS audio source from main TTS to Reading Mode TTS
 * Copies the audio source element from the main TTS player to the reading mode TTS player
 * @param {Object} options - Configuration options
 * @param {string} [options.mainAudioSelector='#tts-audio'] - Main TTS audio element selector
 * @param {string} [options.readingModeAudioSelector='#reading-mode-tts-audio'] - Reading mode TTS audio element selector
 * @returns {boolean} True if sync was successful, false otherwise
 */
export function syncTtsSource(options = {}) {
  const {
    mainAudioSelector = "#tts-audio",
    readingModeAudioSelector = "#reading-mode-tts-audio",
  } = options;

  const mainAudio = document.querySelector(mainAudioSelector);
  const readingModeAudio = document.querySelector(readingModeAudioSelector);

  if (!mainAudio) {
    console.warn(`Main TTS audio element not found: ${mainAudioSelector}`);
    return false;
  }

  if (!readingModeAudio) {
    console.warn(`Reading mode TTS audio element not found: ${readingModeAudioSelector}`);
    return false;
  }

  // Get the source element from main audio
  const mainSource = mainAudio.querySelector("source");
  if (!mainSource) {
    console.warn("No source element found in main TTS audio");
    return false;
  }

  // Get or create source element in reading mode audio
  let readingModeSource = readingModeAudio.querySelector("source");

  if (!readingModeSource) {
    // Create a new source element if it doesn't exist
    readingModeSource = document.createElement("source");
    readingModeAudio.appendChild(readingModeSource);
  }

  // Copy the src and type attributes
  const src = mainSource.getAttribute("src");
  const type = mainSource.getAttribute("type");

  if (src) {
    readingModeSource.setAttribute("src", src);
  }

  if (type) {
    readingModeSource.setAttribute("type", type);
  }

  // Load the new source
  readingModeAudio.load();

  // console.info("TTS source synced from main to reading mode:", src);
  return true;
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
