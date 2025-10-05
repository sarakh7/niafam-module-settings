import {
  DEFAULT_LANGUAGE,
  DEFAULT_THEME,
  GALLERY_DEFAULTS,
  MEDIA_PLAYER_DEFAULTS,
  LIGHTGALLERY_DEFAULTS,
} from "./constants";
import { languageDirections } from "../utils/languageDirections";
import { SOCIAL_SHARE_DEFAULTS } from "./constants";

/**
 * Get language from HTML tag
 */
function getLanguageFromHTML() {
  return document.documentElement.lang || DEFAULT_LANGUAGE;
}

/**
 * Get direction from HTML tag or detect from language
 */
function getDirectionFromHTML() {
  const htmlDir = document.documentElement.dir;
  if (htmlDir) return htmlDir;

  // Auto-detect from language
  const lang = getLanguageFromHTML();
  return languageDirections.rtl.includes(lang) ? "rtl" : "ltr";
}

/**
 * Default application settings
 * These settings can be overridden but are not persisted
 */
export const defaultSettings = {
  // Language and direction (read from HTML)
  get language() {
    return getLanguageFromHTML();
  },
  get direction() {
    return getDirectionFromHTML();
  },

  // Theme (prepared for future use)
  theme: DEFAULT_THEME,

  // Gallery settings
  gallery: {
    ...GALLERY_DEFAULTS,
    enableLightbox: true,
    plugins: [
      "zoom",
      "thumbnail",
      "fullscreen",
      "autoplay",
      "video",
      "rotate",
      "share",
    ],
  },

  // Media player settings
  mediaPlayer: {
    ...MEDIA_PLAYER_DEFAULTS,
  },

  // LightGallery settings
  lightGallery: {
    ...LIGHTGALLERY_DEFAULTS,
  },

  // Social share settings
  socialShare: {
    ...SOCIAL_SHARE_DEFAULTS,
  },
};

/**
 * Get current settings (for future expansion)
 * Currently returns default settings
 */
export function getSettings() {
  return {
    language: defaultSettings.language,
    direction: defaultSettings.direction,
    theme: defaultSettings.theme,
    gallery: { ...defaultSettings.gallery },
    mediaPlayer: { ...defaultSettings.mediaPlayer },
    lightGallery: { ...defaultSettings.lightGallery },
  };
}

/**
 * Update settings (for future expansion)
 * Currently only returns merged settings without persistence
 */
export function updateSettings(newSettings) {
  const current = getSettings();
  return {
    ...current,
    ...newSettings,
  };
}
