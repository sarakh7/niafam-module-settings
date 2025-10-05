import Plyr from "plyr";
import "plyr/dist/plyr.css";
import { defaultSettings } from "../config/settings";
import i18next from "../config/i18n";

/**
 * Get Plyr i18n configuration based on current language
 * @returns {Object} Plyr i18n object
 */
function getPlyrI18n() {
  return {
    restart: i18next.t('player.restart'),
    rewind: i18next.t('player.rewind'),
    play: i18next.t('player.play'),
    pause: i18next.t('player.pause'),
    fastForward: i18next.t('player.forward'),
    seek: i18next.t('player.seek'),
    seekLabel: i18next.t('player.seekLabel'),
    played: i18next.t('player.played'),
    buffered: i18next.t('player.buffered'),
    currentTime: i18next.t('player.currentTime'),
    duration: i18next.t('player.duration'),
    volume: i18next.t('player.volume'),
    mute: i18next.t('player.mute'),
    unmute: i18next.t('player.unmute'),
    enableCaptions: i18next.t('player.enableCaptions'),
    disableCaptions: i18next.t('player.disableCaptions'),
    download: i18next.t('player.download'),
    enterFullscreen: i18next.t('player.enterFullscreen'),
    exitFullscreen: i18next.t('player.exitFullscreen'),
    frameTitle: i18next.t('player.frameTitle'),
    captions: i18next.t('player.captions'),
    settings: i18next.t('player.settings'),
    pip: i18next.t('player.pip'),
    menuBack: i18next.t('player.menuBack'),
    speed: i18next.t('player.speed'),
    normal: i18next.t('player.normal'),
    quality: i18next.t('player.quality'),
    loop: i18next.t('player.loop'),
    start: i18next.t('player.start'),
    end: i18next.t('player.end'),
    all: i18next.t('player.all'),
    reset: i18next.t('player.reset'),
    disabled: i18next.t('player.disabled'),
    enabled: i18next.t('player.enabled'),
    advertisement: i18next.t('player.advertisement')
  };
}

/**
 * Create Plyr instance with configuration
 * @param {HTMLElement} element - Media element
 * @param {Object} customOptions - Custom Plyr options
 * @returns {Plyr} Plyr instance
 */
function createPlayer(element, customOptions = {}) {
  const settings = defaultSettings.mediaPlayer;
  
  const options = {
    ...settings,
    i18n: getPlyrI18n(),
    ...customOptions
  };

  return new Plyr(element, options);
}

/**
 * Initialize tab scrolling functionality
 * @param {string} tabListSelector - Tab list container selector
 */
function initTabScrolling(tabListSelector) {
  const tabList = document.querySelector(tabListSelector);
  if (!tabList) return;

  const prevButton = document.querySelector(".video-list__prev-button");
  const nextButton = document.querySelector(".video-list__next-button");
  
  if (!prevButton || !nextButton) return;

  let autoScrollInterval;
  const scrollAmount = 200;
  const scrollSpeed = 3;
  const threshold = 110;

  // Previous button click handler
  prevButton.addEventListener("click", () => {
    tabList.scrollTo({
      left: tabList.scrollLeft - scrollAmount,
      behavior: "smooth",
    });
  });

  // Next button click handler
  nextButton.addEventListener("click", () => {
    tabList.scrollTo({
      left: tabList.scrollLeft + scrollAmount,
      behavior: "smooth",
    });
  });

  // Auto-scroll when mouse approaches edges
  tabList.addEventListener("mousemove", (event) => {
    const rect = tabList.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;

    clearInterval(autoScrollInterval);

    if (mouseX < threshold) {
      autoScrollInterval = setInterval(() => {
        tabList.scrollLeft -= scrollSpeed;
      }, 10);
    } else if (mouseX > rect.width - threshold) {
      autoScrollInterval = setInterval(() => {
        tabList.scrollLeft += scrollSpeed;
      }, 10);
    }
  });

  // Mouse leave - stop auto-scroll
  tabList.addEventListener("mouseleave", () => {
    clearInterval(autoScrollInterval);
  });

  // Improved scrolling effect on mouse enter
  tabList.addEventListener("mouseenter", () => {
    tabList.scrollBy({ left: 30, behavior: "smooth" });

    setTimeout(() => {
      tabList.scrollBy({ left: -30, behavior: "smooth" });
    }, 400);
  });
}

/**
 * Add playlist item click handlers
 * @param {Plyr} player - Plyr instance
 * @param {string} listSelector - Playlist items selector
 * @param {string} dataAttribute - Data attribute containing media source
 * @param {string} mediaType - Media type ('video' or 'audio')
 * @param {string} mimeType - MIME type
 * @param {boolean} manageActiveClass - Whether to manage active class
 */
