# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Vite-based JavaScript module for the Niafam news platform that provides article display features including gallery, media players, accessibility controls, PDF generation, and multi-language support. The module is designed to be integrated into article/news pages and provides a rich reading experience with i18n support for Persian (FA), English (EN), Arabic (AR), Turkish (TR), and Russian (RU).

## Development Commands

- `npm run dev` - Start Vite development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run sass` - Watch and compile SCSS files (separate from Vite)

## Architecture

### Initialization Flow

**CRITICAL**: The application has a strict initialization order defined in [src/main.js](src/main.js):
1. **i18n MUST be initialized first** via `await initI18n()` before any other features
2. Then `initLocalization()` must run to set up DOM localization
3. All other features initialize after i18n is ready

Violating this order will cause translation failures across the application.

### Configuration System

The application uses a centralized configuration pattern:

- **[src/config/constants.js](src/config/constants.js)** - All application constants including supported languages, themes, gallery defaults, media player settings, and social share platform configurations
- **[src/config/settings.js](src/config/settings.js)** - Runtime settings that read from HTML attributes (`<html lang="..." dir="...">`) and merge with constants
- **[src/config/i18n.js](src/config/i18n.js)** - i18next configuration and initialization

Settings are read-only by design and determined by HTML attributes at runtime, not persisted to localStorage.

### Internationalization (i18n)

The application uses i18next with a custom DOM localization system:

- Translation files: [src/locales/*.json](src/locales/) (fa, en, ar, tr, ru)
- **[src/utils/i18n-localizer.js](src/utils/i18n-localizer.js)** - Custom utility that automatically updates DOM elements with `data-i18n` attributes
- Language direction (RTL/LTR) is automatically managed via [src/utils/languageDirections.js](src/utils/languageDirections.js)
- Default language is Persian (FA)

When working with translations:
- Add keys to all language JSON files in [src/locales/](src/locales/)
- Use `data-i18n="key"` for text content or `data-i18n="[attribute]key"` for attributes
- The localizer runs automatically on language change

### Feature Modules

All features are in [src/features/](src/features/) and follow an initialization pattern:

- **gallery.js** - Justified layout gallery with lightGallery lightbox (supports zoom, thumbnails, fullscreen, video, rotation, sharing)
- **mediaPlayer.js** - Plyr-based audio/video players + TTS (text-to-speech) functionality
- **accessibilityControls.js** - NoUiSlider-based accessibility controls for font size, word spacing, line height, background color
- **pdfGenerator.js** - PDF generation from article content using jsPDF with Persian text formatting
- **printNewsContent.js** - Print functionality for articles
- **modal.js** - Modal dialogs (reading mode, etc.)
- **stickySidebar.js** - Sticky sidebar implementation
- **layout.js** - Layout initialization and management
- **shareLinks.js** - Social media sharing links (configured via SOCIAL_SHARE_DEFAULTS in constants)
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

- Language and direction are determined by `<html lang="..." dir="...">` attributes, not stored settings
- The project uses ES modules (`"type": "module"` in package.json)
- jQuery is included but prefer vanilla JS for new code
- Persian text requires special formatting for PDF generation (see formatPersianText in pdfGenerator.js)
