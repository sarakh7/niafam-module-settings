/**
 * DOM Localization Module
 * Automatically updates DOM elements with data-i18n attributes
 * @module utils/localize
 */

import i18next from '../config/i18n';
import { SUPPORTED_LANGUAGES, LANGUAGE_NAMES } from '../config/constants';
import { languageDirections } from './languageDirections';
import DOMPurify from 'dompurify';

/**
 * Check if a language is RTL
 * @param {string} lang - Language code
 * @returns {boolean}
 */
function isLanguageRTL(lang) {
  return languageDirections.rtl.includes(lang);
}

/**
 * Update a single element based on its data-i18n attribute
 * @param {HTMLElement} element - Element to localize
 */
function localizeElement(element) {
  const i18nAttr = element.getAttribute('data-i18n');
  if (!i18nAttr) return;

  // Parse attribute format: "[attr]key" or "key"
  const matches = i18nAttr.match(/^\[([^\]]+)\](.+)$/);

  if (matches) {
    // Format: [attribute]key - translate attribute value
    const [, attr, key] = matches;
    const translation = i18next.t(key);

    if (attr === 'html') {
      // Security: Sanitize HTML content to prevent XSS attacks
      // Only allow safe formatting tags commonly used in translations
      const sanitizedHTML = DOMPurify.sanitize(translation, {
        ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'br', 'span', 'p', 'ul', 'ol', 'li'],
        ALLOWED_ATTR: ['href', 'class', 'target', 'rel'],
        ALLOW_DATA_ATTR: false,
        FORBID_TAGS: ['script', 'style', 'iframe', 'object', 'embed', 'form', 'input'],
        FORBID_ATTR: ['onerror', 'onload', 'onclick', 'onmouseover', 'onfocus', 'onblur']
      });
      element.innerHTML = sanitizedHTML;
    } else {
      element.setAttribute(attr, translation);
    }
  } else {
    // Format: key - translate text content
    const translation = i18next.t(i18nAttr);
    element.textContent = translation;
  }
}

/**
 * Localize all elements with data-i18n attribute in a container
 * @param {HTMLElement} [container=document.body] - Container to search in
 */
export function localizeDOM(container = document.body) {
  const elements = container.querySelectorAll('[data-i18n]');
  elements.forEach(localizeElement);
}

/**
 * Change language and update DOM
 * @param {string} lang - Language code (e.g., 'fa', 'en', 'ar', 'tr', 'ru')
 * @returns {Promise<void>}
 */
export async function changeLanguageAndLocalize(lang) {
  // Validate language is supported
  if (!Object.values(SUPPORTED_LANGUAGES).includes(lang)) {
    console.warn(`Language "${lang}" is not supported. Available languages:`, Object.values(SUPPORTED_LANGUAGES));
    return;
  }

  // Change i18next language
  await i18next.changeLanguage(lang);
  
  // Update HTML attributes
  document.documentElement.lang = lang;
  
  // Update direction (RTL/LTR) - use the languageDirections utility
  const direction = isLanguageRTL(lang) ? 'rtl' : 'ltr';
  document.documentElement.dir = direction;
  
  // Update all DOM elements
  localizeDOM();
  
  console.log(`Language changed to: ${lang} (${direction})`);
}

/**
 * Initialize localization system
 * Should be called after i18next is initialized
 */
export function initLocalization() {
  // Localize on initial load
  localizeDOM();
  
  // Listen for language change events from i18next
  i18next.on('languageChanged', (lang) => {
    localizeDOM();
    
    // Update direction when language changes
    const direction = isLanguageRTL(lang) ? 'rtl' : 'ltr';
    document.documentElement.dir = direction;
    
    console.log(`i18next language changed: ${lang} (${direction})`);
  });
  
  console.log('Localization system initialized');
}

/**
 * Create language switcher with all supported languages
 * @param {string} containerId - Container element ID for language buttons
 * @param {Object} [customLanguages] - Optional custom language list (overrides LANGUAGE_NAMES)
 * @example
 * // Use all supported languages from constants
 * createLanguageSwitcher('lang-switcher')
 * 
 * // Or provide custom subset
 * createLanguageSwitcher('lang-switcher', { fa: 'فارسی', en: 'English' })
 */
export function createLanguageSwitcher(containerId, customLanguages = null) {
  const container = document.getElementById(containerId);
  if (!container) {
    console.warn(`Language switcher container not found: #${containerId}`);
    return;
  }

  // Use custom languages or default to all LANGUAGE_NAMES from constants
  const languages = customLanguages || LANGUAGE_NAMES;

  Object.entries(languages).forEach(([code, label]) => {
    // Validate language code is supported
    if (!Object.values(SUPPORTED_LANGUAGES).includes(code)) {
      console.warn(`Language code "${code}" is not in SUPPORTED_LANGUAGES`);
      return;
    }

    const button = document.createElement('button');
    button.textContent = label;
    button.className = 'language-switcher-btn';
    button.dataset.lang = code;
    
    // Mark active language
    if (code === i18next.language) {
      button.classList.add('active');
    }
    
    button.addEventListener('click', async () => {
      // Remove active from all buttons
      container.querySelectorAll('.language-switcher-btn').forEach(btn => {
        btn.classList.remove('active');
      });
      
      // Add active to clicked button
      button.classList.add('active');
      
      // Change language
      await changeLanguageAndLocalize(code);
    });
    
    container.appendChild(button);
  });
  
  console.log(`Language switcher created with languages:`, Object.keys(languages));
}

/**
 * Get all supported languages
 * @returns {Object} Object with language codes and names
 */
export function getSupportedLanguages() {
  return { ...LANGUAGE_NAMES };
}

/**
 * Get current language info
 * @returns {Object} Current language details
 */
export function getCurrentLanguageInfo() {
  const lang = i18next.language;
  return {
    code: lang,
    name: LANGUAGE_NAMES[lang] || lang,
    direction: isLanguageRTL(lang) ? 'rtl' : 'ltr',
    isRTL: isLanguageRTL(lang)
  };
}

export default {
  localizeDOM,
  changeLanguageAndLocalize,
  initLocalization,
  createLanguageSwitcher,
  getSupportedLanguages,
  getCurrentLanguageInfo
};