function addPlaylistHandlers(
  player,
  listSelector,
  dataAttribute,
  mediaType,
  mimeType,
  manageActiveClass = false
) {
  const items = document.querySelectorAll(listSelector);
  
  items.forEach((item) => {
    item.addEventListener("click", () => {
      // Manage active class if needed
      if (manageActiveClass) {
        items.forEach((v) => v.classList.remove("active"));
        item.classList.add("active");
      }

      const source = item.getAttribute(dataAttribute);
      if (source) {
        player.source = {
          type: mediaType,
          sources: [
            {
              src: source,
              type: mimeType,
            },
          ],
        };
        player.play();
      }
    });
  });
}

/**
 * Initialize video player with playlist and tab scrolling
 * @param {string} videoSelector - Video element selector
 * @param {string} listSelector - Playlist items selector
 * @param {string} tabListSelector - Tab list container selector
 * @param {Object} customOptions - Custom Plyr options
 * @returns {Plyr|null} Plyr instance or null
 */
export function initVideoPlayer(
  videoSelector = "#main-video",
  listSelector = ".video-list__item",
  tabListSelector = ".video-list__list",
  customOptions = {}
) {
  const videoElement = document.querySelector(videoSelector);
  if (!videoElement) {
    console.warn(`Video element not found: ${videoSelector}`);
    return null;
  }

  try {
    const player = createPlayer(videoElement, customOptions);
    
    // Add playlist handlers
    if (listSelector) {
      addPlaylistHandlers(
        player,
        listSelector,
        "data-video-src",
        "video",
        "video/mp4",
        false
      );
    }

    // Initialize tab scrolling
    if (tabListSelector) {
      initTabScrolling(tabListSelector);
    }

    return player;
  } catch (error) {
    console.error("Failed to initialize video player:", error);
    return null;
  }
}

/**
 * Initialize audio player with playlist
 * @param {string} audioSelector - Audio element selector
 * @param {string} listSelector - Playlist items selector
 * @param {Object} customOptions - Custom Plyr options
 * @returns {Plyr|null} Plyr instance or null
 */
export function initAudioPlayer(
  audioSelector = "#main-audio",
  listSelector = ".sound-list__item",
  customOptions = {}
) {
  const audioElement = document.querySelector(audioSelector);
  if (!audioElement) {
    console.warn(`Audio element not found: ${audioSelector}`);
    return null;
  }

  try {
    const player = createPlayer(audioElement, customOptions);
    
    // Add playlist handlers with active class management
    if (listSelector) {
      addPlaylistHandlers(
        player,
        listSelector,
        "data-audio-src",
        "audio",
        "audio/mp3",
        true // Enable active class management for audio
      );
    }

    return player;
  } catch (error) {
    console.error("Failed to initialize audio player:", error);
    return null;
  }
}

/**
 * Initialize TTS (Text-to-Speech) player
 * @param {string} audioSelector - Audio element selector
 * @param {Object} customOptions - Custom Plyr options
 * @returns {Plyr|null} Plyr instance or null
 */
export function initTts(audioSelector = "#tts-audio", customOptions = {}) {
  const audioElement = document.querySelector(audioSelector);
  if (!audioElement) {
    console.warn(`TTS audio element not found: ${audioSelector}`);
    return null;
  }

  try {
    return createPlayer(audioElement, customOptions);
  } catch (error) {
    console.error("Failed to initialize TTS player:", error);
    return null;
  }
}

/**
 * Initialize Reading Mode TTS player with modal close handler
 * @param {string} audioSelector - Audio element selector
 * @param {string} closeButtonSelector - Modal close button selector
 * @param {Object} customOptions - Custom Plyr options
 * @returns {Plyr|null} Plyr instance or null
 */
export function initReadingModeTts(
  audioSelector = "#reading-mode-tts-audio",
  closeButtonSelector = "#modal-reading-mode0close",
  customOptions = {}
) {
  const audioElement = document.querySelector(audioSelector);
  if (!audioElement) {
    console.warn(`Reading mode TTS audio element not found: ${audioSelector}`);
    return null;
  }

  try {
    const player = createPlayer(audioElement, customOptions);

    // Add stop handler on modal close
    const closeButton = document.querySelector(closeButtonSelector);
    if (closeButton) {
      closeButton.addEventListener("click", () => {
        player.stop();
      });
    } else {
      console.warn(`Close button not found: ${closeButtonSelector}`);
    }

    return player;
  } catch (error) {
    console.error("Failed to initialize reading mode TTS player:", error);
    return null;
  }
}