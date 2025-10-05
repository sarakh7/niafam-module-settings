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
 * Create Plyr instance with i18n configuration
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
 * Initialize video player with playlist and scrollable list
 * @param {string} videoSelector - Video element selector
 * @param {string} listSelector - Playlist items selector
 * @param {string} videoListSelector - Scrollable container selector
 * @param {Object} customOptions - Custom Plyr options
 * @returns {Plyr|null} Plyr instance or null
 */
export function initVideoPlayer(
  videoSelector = "#main-video",
  listSelector = ".video-list__item",
  videoListSelector = ".video-list__scroll",
  customOptions = {}
) {
  const videoElement = document.querySelector(videoSelector);
  if (!videoElement) {
    console.warn(`Video element not found: ${videoSelector}`);
    return null;
  }

  try {
    const player = createPlayer(videoElement, customOptions);

    const videoItems = document.querySelectorAll(listSelector);
    videoItems.forEach((item) => {
      item.addEventListener("click", () => {
        videoItems.forEach((v) => v.classList.remove("active"));
        item.classList.add("active");

        const videoSrc = item.getAttribute("data-video-src");
        if (videoSrc) {
          player.source = {
            type: "video",
            sources: [
              {
                src: videoSrc,
                type: "video/mp4",
              },
            ],
          };
          player.play();
        }
      });
    });

    // Scrollable list functionality
    const tabList = document.querySelector(videoListSelector);
    const tabs = document.querySelectorAll(listSelector);

    if (tabList && tabs.length > 0) {
      let isDragging = false;
      let startX;
      let scrollLeft;
      let autoScrollInterval;

      tabList.style.cursor = "grab";

      // Scroll with mouse wheel
      tabList.addEventListener("wheel", function (event) {
        event.preventDefault();
        tabList.scrollLeft += event.deltaY * 2;
      });

      // Mouse drag to scroll
      tabList.addEventListener("mousedown", function (event) {
        isDragging = true;
        tabList.style.cursor = "grabbing";
        startX = event.pageX - tabList.offsetLeft;
        scrollLeft = tabList.scrollLeft;
      });

      tabList.addEventListener("mouseleave", function () {
        isDragging = false;
        tabList.style.cursor = "grab";
        clearInterval(autoScrollInterval);
      });

      tabList.addEventListener("mouseup", function () {
        isDragging = false;
        tabList.style.cursor = "grab";
      });

      tabList.addEventListener("mousemove", function (event) {
        if (!isDragging) return;
        event.preventDefault();
        const x = event.pageX - tabList.offsetLeft;
        const walk = (x - startX) * 2;
        tabList.scrollLeft = scrollLeft - walk;
      });

      // Move selected tab to center of page when clicked
      tabs.forEach((tab) => {
        tab.addEventListener("click", function () {
          const tabRect = tab.getBoundingClientRect();
          const listRect = tabList.getBoundingClientRect();

          const scrollAmount =
            tabList.scrollLeft +
            (tabRect.left - listRect.left) -
            (listRect.width / 2 - tabRect.width / 2);

          tabList.scrollTo({
            left: scrollAmount,
            behavior: "smooth",
          });
        });
      });

      // Auto-scroll when the mouse approaches the edges of the list tab
      tabList.addEventListener("mousemove", function (event) {
        const rect = tabList.getBoundingClientRect();
        const mouseX = event.clientX - rect.left;

        const scrollSpeed = 3;
        const threshold = 110;

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

      // Improved scrolling effect when mouse enters tab list
      tabList.addEventListener("mouseenter", function () {
        tabList.scrollBy({ left: 30, behavior: "smooth" });

        setTimeout(() => {
          tabList.scrollBy({ left: -30, behavior: "smooth" });
        }, 400);
      });
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

    const audioItems = document.querySelectorAll(listSelector);
    audioItems.forEach((item) => {
      item.addEventListener("click", () => {
        audioItems.forEach((v) => v.classList.remove("active"));
        item.classList.add("active");
        
        const audioSrc = item.getAttribute("data-audio-src");
        if (audioSrc) {
          player.source = {
            type: "audio",
            sources: [
              {
                src: audioSrc,
                type: "audio/mp3",
              },
            ],
          };
          player.play();
        }
      });
    });

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
 * @param {string} closeButtonId - Modal close button ID
 * @param {Object} customOptions - Custom Plyr options
 * @returns {Plyr|null} Plyr instance or null
 */
export function initReadingModeTts(
  audioSelector = "#reading-mode-tts-audio",
  closeButtonId = "modal-reading-mode0close",
  customOptions = {}
) {
  const audioElement = document.querySelector(audioSelector);
  if (!audioElement) {
    console.warn(`Reading mode TTS audio element not found: ${audioSelector}`);
    return null;
  }

  try {
    const player = createPlayer(audioElement, customOptions);

    const closeButton = document.getElementById(closeButtonId);
    if (closeButton) {
      closeButton.addEventListener("click", () => {
        player.stop();
      });
    } else {
      console.warn(`Close button not found: ${closeButtonId}`);
    }

    return player;
  } catch (error) {
    console.error("Failed to initialize reading mode TTS player:", error);
    return null;
  }
}