# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Vite-based JavaScript module for the Niafam news platform that provides article display features including gallery, media players, accessibility controls, PDF generation, and multi-language support. The module is designed to be integrated into article/news pages and provides a rich reading experience with i18n support for Persian (FA), English (EN), Arabic (AR), Turkish (TR), and Russian (RU).

## Development Commands

- `npm run dev` - Start Vite development server (default port 5173)
- `npm run build` - Build for production (outputs to dist/)
- `npm run preview` - Preview production build
- `npm run sass` - Watch and compile SCSS files (runs independently from Vite, outputs to public/assets/css/)

## Architecture

### Initialization Flow

**CRITICAL**: The application has a strict initialization order defined in [src/main.js](src/main.js):
1. **Settings MUST be loaded first** via `await loadSettingsFromFile()` to fetch configuration from JSON files
2. **Then i18n MUST be initialized** via `await initI18n()` before any other features
3. Then `initLocalization()` must run to set up DOM localization
4. All other features initialize after settings and i18n are ready

Violating this order will cause configuration and translation failures across the application.

### Configuration System

The application uses a multi-layered configuration system:

- **[src/config/constants.js](src/config/constants.js)** - Core application constants that never change (supported languages, language names, themes, layout breakpoints)
- **[src/config/settings.js](src/config/settings.js)** - Settings management with external JSON file loading capability
  - Loads settings from `/config/settings.json` (custom server config, not in git)
  - Falls back to `/config/settings.default.json` (default config, shipped with build)
  - Provides validation and sanitization for security
  - Runtime settings also read from HTML attributes (`<html lang="..." dir="...">`)
- **[src/config/i18n.js](src/config/i18n.js)** - i18next configuration and initialization
- **[public/config/settings.default.json](public/config/settings.default.json)** - Default settings shipped with the application
- **config/settings.json** (optional, not in git) - Server-specific custom settings that override defaults

#### Server Configuration

Admins can customize settings per server without rebuilding:
1. Copy `public/config/settings.default.json` to `config/settings.json` (outside dist/)
2. Edit `config/settings.json` with server-specific values
3. Changes persist through rebuilds (config/ is in .gitignore)

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed configuration instructions.

Settings are validated for security (type checking, URL validation, range limits, whitelisting).

### Internationalization (i18n)

The application uses i18next with a custom DOM localization system:

- Translation files: [src/locales/*.json](src/locales/) (fa, en, ar, tr, ru)
- **[src/utils/i18n-localizer.js](src/utils/i18n-localizer.js)** - Custom utility that automatically updates DOM elements with `data-i18n` attributes
- Language direction (RTL/LTR) is automatically managed via [src/utils/languageDirections.js](src/utils/languageDirections.js)
- Default language is Persian (FA)

When working with translations:
- Add keys to all language JSON files in [src/locales/](src/locales/)
- Use `data-i18n="key"` for text content, `data-i18n="[placeholder]key"` for attributes, or `data-i18n="[html]key"` for HTML content
- The localizer runs automatically on language change via the i18next `languageChanged` event

### Feature Modules

All features are in [src/features/](src/features/) and follow an initialization pattern:

- **gallery.js** - Justified layout gallery using flickr/justified-layout algorithm with lightGallery lightbox (supports zoom, thumbnails, fullscreen, video, rotation, sharing)
- **mediaPlayer.js** - Plyr-based audio/video players + TTS (text-to-speech) functionality
- **accessibilityControls.js** - NoUiSlider-based accessibility controls for font size, word spacing, line height, background color
- **pdfGenerator.js** - PDF generation from article content using jsPDF with Persian text formatting
- **printNewsContent.js** - Print functionality for articles
- **modal.js** - Modal dialogs (reading mode, etc.)
- **stickySidebar.js** - Sticky sidebar implementation
- **layout.js** - Layout initialization and management
- **shareLinks.js** - Social media sharing links (configured via settings.json)
- **copyShortUrl.js** - Short URL copy functionality

### Accessibility System

The accessibility controls system ([src/features/accessibilityControls.js](src/features/accessibilityControls.js)) creates independent slider instances for:
- Article content (`.esprit-article__main-content`)
- Reading mode modal (`#modal-reading-mode-content`)

Each instance maintains its own state and reset functionality. When working with accessibility features, note that sliders are scoped to their containers to avoid conflicts.

### Styling

- SCSS files in [src/assets/scss/](src/assets/scss/)
- Component-based structure in [src/assets/scss/components/](src/assets/scss/components/)
- Main entry: [src/assets/scss/main.scss](src/assets/scss/main.scss)
- Supports both RTL and LTR layouts
- Uses Dana font for Persian/Arabic and Roboto for Latin scripts

### HTML Integration

The application expects HTML structure with specific class names and IDs. See [index.html](index.html) for reference. Key elements:
- Article container: `.esprit-article__main-content`
- Reading mode modal: `#modal-reading-mode-content`
- Gallery containers with `data-*` attributes
- Accessibility control sliders with specific IDs

## Key Dependencies

- **Vite** - Build tool and dev server
- **i18next** - Internationalization framework
- **lightGallery** - Image/video gallery with lightbox
- **Plyr** - Media player
- **jsPDF** - PDF generation
- **noUiSlider** - Accessibility sliders
- **MicroModal** - Modal dialogs
- **justified-layout** - Gallery layout algorithm

## Important Notes

- **Configuration**: Settings are loaded from external JSON files at runtime. Always use `getSettings()` to access current settings, never hardcode configuration values.
- **Settings Location**:
  - Default settings: `public/config/settings.default.json` (in git, shipped with build)
  - Custom settings: `config/settings.json` (not in git, server-specific)
  - Settings in `config/` persist through rebuilds
- Language and direction are determined by `<html lang="..." dir="...">` attributes at runtime, not stored in localStorage
- The project uses ES modules (`"type": "module"` in package.json)
- jQuery is included but prefer vanilla JS for new code
- Persian/Arabic text requires special formatting for PDF generation (see formatPersianText in [src/features/pdfGenerator.js](src/features/pdfGenerator.js) - handles ZWNJ, punctuation spacing, number conversion, and bracket reversal)
- SCSS compilation via `npm run sass` is separate from Vite's build process and must be run independently during development if styles are modified
- For deployment instructions and server configuration, see [DEPLOYMENT.md](DEPLOYMENT.md)
