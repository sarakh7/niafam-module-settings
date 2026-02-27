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

    // 5. Initialize Short URL copy
    console.log('📝 Step 5: Initializing Short URL...');
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
