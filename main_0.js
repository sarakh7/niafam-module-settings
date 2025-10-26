/**
 * Main entry point for News Module
 * Uses modularized packages
 */

// Import from @niafam/core
import { initI18n, localizeDOM } from './packages/core/dist/index.js';

// Import from @niafam/features
import { initGallery } from './packages/features/gallery/dist/index.js';
import { initVideoPlayer, initAudioPlayer, initTts, initReadingModeTts } from './packages/features/media-player/dist/index.js';
import { setShareLinks } from './packages/features/sharing/dist/index.js';
import { initStickySidebar } from './packages/features/sticky-sidebar/dist/index.js';

// Import from @niafam/modules-news
import {
  initPdfGenerator,
  initPrintNewsContent,
  initAccessibilityActions,
  setLayout
} from './packages/modules/news/dist/index.js';

/**
 * Initialize all features
 */
async function initApp() {
  try {
    // CRITICAL: Initialize i18n first
    console.log('Initializing i18n...');
    await initI18n();

    // Localize DOM elements
    localizeDOM();

    console.log('i18n initialized successfully');

    // Initialize gallery
    if (document.querySelector('.esprit-article__gallery')) {
      console.log('Initializing gallery...');
      initGallery();
    }

    // Initialize video player
    if (document.querySelector('#main-video')) {
      console.log('Initializing video player...');
      initVideoPlayer();
    }

    // Initialize audio player
    if (document.querySelector('.audio-player')) {
      console.log('Initializing audio player...');
      initAudioPlayer();
    }

    // Initialize TTS
    if (document.querySelector('#tts-btn')) {
      console.log('Initializing TTS...');
      initTts();
    }

    // Initialize Reading Mode TTS
    if (document.querySelector('#reading-mode-tts-btn')) {
      console.log('Initializing Reading Mode TTS...');
      initReadingModeTts();
    }

    // Initialize share links
    if (document.querySelector('#esprit-article-share')) {
      console.log('Initializing share links...');
      const articleTitle = document.querySelector('.esprit-article__title')?.innerText || '';
      setShareLinks({ text: articleTitle });
    }

    // Initialize sticky sidebar
    if (document.querySelector('.es-page-sidebar')) {
      console.log('Initializing sticky sidebar...');
      initStickySidebar();
    }

    // Initialize PDF generator
    if (document.querySelector('#create-pdf')) {
      console.log('Initializing PDF generator...');
      initPdfGenerator();
    }

    // Initialize print functionality
    if (document.querySelector('#print-content')) {
      console.log('Initializing print functionality...');
      initPrintNewsContent();
    }

    // Initialize accessibility controls
    if (document.querySelector('#esprit-article-accessibility-controls')) {
      console.log('Initializing accessibility controls...');
      initAccessibilityActions();
    }

    // Initialize responsive layout
    console.log('Initializing layout...');
    setLayout();

    console.log('All features initialized successfully!');
  } catch (error) {
    console.error('Error initializing app:', error);
  }
}

// Start the app when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}
