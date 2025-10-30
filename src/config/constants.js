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

// Gallery configuration (static settings)
export const GALLERY_CONFIG = {
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
};

// Media player configuration (static settings)
export const MEDIA_PLAYER_CONFIG = {
  controls: ['play-large', 'play', 'progress', 'current-time', 'mute', 'volume', 'settings', 'fullscreen'],
  autoplay: false,
  volume: 0.8,
  settings: ['speed', 'quality'],
  speed: { selected: 1, options: [0.5, 0.75, 1, 1.25, 1.5, 2] }
};

// LightGallery configuration (static settings)
export const LIGHTGALLERY_CONFIG = {
  download: false,
  counter: false,
  enableDrag: false,
  enableSwipe: false
};

// Social share platform configurations (static URLs and icons)
export const SOCIAL_SHARE_PLATFORMS = {
  facebook: {
    id: 'shareto-facebook',
    url: 'https://www.facebook.com/sharer/sharer.php?u={url}',
    icon: 'esprit-fi-brands-facebook'
  },
  twitter: {
    id: 'shareto-twitter',
    url: 'https://twitter.com/intent/tweet?url={url}&text={text}',
    icon: 'esprit-fi-brands-twitter'
  },
  telegram: {
    id: 'shareto-telegram',
    url: 'https://t.me/share/url?url={url}&text={text}',
    icon: 'esprit-fi-brands-telegram'
  },
  whatsapp: {
    id: 'shareto-whatsapp',
    url: 'https://api.whatsapp.com/send?text={text}%20{url}',
    icon: 'esprit-fi-brands-whatsapp'
  },
  linkedin: {
    id: 'shareto-linkedin',
    url: 'https://www.linkedin.com/sharing/share-offsite/?url={url}',
    icon: 'esprit-fi-brands-linkedin'
  },
  email: {
    id: 'shareto-email',
    url: 'mailto:?subject={text}&body={url}',
    icon: 'esprit-fi-rr-envelope'
  }
};

// Reading mode background themes (static color definitions)
export const READING_MODE_THEMES = {
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
};