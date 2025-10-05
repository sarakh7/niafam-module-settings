// Application constants
export const SUPPORTED_LANGUAGES = {
  FA: 'fa',
  EN: 'en',
  AR: 'ar',
  TR: 'tr',
  RU: 'ru'
};

export const DEFAULT_LANGUAGE = SUPPORTED_LANGUAGES.FA;

export const LANGUAGE_NAMES = {
  [SUPPORTED_LANGUAGES.FA]: 'فارسی',
  [SUPPORTED_LANGUAGES.EN]: 'English',
  [SUPPORTED_LANGUAGES.AR]: 'العربية',
  [SUPPORTED_LANGUAGES.TR]: 'Türkçe',
  [SUPPORTED_LANGUAGES.RU]: 'Русский'
};

export const THEMES = {
  LIGHT: 'light',
  DARK: 'dark'
};

export const DEFAULT_THEME = THEMES.LIGHT;

export const GALLERY_DEFAULTS = {
  targetRowHeight: 200,
  boxSpacing: 5,
  containerPadding: 0,
  debounceDelay: 200
};

export const MEDIA_PLAYER_DEFAULTS = {
  controls: ['play-large', 'play', 'progress', 'current-time', 'mute', 'volume', 'settings', 'fullscreen'],
  autoplay: false,
  volume: 0.8,
  settings: ['speed', 'quality'], // فعال کردن منوی تنظیمات
  speed: { selected: 1, options: [0.5, 0.75, 1, 1.25, 1.5, 2] }
};

export const LIGHTGALLERY_DEFAULTS = {
  download: false,
  counter: false,
  enableDrag: false,
  enableSwipe: false
};