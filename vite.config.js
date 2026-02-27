import { defineConfig } from "vite";
import { resolve } from "path";

// https://vitejs.dev/config/
export default defineConfig({
  // Base path for production deployment
  // IMPORTANT: Set this to match your server deployment path
  // For example: '/uploads/starling/' if deployed at https://example.com/uploads/starling/
  // Default is '/' for root deployment
  base: process.env.VITE_BASE_PATH || "/",

  // Multi-page configuration
  build: {
    rollupOptions: {
      input: {
        // هر صفحه HTML یک entry point است
        contents: resolve(__dirname, "index.html"),
        about: resolve(__dirname, "about.html"),
        ticketTracking: resolve(__dirname, "ticket-tracking.html"),
        profileDashboard: resolve(__dirname, "profile-dashboard.html"),
        profileEdit: resolve(__dirname, "profile-edit.html"),
        profileDetails: resolve(__dirname, "profile-details.html"),
        authForms: resolve(__dirname, "login-forms.html"),
        notFound: resolve(__dirname, "404.html"),
        contentsList: resolve(__dirname, "contents-list.html"),
        searchResults: resolve(__dirname, "search-results.html"),
        gallery: resolve(__dirname, "gallery.html"),
        galleryCategories: resolve(__dirname, "gallery-categories.html"),
        subcategoryPages: resolve(__dirname, "subcategory-pages.html"),
        contentDetail: resolve(__dirname, "content-detail.html"),
        mediaPlayer: resolve(__dirname, "src/features/common/mediaPlayer.js"),  

        // برای ماژول‌های آینده:
        // settings: resolve(__dirname, 'settings.html'),
      },
      output: {
        // All entry points → assets/js/
        entryFileNames: "assets/js/[name].js",

        // Chunk files (lazy-loaded)
        chunkFileNames: (chunkInfo) => {
          const name = chunkInfo.name;

          // Keep language files in a sub-folder for clarity
          if (name.startsWith("locales/")) {
            const langCode = name.replace("locales/", "");
            return `assets/js/lang/${langCode}.js`;
          }

          return "assets/js/[name].js";
        },

        // Asset files (CSS, fonts, images, etc.)
        assetFileNames: (assetInfo) => {
          const name = assetInfo.name || "";

          // All CSS → assets/css/
          if (name.endsWith(".css")) return "assets/css/[name][extname]";

          // Keep non-JS assets in their existing folders
          if (name.match(/\.(woff2?|eot|ttf|otf)$/)) return "assets/fonts/[name][extname]";
          if (name.match(/\.(png|jpe?g|gif|svg|webp)$/)) return "assets/img/[name][extname]";
          if (name.match(/\.(mp3|wav|ogg)$/)) return "assets/sounds/[name][extname]";
          if (name.match(/\.(mp4|webm)$/)) return "assets/video/[name][extname]";

          return "assets/[name][extname]";
        },

        // Manual chunk optimization
        manualChunks: (id) => {
          // Language files
          if (id.includes("/locales/")) {
            const match = id.match(/locales\/([a-z]{2})\.json/);
            if (match) {
              return `locales/${match[1]}`;
            }
          }

          // 404 module
          if (id.includes("/src/404-main.js")) {
            return "404-main";
          }

          // Group common libraries
          if (id.includes("node_modules")) {
            // if (id.includes("plyr")) return "plyr";
            if (id.includes("html2canvas")) return "html2canvas";
            if (id.includes("lightgallery")) return "lightgallery";
            if (id.includes("jspdf")) return "pdfGenerator";
          }

          // Group feature modules
          if (id.includes("src/features")) {
            // if (id.includes("mediaPlayer")) return "mediaPlayer";
            if (id.includes("modal")) return "modal";
            if (id.includes("pdfGenerator")) return "pdfGenerator";
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
      },
    },
  },

  // JSON optimization - keep as ES modules for tree-shaking
  json: {
    stringify: false,
  },
});
