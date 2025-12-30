import i18next from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { SUPPORTED_LANGUAGES, DEFAULT_LANGUAGE } from "./constants";
import ViteBackendLoader from "./i18n-backend-loader";

/**
 * Initialize i18next with lazy-loaded language resources
 * Languages are loaded on-demand via dynamic imports
 */
export async function initI18n() {
  await i18next
    .use(ViteBackendLoader)
    .use(LanguageDetector)
    .init({
      // No static resources - loaded by backend on demand
      fallbackLng: DEFAULT_LANGUAGE,
      lng: document.documentElement.lang || DEFAULT_LANGUAGE,

      // Language detection configuration
      detection: {
        order: ["htmlTag", "navigator"],
        caches: [],
      },

      // Backend configuration
      ns: ['translation'],
      defaultNS: 'translation',

      // Load only the detected language initially
      preload: [],

      interpolation: {
        escapeValue: false,
      },

      // Debug in development mode
      debug: import.meta.env.DEV,
    });

  return i18next;
}

/**
 * Get translation function
 */
export function getTranslation(key, options) {
  return i18next.t(key, options);
}

/**
 * Change language
 */
export async function changeLanguage(lang) {
  if (Object.values(SUPPORTED_LANGUAGES).includes(lang)) {
    await i18next.changeLanguage(lang);
    document.documentElement.lang = lang;
    return true;
  }
  return false;
}

/**
 * Get current language
 */
export function getCurrentLanguage() {
  return i18next.language || DEFAULT_LANGUAGE;
}

export default i18next;
