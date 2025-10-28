import {
  DEFAULT_LANGUAGE,
  DEFAULT_THEME,
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

    if (typeof settings.layout.desktopViewportMin === 'number' && settings.layout.desktopViewportMin > 0) {
      validated.layout.desktopViewportMin = Math.min(Math.max(settings.layout.desktopViewportMin, 320), 2000);
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

  // Validate social share settings
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

          if (typeof value.enabled === 'boolean') {
            validated.socialShare.platforms[key].enabled = value.enabled;
          }

          if (typeof value.id === 'string' && value.id.length > 0 && value.id.length < 100) {
            validated.socialShare.platforms[key].id = value.id;
          }

          // Security: Validate URL patterns to prevent XSS
          if (typeof value.url === 'string' && value.url.length > 0 && value.url.length < 500) {
            const urlPattern = /^(https?:\/\/|mailto:)/i;
            if (urlPattern.test(value.url)) {
              validated.socialShare.platforms[key].url = value.url;
            }
          }

          if (typeof value.icon === 'string' && value.icon.length > 0 && value.icon.length < 100) {
            validated.socialShare.platforms[key].icon = value.icon;
          }
        }
      }
    }
  }

  // Validate reading mode settings
  if (settings.readingMode && typeof settings.readingMode === 'object') {
    validated.readingMode = {};

    if (settings.readingMode.backgroundThemes && typeof settings.readingMode.backgroundThemes === 'object') {
      validated.readingMode.backgroundThemes = {};

      const colorPattern = /^#[0-9A-Fa-f]{6}([0-9A-Fa-f]{2})?$/;

      for (const [key, value] of Object.entries(settings.readingMode.backgroundThemes)) {
        if (value && typeof value === 'object') {
          const theme = {};

          if (typeof value.color === 'string' && colorPattern.test(value.color)) {
            theme.color = value.color;
          }

          if (typeof value.backgroundColor === 'string' && colorPattern.test(value.backgroundColor)) {
            theme.backgroundColor = value.backgroundColor;
          }

          // Only add theme if both colors are valid
          if (theme.color && theme.backgroundColor) {
            validated.readingMode.backgroundThemes[key] = theme;
          }
        }
      }
    }

    if (typeof settings.readingMode.defaultTheme === 'string') {
      validated.readingMode.defaultTheme = settings.readingMode.defaultTheme;
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
 * Load settings from external JSON file
 * First tries to load custom settings from config/settings.json
 * Falls back to default settings from public/config/settings.default.json
 * @returns {Promise<Object|null>} - Loaded settings or null if failed
 */
export async function loadSettingsFromFile() {
  const customSettingsPath = '/config/settings.json';
  const defaultSettingsPath = '/config/settings.default.json';

  try {
    // Try to load custom settings first
    let response;
    let isCustom = false;

    try {
      response = await fetch(customSettingsPath, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        cache: 'no-cache', // Always fetch fresh settings
      });

      if (response.ok) {
        isCustom = true;
        // console.info('[Settings] Loading custom settings from config/settings.json');
      }
    } catch (err) {
      // Custom settings not found, will try default
    }

    // If custom settings not found, try default settings
    if (!isCustom) {
      response = await fetch(defaultSettingsPath, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        cache: 'default',
      });

      if (response.ok) {
        // console.info('[Settings] Loading default settings from config/settings.default.json');
      }
    }

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Security: Check content type
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      throw new Error('Invalid content type: expected application/json');
    }

    // Security: Limit response size (5MB max)
    const contentLength = response.headers.get('content-length');
    if (contentLength && parseInt(contentLength) > 5 * 1024 * 1024) {
      throw new Error('Settings file too large');
    }

    const data = await response.json();

    // Validate and sanitize settings
    const validatedSettings = validateSettings(data);

    if (!validatedSettings) {
      throw new Error('Settings validation failed');
    }

    fileSettings = validatedSettings;
    settingsLoadError = null;

    // console.info('[Settings] Settings loaded successfully', isCustom ? '(custom)' : '(default)');
    return validatedSettings;

  } catch (error) {
    settingsLoadError = error.message;
    // console.warn('[Settings] Failed to load settings from file:', error.message);
    console.warn('[Settings] Failed to load settings');
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
 * Default application settings (hardcoded fallbacks)
 * These are used only if settings files cannot be loaded
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

  // Layout settings
  layout: {
    mobileContentMax: 955,
    desktopViewportMin: 992
  },

  // Gallery settings
  gallery: {
    targetRowHeight: 200,
    boxSpacing: 5,
    containerPadding: 0,
    debounceDelay: 200,
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
    controls: ['play-large', 'play', 'progress', 'current-time', 'mute', 'volume', 'settings', 'fullscreen'],
    autoplay: false,
    volume: 0.8,
    settings: ['speed', 'quality'],
    speed: { selected: 1, options: [0.5, 0.75, 1, 1.25, 1.5, 2] }
  },

  // LightGallery settings
  lightGallery: {
    download: false,
    counter: false,
    enableDrag: false,
    enableSwipe: false
  },

  // Social share settings
  socialShare: {
    enabled: true,
    platforms: {
      facebook: {
        enabled: true,
        id: 'shareto-facebook',
        url: 'https://www.facebook.com/sharer/sharer.php?u={url}',
        icon: 'esprit-fi-brands-facebook'
      },
      twitter: {
        enabled: true,
        id: 'shareto-twitter',
        url: 'https://twitter.com/intent/tweet?url={url}&text={text}',
        icon: 'esprit-fi-brands-twitter'
      },
      telegram: {
        enabled: true,
        id: 'shareto-telegram',
        url: 'https://t.me/share/url?url={url}&text={text}',
        icon: 'esprit-fi-brands-telegram'
      },
      whatsapp: {
        enabled: true,
        id: 'shareto-whatsapp',
        url: 'https://api.whatsapp.com/send?text={text}%20{url}',
        icon: 'esprit-fi-brands-whatsapp'
      },
      linkedin: {
        enabled: false,
        id: 'shareto-linkedin',
        url: 'https://www.linkedin.com/sharing/share-offsite/?url={url}',
        icon: 'esprit-fi-brands-linkedin'
      },
      email: {
        enabled: false,
        id: 'shareto-email',
        url: 'mailto:?subject={text}&body={url}',
        icon: 'esprit-fi-rr-envelope'
      }
    }
  },

  // Reading mode settings
  readingMode: {
    backgroundThemes: {
      light: {
        color: '#1f1f1fff',
        backgroundColor: '#ffffffff'
      },
      dark: {
        color: '#e3e3e3ff',
        backgroundColor: '#202124ff'
      },
      yellow: {
        color: '#1f1f1fff',
        backgroundColor: '#feefc3ff'
      },
      blue: {
        color: '#1f1f1fff',
        backgroundColor: '#d2e3fcff'
      }
    },
    defaultTheme: 'yellow'
  },
};

/**
 * Get current settings
 * Returns merged settings from file and defaults
 */
export function getSettings() {
  const base = {
    language: defaultSettings.language,
    direction: defaultSettings.direction,
    theme: defaultSettings.theme,
    layout: { ...defaultSettings.layout },
    gallery: { ...defaultSettings.gallery },
    mediaPlayer: { ...defaultSettings.mediaPlayer },
    lightGallery: { ...defaultSettings.lightGallery },
    socialShare: { ...defaultSettings.socialShare },
    readingMode: { ...defaultSettings.readingMode },
  };

  // If file settings loaded, merge them with defaults
  if (fileSettings) {
    return deepMerge(base, fileSettings);
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
