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
// Social share configuration
export const SOCIAL_SHARE_PLATFORMS = {
  FACEBOOK: 'facebook',
  TWITTER: 'twitter',
  TELEGRAM: 'telegram',
  WHATSAPP: 'whatsapp',
  LINKEDIN: 'linkedin',
  EMAIL: 'email'
};

export const SOCIAL_SHARE_DEFAULTS = {
  enabled: true, // Enable/disable entire share functionality
  platforms: {
    [SOCIAL_SHARE_PLATFORMS.FACEBOOK]: {
      enabled: true,
      id: 'shareto-facebook',
      url: 'https://www.facebook.com/sharer/sharer.php?u={url}',
      icon: 'esprit-fi-brands-facebook' // Icon class for future use
    },
    [SOCIAL_SHARE_PLATFORMS.TWITTER]: {
      enabled: true,
      id: 'shareto-twitter',
      url: 'https://twitter.com/intent/tweet?url={url}&text={text}',
      icon: 'esprit-fi-brands-twitter'
    },
    [SOCIAL_SHARE_PLATFORMS.TELEGRAM]: {
      enabled: true,
      id: 'shareto-telegram',
      url: 'https://t.me/share/url?url={url}&text={text}',
      icon: 'esprit-fi-brands-telegram'
    },
    [SOCIAL_SHARE_PLATFORMS.WHATSAPP]: {
      enabled: true,
      id: 'shareto-whatsapp',
      url: 'https://api.whatsapp.com/send?text={text}%20{url}',
      icon: 'esprit-fi-brands-whatsapp'
    },
    [SOCIAL_SHARE_PLATFORMS.LINKEDIN]: {
      enabled: false, // Disabled by default
      id: 'shareto-linkedin',
      url: 'https://www.linkedin.com/sharing/share-offsite/?url={url}',
      icon: 'esprit-fi-brands-linkedin'
    },
    [SOCIAL_SHARE_PLATFORMS.EMAIL]: {
      enabled: false, // Disabled by default
      id: 'shareto-email',
      url: 'mailto:?subject={text}&body={url}',
      icon: 'esprit-fi-rr-envelope'
    }
  }
};