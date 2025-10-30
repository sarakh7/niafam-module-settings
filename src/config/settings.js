import {
  DEFAULT_LANGUAGE,
  DEFAULT_THEME,
  GALLERY_CONFIG,
  MEDIA_PLAYER_CONFIG,
  LIGHTGALLERY_CONFIG,
  SOCIAL_SHARE_PLATFORMS,
  READING_MODE_THEMES,
} from "./constants";
import { languageDirections } from "../utils/languageDirections";

// Store loaded settings from file
let fileSettings = null;
let settingsLoadError = null;

/**
 * Get language from HTML tag
 */
function getLanguageFromHTML() {
  return document.documentElement.lang || DEFAULT_LANGUAGE;
}

/**
 * Get direction from HTML tag or detect from language
 */
export function getDirectionFromHTML() {
  const htmlDir = document.documentElement.dir;
  if (htmlDir) return htmlDir;

  // Auto-detect from language
  const lang = getLanguageFromHTML();
  return languageDirections.rtl.includes(lang) ? "rtl" : "ltr";
}

/**
 * Validates and sanitizes settings object
 * @param {Object} settings - Settings to validate
 * @returns {Object} - Validated settings or null if invalid
 */
function validateSettings(settings) {
  // Security: Ensure settings is a plain object
  if (!settings || typeof settings !== 'object' || Array.isArray(settings)) {
    console.warn('[Settings] Invalid settings format');
    return null;
  }

  const validated = {};

  // Validate layout settings
  if (settings.layout && typeof settings.layout === 'object') {
    validated.layout = {};

    if (typeof settings.layout.mobileContentMax === 'number' && settings.layout.mobileContentMax > 0) {
      validated.layout.mobileContentMax = Math.min(Math.max(settings.layout.mobileContentMax, 320), 2000);
    }
  }

  // Validate gallery settings
  if (settings.gallery && typeof settings.gallery === 'object') {
    validated.gallery = {};

    if (typeof settings.gallery.targetRowHeight === 'number' && settings.gallery.targetRowHeight > 0) {
      validated.gallery.targetRowHeight = Math.min(settings.gallery.targetRowHeight, 500); // Max 500px
    }

    if (typeof settings.gallery.boxSpacing === 'number' && settings.gallery.boxSpacing >= 0) {
      validated.gallery.boxSpacing = Math.min(settings.gallery.boxSpacing, 50); // Max 50px
    }

    if (typeof settings.gallery.containerPadding === 'number' && settings.gallery.containerPadding >= 0) {
      validated.gallery.containerPadding = Math.min(settings.gallery.containerPadding, 100); // Max 100px
    }

    if (typeof settings.gallery.debounceDelay === 'number' && settings.gallery.debounceDelay >= 0) {
      validated.gallery.debounceDelay = Math.min(settings.gallery.debounceDelay, 1000); // Max 1000ms
    }

    if (typeof settings.gallery.enableLightbox === 'boolean') {
      validated.gallery.enableLightbox = settings.gallery.enableLightbox;
    }

    // Validate plugins array
    if (Array.isArray(settings.gallery.plugins)) {
      const allowedPlugins = ['zoom', 'thumbnail', 'fullscreen', 'autoplay', 'video', 'rotate', 'share'];
      validated.gallery.plugins = settings.gallery.plugins.filter(p =>
        typeof p === 'string' && allowedPlugins.includes(p)
      );
    }
  }

  // Validate media player settings
  if (settings.mediaPlayer && typeof settings.mediaPlayer === 'object') {
    validated.mediaPlayer = {};

    const allowedControls = ['play-large', 'play', 'progress', 'current-time', 'mute', 'volume', 'settings', 'fullscreen'];
    if (Array.isArray(settings.mediaPlayer.controls)) {
      validated.mediaPlayer.controls = settings.mediaPlayer.controls.filter(c =>
        typeof c === 'string' && allowedControls.includes(c)
      );
    }

    if (typeof settings.mediaPlayer.autoplay === 'boolean') {
      validated.mediaPlayer.autoplay = settings.mediaPlayer.autoplay;
    }

    if (typeof settings.mediaPlayer.volume === 'number' && settings.mediaPlayer.volume >= 0 && settings.mediaPlayer.volume <= 1) {
      validated.mediaPlayer.volume = settings.mediaPlayer.volume;
    }

    if (Array.isArray(settings.mediaPlayer.settings)) {
      const allowedSettings = ['speed', 'quality'];
      validated.mediaPlayer.settings = settings.mediaPlayer.settings.filter(s =>
        typeof s === 'string' && allowedSettings.includes(s)
      );
    }

    if (settings.mediaPlayer.speed && typeof settings.mediaPlayer.speed === 'object') {
      validated.mediaPlayer.speed = {};
      if (typeof settings.mediaPlayer.speed.selected === 'number') {
        validated.mediaPlayer.speed.selected = settings.mediaPlayer.speed.selected;
      }
      if (Array.isArray(settings.mediaPlayer.speed.options)) {
        validated.mediaPlayer.speed.options = settings.mediaPlayer.speed.options.filter(o =>
          typeof o === 'number' && o > 0 && o <= 5
        );
      }
    }
  }

  // Validate lightGallery settings
  if (settings.lightGallery && typeof settings.lightGallery === 'object') {
    validated.lightGallery = {};

    if (typeof settings.lightGallery.download === 'boolean') {
      validated.lightGallery.download = settings.lightGallery.download;
    }

    if (typeof settings.lightGallery.counter === 'boolean') {
      validated.lightGallery.counter = settings.lightGallery.counter;
    }

    if (typeof settings.lightGallery.enableDrag === 'boolean') {
      validated.lightGallery.enableDrag = settings.lightGallery.enableDrag;
    }

    if (typeof settings.lightGallery.enableSwipe === 'boolean') {
      validated.lightGallery.enableSwipe = settings.lightGallery.enableSwipe;
    }
  }

  // Validate social share settings (only enabled flags)
  if (settings.socialShare && typeof settings.socialShare === 'object') {
    validated.socialShare = {};

    if (typeof settings.socialShare.enabled === 'boolean') {
      validated.socialShare.enabled = settings.socialShare.enabled;
    }

    if (settings.socialShare.platforms && typeof settings.socialShare.platforms === 'object') {
      validated.socialShare.platforms = {};

      const allowedPlatforms = ['facebook', 'twitter', 'telegram', 'whatsapp', 'linkedin', 'email'];

      for (const [key, value] of Object.entries(settings.socialShare.platforms)) {
        if (allowedPlatforms.includes(key) && value && typeof value === 'object') {
          validated.socialShare.platforms[key] = {};

          // Only validate enabled flag - other properties come from constants
          if (typeof value.enabled === 'boolean') {
            validated.socialShare.platforms[key].enabled = value.enabled;
          }
        }
      }
    }
  }

  // Validate reading mode settings (only defaultTheme)
  if (settings.readingMode && typeof settings.readingMode === 'object') {
    validated.readingMode = {};

    // Only validate defaultTheme - theme definitions come from constants
    if (typeof settings.readingMode.defaultTheme === 'string' && settings.readingMode.defaultTheme.length > 0 && settings.readingMode.defaultTheme.length < 50) {
      // Validate that the theme exists in READING_MODE_THEMES
      const allowedThemes = ['light', 'dark', 'yellow', 'blue'];
      if (allowedThemes.includes(settings.readingMode.defaultTheme)) {
        validated.readingMode.defaultTheme = settings.readingMode.defaultTheme;
      }
    }
  }

  return Object.keys(validated).length > 0 ? validated : null;
}

