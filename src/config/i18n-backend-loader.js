/**
 * Custom i18next backend that uses Vite dynamic imports
 * for lazy-loading language files
 *
 * This backend enables on-demand loading of translation files,
 * reducing initial bundle size by loading only the needed language.
 */

// Map of language codes to their dynamic import functions
const languageLoaders = {
  fa: () => import('../locales/fa.json'),
  en: () => import('../locales/en.json'),
  ar: () => import('../locales/ar.json'),
  tr: () => import('../locales/tr.json'),
  ru: () => import('../locales/ru.json'),
};

/**
 * ViteBackendLoader - Custom i18next backend for Vite dynamic imports
 * Implements the i18next backend interface to load translation files on demand
 */
const ViteBackendLoader = {
  type: 'backend',

  init(services, backendOptions, i18nextOptions) {
    this.services = services;
    this.options = backendOptions || {};
    this.i18nextOptions = i18nextOptions;
  },

  /**
   * Load translation file for a language
   * @param {string} language - Language code (fa, en, ar, tr, ru)
   * @param {string} namespace - Namespace (default: 'translation')
   * @param {Function} callback - Callback(error, data)
   */
  read(language, namespace, callback) {
    const loader = languageLoaders[language];

    if (!loader) {
      const error = new Error(`Language "${language}" not found`);
      console.error('[i18n-backend]', error);
      return callback(error, false);
    }

    // Use dynamic import to lazy load the JSON
    // Vite will automatically code-split this into separate chunks
    loader()
      .then((module) => {
        // Vite imports JSON as default export
        const translations = module.default || module;
        console.log(`[i18n-backend] Loaded ${language}.json (${Object.keys(translations).length} keys)`);
        callback(null, translations);
      })
      .catch((error) => {
        console.error(`[i18n-backend] Failed to load ${language}.json:`, error);
        callback(error, false);
      });
  }
};

export default ViteBackendLoader;
