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
        // برای ماژول‌های آینده:
        // settings: resolve(__dirname, 'settings.html'),
      },
      output: {
        // فایل‌های build را در پوشه‌های جداگانه قرار بده
        entryFileNames: 'assets/[name]/[name]-[hash].js',
        // چانک‌های lazy load در پوشه اصلی assets قرار می‌گیرند (نه زیرپوشه)
        // این کار مسیر نسبی را برای production درست می‌کند
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]/[name]-[hash][extname]',
      }
    },
    // Source maps برای debugging
    sourcemap: true,
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
  }
});