/**
 * Deep merge two objects
 * @param {Object} target - Target object
 * @param {Object} source - Source object
 * @returns {Object} - Merged object
 */
function deepMerge(target, source) {
  const result = { ...target };

  for (const key in source) {
    if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
      result[key] = deepMerge(result[key] || {}, source[key]);
    } else {
      result[key] = source[key];
    }
  }

  return result;
}

/**
 * Deep freeze an object to prevent modifications (security measure)
 * @param {Object} obj - Object to freeze
 * @returns {Object} - Frozen object
 */
function deepFreeze(obj) {
  // Retrieve the property names defined on obj
  const propNames = Object.getOwnPropertyNames(obj);

  // Freeze properties before freezing self
  for (const name of propNames) {
    const value = obj[name];

    if (value && typeof value === "object") {
      deepFreeze(value);
    }
  }

  return Object.freeze(obj);
}

/**
 * Load settings from window.NIAFAM_MODULE_SETTINGS variable
 * This variable should be defined in the HTML file before loading the module
 * @returns {Promise<Object|null>} - Loaded settings or null if failed
 */
export async function loadSettingsFromFile() {
  try {
    // Check if settings are defined in window object
    if (!window.NIAFAM_MODULE_SETTINGS) {
      throw new Error('window.NIAFAM_MODULE_SETTINGS is not defined');
    }

    const data = window.NIAFAM_MODULE_SETTINGS;

    // Validate and sanitize settings
    const validatedSettings = validateSettings(data);

    if (!validatedSettings) {
      throw new Error('Settings validation failed');
    }

    fileSettings = validatedSettings;
    settingsLoadError = null;

    // Security: Freeze the settings object to prevent tampering
    // This creates a deep freeze to protect nested objects
    deepFreeze(window.NIAFAM_MODULE_SETTINGS);

    // console.info('[Settings] Settings loaded successfully from window.NIAFAM_MODULE_SETTINGS');
    return validatedSettings;

  } catch (error) {
    settingsLoadError = error.message;
    // console.warn('[Settings] Failed to load settings:', error.message);
    console.warn('[Settings] Failed to load settings from window.NIAFAM_MODULE_SETTINGS');
    // console.info('[Settings] Using built-in default settings');
    return null;
  }
}

