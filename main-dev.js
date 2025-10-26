/**
 * Main entry point - SIMPLE TEST
 * Just test i18n for now
 */

import { initI18n } from './packages/core/src/i18n/config.js';
import { localizeDOM } from './packages/core/src/i18n/localizer.js';

async function initApp() {
  console.log('=== Starting i18n Test ===');
  await initI18n();
  console.log('✓ i18n OK');
  localizeDOM();
  console.log('✓ Localization OK');
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}
