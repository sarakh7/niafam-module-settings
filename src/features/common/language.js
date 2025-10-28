import { languageDirections } from "../../utils/languageDirections";
import { defaultSettings } from "../../config/settings";

/**
 * Check if current language direction is RTL
 * @returns {boolean}
 */
export function isDirectionRTL() {
  const lang = getCurrentLanguage();
  return languageDirections.rtl.includes(lang);
}

/**
 * Get current language from HTML tag
 * @returns {string}
 */
export function getCurrentLanguage() {
  return defaultSettings.language;
}

/**
 * Get current direction (ltr or rtl)
 * @returns {string}
 */
export function getCurrentDirection() {
  return defaultSettings.direction;
}

/**
 * Check if a specific language is RTL
 * @param {string} lang - Language code
 * @returns {boolean}
 */
export function isLanguageRTL(lang) {
  return languageDirections.rtl.includes(lang);
}

/**
 * Set document direction based on current language
 * Useful for dynamic language changes
 */
export function applyDirectionToDocument() {
  const direction = getCurrentDirection();
  document.documentElement.dir = direction;
}
