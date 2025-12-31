import { defineConfig } from 'vite';
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  // Base path for production deployment
  // IMPORTANT: Set this to match your server deployment path
  // For example: '/uploads/starling/' if deployed at https://example.com/uploads/starling/
  // Default is '/' for root deployment
  base: process.env.VITE_BASE_PATH || '/',

  // Multi-page configuration
  build: {
    rollupOptions: {
      input: {
        // هر صفحه HTML یک entry point است
        contents: resolve(__dirname, 'index.html'),
        about: resolve(__dirname, 'about.html'),
        ticketTracking: resolve(__dirname, 'ticket-tracking.html'),
        profileDashboard: resolve(__dirname, 'profile-dashboard.html'),
        profileEdit: resolve(__dirname, 'profile-edit.html'),
        profileDetails: resolve(__dirname, 'profile-details.html'),
        authForms: resolve(__dirname, 'login-forms.html'),
        notFound: resolve(__dirname, '404.html'),
        contentsList: resolve(__dirname, 'contents-list.html'),
        searchResults: resolve(__dirname, 'search-results.html'),
        gallery: resolve(__dirname, 'gallery.html'),
        galleryCategories: resolve(__dirname, 'gallery-categories.html'),
        subcategoryPages: resolve(__dirname, 'subcategory-pages.html'),
        contentDetail: resolve(__dirname, 'content-detail.html'),
        // برای ماژول‌های آینده:
        // settings: resolve(__dirname, 'settings.html'),
      },
      output: {
        // Entry files go to their module folders
        entryFileNames: (chunkInfo) => {
          const name = chunkInfo.name;

          // Map entry points to their folders
          if (name === 'contents') return 'assets/contents/contents.js';
          if (name === 'contentDetail') return 'assets/contents/contentDetail.js';
          if (name === 'contentsList') return 'assets/contents/contentsList.js';
          if (name === 'gallery') return 'assets/gallery/gallery.js';
          if (name === 'galleryCategories') return 'assets/gallery/galleryCategories.js';
          if (name === 'profileDashboard') return 'assets/profile/profileDashboard.js';
          if (name === 'profileEdit') return 'assets/profile/profileEdit.js';
          if (name === 'profileDetails') return 'assets/profile/profileDetails.js';
          if (name === 'authForms') return 'assets/auth/authForms.js';
          if (name === 'about') return 'assets/about/about.js';
          if (name === 'searchResults') return 'assets/search/searchResults.js';
          if (name === 'subcategoryPages') return 'assets/subcategory/subcategoryPages.js';
          if (name === 'ticketTracking') return 'assets/ticketing/ticketTracking.js';
          if (name === 'notFound') return 'assets/error/notFound.js';

          // Default fallback
          return 'assets/[name]/[name].js';
        },

        // Chunk files (lazy-loaded)
        chunkFileNames: (chunkInfo) => {
          const name = chunkInfo.name;

          // Language files → lang/
          if (name.startsWith('locales/')) {
            // Extract language code from "locales/fa" -> "fa"
            const langCode = name.replace('locales/', '');
            return `assets/lang/${langCode}.js`;
          }

          // Common utilities → common/
          if (name === 'pdfGenerator') return 'assets/common/pdfGenerator.js';
          if (name === 'mediaPlayer') return 'assets/common/mediaPlayer.js';
          if (name === 'modal') return 'assets/common/modal.js';
          if (name === 'toast') return 'assets/common/toast.js';
          if (name === 'i18n-localizer') return 'assets/common/i18n-localizer.js';
          if (name.includes('plyr')) return 'assets/common/plyr.js';
          if (name.includes('html2canvas')) return 'assets/common/html2canvas.js';
          if (name.includes('lightgallery') || name.includes('index.es')) return 'assets/common/lightgallery.js';

          // Gallery chunks
          if (name === 'gallery') return 'assets/gallery/gallery.js';

          // Profile common
          if (name === 'profile-main') return 'assets/profile/profile-main.js';

          // General main
          if (name === 'general-main') return 'assets/general/general-main.js';

          // 404 main chunk
          if (name === '404-main') return 'assets/error/404-main.js';

          // Default
          return 'assets/[name].js';
        },

        // Asset files (CSS, fonts, images, etc.)
        assetFileNames: (assetInfo) => {
          const name = assetInfo.name || '';

          // CSS files - route to their module folders
          if (name.endsWith('.css')) {
            if (name.includes('contentDetail')) return 'assets/contents/contentDetail.css';
            if (name.includes('contentsList')) return 'assets/contents/contentsList.css';
            if (name.includes('contents')) return 'assets/contents/contents.css';
            if (name.includes('galleryCategories')) return 'assets/gallery/galleryCategories.css';
            if (name.includes('gallery')) return 'assets/gallery/gallery.css';
            if (name.includes('profileDashboard')) return 'assets/profile/profileDashboard.css';
            if (name.includes('profileEdit')) return 'assets/profile/profileEdit.css';
            if (name.includes('profileDetails')) return 'assets/profile/profileDetails.css';
            if (name.includes('profile-main')) return 'assets/profile/profile-main.css';
            if (name.includes('authForms') || name.includes('auth')) return 'assets/auth/authForms.css';
            if (name.includes('about')) return 'assets/about/about.css';
            if (name.includes('searchResults')) return 'assets/search/searchResults.css';
            if (name.includes('subcategoryPages')) return 'assets/subcategory/subcategoryPages.css';
            if (name.includes('general-main')) return 'assets/general/general-main.css';
            if (name.includes('ticketTracking')) return 'assets/ticketing/ticketTracking.css';
            if (name.includes('notFound')) return 'assets/error/notFound.css';
            if (name.includes('404-main')) return 'assets/error/404-main.css';
            if (name.includes('plyr')) return 'assets/common/plyr.css';
          }

          // Fonts, images, etc. - keep existing structure
          if (name.match(/\.(woff2?|eot|ttf|otf)$/)) return 'assets/fonts/[name][extname]';
          if (name.match(/\.(png|jpe?g|gif|svg|webp)$/)) return 'assets/img/[name][extname]';
          if (name.match(/\.(mp3|wav|ogg)$/)) return 'assets/sounds/[name][extname]';
          if (name.match(/\.(mp4|webm)$/)) return 'assets/video/[name][extname]';

          // Default
          return 'assets/[name][extname]';
        },

        // Manual chunk optimization
        manualChunks: (id) => {
          // Language files
          if (id.includes('/locales/')) {
            const match = id.match(/locales\/([a-z]{2})\.json/);
            if (match) {
              return `locales/${match[1]}`;
            }
          }

          // 404 module
          if (id.includes('/src/404-main.js')) {
            return '404-main';
          }

          // Group common libraries
          if (id.includes('node_modules')) {
            if (id.includes('plyr')) return 'plyr';
            if (id.includes('html2canvas')) return 'html2canvas';
            if (id.includes('lightgallery')) return 'lightgallery';
            if (id.includes('jspdf')) return 'pdfGenerator';
          }

          // Group feature modules
          if (id.includes('src/features')) {
            if (id.includes('mediaPlayer')) return 'mediaPlayer';
            if (id.includes('modal')) return 'modal';
            if (id.includes('pdfGenerator')) return 'pdfGenerator';
          }
        },
      },
    },
    // Source maps برای debugging
    sourcemap: true,

    // Optimize chunk size
    chunkSizeWarningLimit: 600, // Warn if chunk > 600KB
  },

  server: {
    port: 5173,
    open: true, // مرورگر را خودکار باز کن
  },

  // CSS preprocessing
  css: {
    preprocessorOptions: {
      scss: {
        // اگر نیاز به global SCSS variables دارید
        // additionalData: `@import "./src/assets/scss/variables";`
      }
    }
  },

  // JSON optimization - keep as ES modules for tree-shaking
  json: {
    stringify: false,
  }
});
