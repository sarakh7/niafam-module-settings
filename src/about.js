/**
 * About Page - Test Module
 * این یک ماژول تست ساده است که نشان می‌دهد چگونه ماژول جدید اضافه کنید
 */

// Import core features
import { initI18n, changeLanguage as changeLang } from './config/i18n.js';
import { localizeDOM } from './utils/i18n-localizer.js';

// Import features
import { initModal } from './features/common/modal.js';
import { initCopyShortUrl } from './features/common/copyShortUrl.js';
import { initGallery } from './features/common/gallery.js';

// Import Plyr for simple media players
import Plyr from 'plyr';
import 'plyr/dist/plyr.css';
import i18next from './config/i18n.js';

import "./assets/scss/about.scss";

/**
 * Initialize About page
 */
async function initAboutPage() {
  console.log('🚀 Initializing About Page...');

  try {
    // 1. Initialize i18n first (CRITICAL!)
    console.log('📝 Step 1: Initializing i18n...');
    await initI18n();
    console.log('✅ i18n initialized');

    // 2. Localize DOM
    console.log('📝 Step 2: Localizing DOM...');
    localizeDOM();
    console.log('✅ DOM localized');

    // 3. Initialize modal
    console.log('📝 Step 3: Initializing modal...');
    initModal();
    console.log('✅ Modal initialized');

    // 4. Initialize Gallery
    console.log('📝 Step 4: Initializing Gallery...');
    initGallery();
    console.log('✅ Gallery initialized');

    // 5. Initialize Media Players
    console.log('📝 Step 5: Initializing Media Players...');
    initMediaPlayers();
    console.log('✅ Media Players initialized');

    // 6. Initialize Short URL copy
    console.log('📝 Step 6: Initializing Short URL...');
    initCopyShortUrl();
    console.log('✅ Short URL initialized');

    // 7. Setup animations on scroll
    setupScrollAnimations();

    console.log('✨ About page initialized successfully!');
  } catch (error) {
    console.error('❌ Error initializing About page:', error);
  }
}

/**
 * Initialize simple media players
 */
function initMediaPlayers() {
  // Get Plyr i18n configuration
  const plyrI18n = {
    restart: i18next.t('player.restart'),
    rewind: i18next.t('player.rewind'),
    play: i18next.t('player.play'),
    pause: i18next.t('player.pause'),
    fastForward: i18next.t('player.forward'),
    seek: i18next.t('player.seek'),
    seekLabel: i18next.t('player.seekLabel'),
    played: i18next.t('player.played'),
    buffered: i18next.t('player.buffered'),
    currentTime: i18next.t('player.currentTime'),
    duration: i18next.t('player.duration'),
    volume: i18next.t('player.volume'),
    mute: i18next.t('player.mute'),
    unmute: i18next.t('player.unmute'),
    download: i18next.t('player.download'),
    enterFullscreen: i18next.t('player.enterFullscreen'),
    exitFullscreen: i18next.t('player.exitFullscreen'),
    settings: i18next.t('player.settings'),
    speed: i18next.t('player.speed'),
    normal: i18next.t('player.normal'),
    quality: i18next.t('player.quality'),
  };

  // Initialize video player
  const videoElement = document.querySelector('#demo-video');
  if (videoElement) {
    new Plyr(videoElement, {
      i18n: plyrI18n,
      controls: ['play-large', 'play', 'progress', 'current-time', 'mute', 'volume', 'settings', 'fullscreen'],
      settings: ['quality', 'speed'],
      quality: {
        default: 576,
        options: [1080, 720, 576]
      }
    });
  }

  // Initialize audio player
  const audioElement = document.querySelector('#demo-audio');
  if (audioElement) {
    new Plyr(audioElement, {
      i18n: plyrI18n,
      controls: ['play', 'progress', 'current-time', 'duration', 'mute', 'volume', 'settings'],
      settings: ['speed']
    });
  }
}

/**
 * Setup scroll animations
 */
function setupScrollAnimations() {
  const cards = document.querySelectorAll('.about-card');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '0';
        entry.target.style.transform = 'translateY(20px)';

        setTimeout(() => {
          entry.target.style.transition = 'all 0.6s ease';
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }, 100);

        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1
  });

  cards.forEach(card => observer.observe(card));
}

/**
 * Language switcher function
 * Make it available globally for onclick handlers
 */
window.changeLanguage = async function(lang) {
  console.log(`🌐 Changing language to: ${lang}`);
  await changeLang(lang);
  localizeDOM();
  console.log(`✅ Language changed to: ${lang}`);
};

// Start the app when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAboutPage);
} else {
  initAboutPage();
}
