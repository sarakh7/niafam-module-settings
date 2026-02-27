import { defineConfig } from 'vite';
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  base: process.env.VITE_BASE_PATH || '/',

  build: {
    rollupOptions: {
      input: {
        // ─── صفحات HTML ───────────────────────────────────────
        contents:         resolve(__dirname, 'index.html'),
        about:            resolve(__dirname, 'about.html'),
        ticketTracking:   resolve(__dirname, 'ticket-tracking.html'),
        profileDashboard: resolve(__dirname, 'profile-dashboard.html'),
        profileEdit:      resolve(__dirname, 'profile-edit.html'),
        profileDetails:   resolve(__dirname, 'profile-details.html'),
        authForms:        resolve(__dirname, 'login-forms.html'),
        notFound:         resolve(__dirname, '404.html'),
        contentsList:     resolve(__dirname, 'contents-list.html'),
        searchResults:    resolve(__dirname, 'search-results.html'),
        gallery:          resolve(__dirname, 'gallery.html'),
        galleryCategories: resolve(__dirname, 'gallery-categories.html'),
        subcategoryPages: resolve(__dirname, 'subcategory-pages.html'),
        contentDetail:    resolve(__dirname, 'content-detail.html'),

        // ─── کتابخانه‌های مستقل (دستی در صفحات مورد نیاز لود می‌شوند) ───
        mediaPlayer:  resolve(__dirname, 'src/features/common/mediaPlayer.js'),
        pdfGenerator: resolve(__dirname, 'src/features/contents/pdfGenerator.js'),
        galleryLib:   resolve(__dirname, 'src/features/common/gallery.js'),
        modalLib:     resolve(__dirname, 'src/features/common/modal.js'),
        plyrSvg:     resolve(__dirname, 'src/assets/img/plyr.svg'),
        plyrBlank:     resolve(__dirname, 'src/assets/video/blank.mp4'),
      },
      output: {
        entryFileNames: 'assets/module-settings/js/[name].js',

        chunkFileNames: (chunkInfo) => {
          const name = chunkInfo.name;
          if (name.startsWith('locales/')) {
            const langCode = name.replace('locales/', '');
            return `assets/module-settings/js/lang/${langCode}.js`;
          }
          return 'assets/module-settings/js/[name].js';
        },

        assetFileNames: (assetInfo) => {
          const name = assetInfo.name || '';
          if (name.endsWith('.css'))                        return 'assets/module-settings/css/[name][extname]';
          if (name.match(/\.(woff2?|eot|ttf|otf)$/))       return 'assets/module-settings/fonts/[name][extname]';
          if (name.match(/\.(png|jpe?g|gif|svg|webp)$/))   return 'assets/module-settings/img/[name][extname]';
          if (name.match(/\.(mp3|wav|ogg)$/))               return 'assets/module-settings/sounds/[name][extname]';
          if (name.match(/\.(mp4|webm)$/))                  return 'assets/module-settings/video/[name][extname]';
          return 'assets/[name][extname]';
        },

        manualChunks: (id) => {
          // فایل‌های زبان
          if (id.includes('/locales/')) {
            const match = id.match(/locales\/([a-z]{2})\.json/);
            if (match) return `locales/${match[1]}`;
          }

          // ماژول 404
          if (id.includes('/src/404-main.js')) return '404-main';
        },
      },
    },
    sourcemap: true,
    chunkSizeWarningLimit: 600,
  },

  server: {
    port: 5173,
    open: true,
  },

  css: {
    preprocessorOptions: {
      scss: {}
    }
  },

  json: {
    stringify: false,
  }
});