/**
 * Get error from last settings load attempt
 * @returns {string|null} - Error message or null
 */
export function getSettingsLoadError() {
  return settingsLoadError;
}

/**
 * Build social share platform config by merging constants with dynamic enabled flags
 */
function buildSocialShareConfig(dynamicConfig = {}) {
  const platforms = {};

  // Merge constants with dynamic enabled flags
  for (const [key, staticConfig] of Object.entries(SOCIAL_SHARE_PLATFORMS)) {
    platforms[key] = {
      ...staticConfig,
      enabled: dynamicConfig.platforms?.[key]?.enabled ?? true // Default to true if not specified
    };
  }

  return {
    enabled: dynamicConfig.enabled ?? true,
    platforms
  };
}

/**
 * Default application settings (combines constants with dynamic settings)
 * These are used only if window.NIAFAM_MODULE_SETTINGS cannot be loaded
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

  // Layout settings (fallback defaults)
  layout: {
    mobileContentMax: 955
  },

  // Gallery settings (from constants)
  gallery: { ...GALLERY_CONFIG },

  // Media player settings (from constants)
  mediaPlayer: { ...MEDIA_PLAYER_CONFIG },

  // LightGallery settings (from constants)
  lightGallery: { ...LIGHTGALLERY_CONFIG },

  // Social share settings (from constants with default enabled flags)
  socialShare: buildSocialShareConfig(),

  // Reading mode settings (from constants with default theme)
  readingMode: {
    backgroundThemes: { ...READING_MODE_THEMES },
    defaultTheme: 'yellow'
  },
};

/**
 * Get current settings
 * Returns merged settings from constants and dynamic settings
 */
export function getSettings() {
  const base = {
    language: defaultSettings.language,
    direction: defaultSettings.direction,
    theme: defaultSettings.theme,
    layout: { ...defaultSettings.layout },
    gallery: { ...GALLERY_CONFIG },
    mediaPlayer: { ...MEDIA_PLAYER_CONFIG },
    lightGallery: { ...LIGHTGALLERY_CONFIG },
    socialShare: buildSocialShareConfig(),
    readingMode: {
      backgroundThemes: { ...READING_MODE_THEMES },
      defaultTheme: 'yellow'
    },
  };

  // If dynamic settings loaded from window, merge them
  if (fileSettings) {
    // Merge layout
    if (fileSettings.layout) {
      base.layout = { ...base.layout, ...fileSettings.layout };
    }

    // Merge social share (only enabled flags)
    if (fileSettings.socialShare) {
      base.socialShare = buildSocialShareConfig(fileSettings.socialShare);
    }

    // Merge reading mode (only defaultTheme)
    if (fileSettings.readingMode?.defaultTheme) {
      base.readingMode.defaultTheme = fileSettings.readingMode.defaultTheme;
    }
  }

  return base;
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
