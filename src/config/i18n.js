import i18next from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { SUPPORTED_LANGUAGES, DEFAULT_LANGUAGE } from "./constants";

// Import translation files (will be created in next step)
import fa from "../locales/fa.json";
import en from "../locales/en.json";
import ar from "../locales/ar.json";
import tr from "../locales/tr.json";
import ru from "../locales/ru.json";

/**
 * Initialize i18next
 */
export async function initI18n() {
  await i18next.use(LanguageDetector).init({
    resources: {
      [SUPPORTED_LANGUAGES.FA]: { translation: fa },
      [SUPPORTED_LANGUAGES.EN]: { translation: en },
      [SUPPORTED_LANGUAGES.AR]: { translation: ar },
      [SUPPORTED_LANGUAGES.TR]: { translation: tr },
      [SUPPORTED_LANGUAGES.RU]: { translation: ru },
    },
    fallbackLng: DEFAULT_LANGUAGE,
    lng: document.documentElement.lang || DEFAULT_LANGUAGE,
    detection: {
      order: ["htmlTag", "navigator"],
      caches: [],
    },
    interpolation: {
      escapeValue: false,
    },
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
