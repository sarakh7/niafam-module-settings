import { defineConfig } from 'vite';
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  // Multi-page configuration
  build: {
    rollupOptions: {
      input: {
        // هر صفحه HTML یک entry point است
        news: resolve(__dirname, 'index.html'),
        about: resolve(__dirname, 'about.html'),
        // برای ماژول‌های آینده:
        // settings: resolve(__dirname, 'settings.html'),
        // auth: resolve(__dirname, 'auth.html'),
      },
      output: {
        // فایل‌های build را در پوشه‌های جداگانه قرار بده
        entryFileNames: 'assets/[name]/[name]-[hash].js',
        chunkFileNames: 'assets/[name]/[name]-[hash].js',
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
