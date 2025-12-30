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
        profileView: resolve(__dirname, 'profile-view.html'),
        profileEdit: resolve(__dirname, 'profile-edit.html'),
        authForms: resolve(__dirname, 'login-forms.html'),
        notFound: resolve(__dirname, '404.html'),
        notFoundCreative: resolve(__dirname, '404-creative.html'),
        contentsList: resolve(__dirname, 'contents-list.html'),
        searchResults: resolve(__dirname, 'search-results.html'),
        gallery: resolve(__dirname, 'gallery.html'),
        galleryCategories: resolve(__dirname, 'gallery-categories.html'),
        generalSubcategories: resolve(__dirname, 'general-subcategories.html'),
        contentDetail: resolve(__dirname, 'content-detail.html'),
        // برای ماژول‌های آینده:
        // settings: resolve(__dirname, 'settings.html'),
      },
      output: {
        // فایل‌های build را در پوشه‌های جداگانه قرار بده
        entryFileNames: 'assets/[name]/[name]-[hash].js',

        // Custom chunk naming for i18n files
        chunkFileNames: (chunkInfo) => {
          // Name language chunks clearly for debugging
          if (chunkInfo.name.startsWith('locales/')) {
            return 'assets/i18n/[name]-[hash].js';
          }
          // چانک‌های lazy load در پوشه اصلی assets قرار می‌گیرند (نه زیرپوشه)
          // این کار مسیر نسبی را برای production درست می‌کند
          return 'assets/[name]-[hash].js';
        },

        assetFileNames: 'assets/[name]/[name]-[hash][extname]',
      },

      // Manual chunk optimization for i18n
      manualChunks: (id) => {
        // Group all locale files into separate chunks
        if (id.includes('/locales/')) {
          // Extract language code: src/locales/fa.json -> locales/fa
          const match = id.match(/locales\/([a-z]{2})\.json/);
          if (match) {
            return `locales/${match[1]}`;
          }
        }
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
