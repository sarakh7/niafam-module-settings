# General Subcategories Page - Documentation

## Overview

The general subcategories page supports two display modes:
1. **Grid Mode** - Multi-column grid for main category navigation
2. **List Mode** - Single-column compact list for subpages (404, about, etc.)

## File Structure

```
general-subcategories.html              # Main HTML page
src/assets/scss/general-subcategories.scss           # Main SCSS entry point
src/assets/scss/general-subcategories/
├── _header.scss                        # Page header component
├── _grid.scss                          # Grid mode styles
└── _subpages-list.scss                 # List mode styles (for subpages)
```

## Display Modes

### Grid Mode (Default)

Used for **main category navigation** - the primary subcategories of the general module.

**HTML Structure:**
```html
<div class="general-subcats-grid">
  <!-- Cards display in multi-column grid -->
  <a href="/settings.html" class="general-subcats-card general-subcats-card--no-image">
    <div class="general-subcats-card__content general-subcats-card__content--centered">
      <img class="general-subcats-card__icon" src="/assets/icons/settings.png" alt="" loading="lazy" />
      <h2 class="general-subcats-card__title">Settings</h2>
    </div>
  </a>
</div>
```

**Features:**
- 3-4 columns on desktop
- 1 column on mobile (≤768px)
- Vertical card layout
- Icon centered above title (for no-image cards)

---

### List Mode

Used for **general module subpages** like 404 pages, about pages, introduction, etc.

**HTML Structure:**
```html
<div class="general-subcats-grid" data-list-mode="true">
  <!-- Cards display in single-column list -->
  <a href="/about.html" class="general-subcats-card general-subcats-card--no-image">
    <div class="general-subcats-card__content general-subcats-card__content--centered">
      <img class="general-subcats-card__icon" src="/assets/icons/info.png" alt="" loading="lazy" />
      <h2 class="general-subcats-card__title">About</h2>
    </div>
  </a>
</div>
```

**Features:**
- Always single column
- Horizontal card layout (icon on left, title on right)
- More compact spacing
- Automatic separation from main grid (top border)

---

## Card Types

### 1. Card with Image

```html
<a href="/url" class="general-subcats-card general-subcats-card--with-image">
  <div class="general-subcats-card__image-wrapper">
    <img class="general-subcats-card__image" src="/assets/img/photo.jpg" alt="" loading="lazy" />
    <div class="general-subcats-card__overlay">
      <img src="/assets/icons/icon.png" alt="" loading="lazy" />
    </div>
  </div>
  <div class="general-subcats-card__content">
    <img class="general-subcats-card__icon" src="/assets/icons/icon.png" alt="" loading="lazy" />
    <h2 class="general-subcats-card__title">Title</h2>
  </div>
</a>
```

**Grid Mode:**
- Image at top (16:9 ratio)
- Icon appears in overlay on hover
- Icon + title below image

**List Mode:**
- Image on left (200px wide)
- Icon + title on right
- Stacks vertically on mobile

---

### 2. Card without Image (with icon)

```html
<a href="/url" class="general-subcats-card general-subcats-card--no-image">
  <div class="general-subcats-card__content general-subcats-card__content--centered">
    <img class="general-subcats-card__icon" src="/assets/icons/icon.png" alt="" loading="lazy" />
    <h2 class="general-subcats-card__title">Title</h2>
  </div>
</a>
```

**Grid Mode:**
- Centered icon above title
- Accent background with subtle pattern
- Square card appearance

**List Mode:**
- Icon on left, title on right
- Horizontal layout
- Compact height

---

### 3. Card without Image or Icon

```html
<a href="/url" class="general-subcats-card general-subcats-card--no-image">
  <div class="general-subcats-card__content general-subcats-card__content--centered">
    <h2 class="general-subcats-card__title">Title Only</h2>
  </div>
</a>
```

**Both Modes:**
- Automatically adjusts padding when no icon present
- Title remains properly centered/aligned

---

## Icon Support

### PNG Icons (Recommended)

```html
<img class="general-subcats-card__icon" src="/assets/icons/icon.png" alt="" loading="lazy" />
```

**Sizing:**
- Grid mode (no-image): 72px × 72px (desktop)
- Grid mode (with-image): 48px × 48px (desktop)
- List mode: 48px × 48px (desktop)
- Overlay: 64px × 64px (with white filter)

### Font Icons (Also Supported)

```html
<i class="general-subcats-card__icon es esprit-fi-rr-settings"></i>
```

**Sizing:**
- Grid mode (no-image): 3.5em
- Grid mode (with-image): 2.25em
- List mode: 2.5em

---

## Switching Between Modes

### Method 1: HTML Attribute

**Grid Mode:**
```html
<div class="general-subcats-grid">
  <!-- Multi-column grid -->
</div>
```

**List Mode:**
```html
<div class="general-subcats-grid" data-list-mode="true">
  <!-- Single-column list -->
</div>
```

### Method 2: JavaScript Toggle

```javascript
const grid = document.querySelector('.general-subcats-grid');

// Enable list mode
grid.setAttribute('data-list-mode', 'true');

// Disable list mode (back to grid)
grid.removeAttribute('data-list-mode');
```

---

## When to Use Each Mode

### Use Grid Mode for:
- Main navigation categories
- Primary subcategories
- Featured content
- Visual browsing experience

### Use List Mode for:
- Auxiliary/utility pages (404, 500, etc.)
- Secondary subpages
- Administrative pages
- Compact navigation lists
- Mobile-optimized lists

---

## Responsive Behavior

### Grid Mode

| Screen Size | Layout |
|-------------|--------|
| ≥1280px | 4 columns |
| 1024px - 1279px | 3 columns |
| 768px - 1023px | 2-3 columns |
| ≤767px | 1 column |

### List Mode

| Screen Size | Layout |
|-------------|--------|
| All sizes | 1 column (always) |

**Card Layout Changes:**
- Desktop: Image (200px) + Content (remaining width)
- Tablet: Image (120px) + Content
- Mobile: Stacks vertically (image top, content below)

---

## Styling Guidelines

### Colors
- Primary: `$blue-gray-600`
- Text: `$blue-gray-700`
- Background (no-image): `$blue-gray-50`
- Border: `$gray-200`

### Spacing
- Grid gap (desktop): `$spacing-5` (32px)
- Grid gap (mobile): `$spacing-3` (16px)
- List gap: `$spacing-3` (16px)
- Card padding: `$spacing-4` (24px)

### Border Radius
- Cards: `$radius-xl` (12px) in grid mode
- Cards: `$radius-lg` (8px) in list mode

### Animations
- Card hover: `translateY(-5px)` lift
- Shadow elevation on hover
- Image zoom: `scale(1.08)`
- Icon scale: `scale(1.1)`

---

## Example: Complete Page Structure

```html
<div class="general-subcats-page-main">
  <!-- Page Header -->
  <header class="general-subcats-header">
    <h1 class="general-subcats-header__title">General Subcategories</h1>
    <p class="general-subcats-header__description">Quick access to system sections</p>
  </header>

  <!-- Main Categories (Grid Mode) -->
  <div class="general-subcats-grid">
    <a href="/settings.html" class="general-subcats-card general-subcats-card--no-image">
      <div class="general-subcats-card__content general-subcats-card__content--centered">
        <img class="general-subcats-card__icon" src="/assets/icons/settings.png" alt="" loading="lazy" />
        <h2 class="general-subcats-card__title">Settings</h2>
      </div>
    </a>
    <!-- More main categories... -->
  </div>

  <!-- Separator -->
  <div style="padding: 40px 0;"></div>

  <!-- Subpages (List Mode) -->
  <div class="general-subcats-grid" data-list-mode="true">
    <a href="/about.html" class="general-subcats-card general-subcats-card--no-image">
      <div class="general-subcats-card__content general-subcats-card__content--centered">
        <img class="general-subcats-card__icon" src="/assets/icons/info.png" alt="" loading="lazy" />
        <h2 class="general-subcats-card__title">About</h2>
      </div>
    </a>
    <!-- More subpages... -->
  </div>
</div>
```

---

## RTL/LTR Support

Both modes fully support bidirectional text:

- Uses `margin-inline-end` for proper icon spacing
- Flexbox automatically handles text direction
- No manual RTL/LTR adjustments needed

---

## Accessibility

- Semantic HTML structure (`<a>`, `<h2>`)
- `loading="lazy"` for performance
- Empty `alt=""` for decorative icons (title provides context)
- Keyboard navigable (native link behavior)
- Reduced motion support via `@media (prefers-reduced-motion)`

---

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- CSS Grid & Flexbox required
- CSS Custom Properties used
- Graceful degradation for older browsers

---

## Performance Optimization

1. **Lazy Loading**: All images use `loading="lazy"`
2. **Hardware Acceleration**: `will-change`, `backface-visibility`
3. **Efficient Selectors**: BEM naming prevents deep nesting
4. **CSS Variables**: Consistent theming without duplication

---

## Troubleshooting

### Cards not aligning properly in grid mode
- Ensure all cards have consistent height with `min-height` on `.general-subcats-card--no-image`

### List mode not activating
- Check that `data-list-mode="true"` attribute is set
- Verify `_subpages-list.scss` is imported in main SCSS file

### Icons not displaying
- Verify icon paths are correct
- Check that icon files exist in `/assets/icons/`
- For font icons, ensure icon font CSS is loaded

### Hover effects not working
- Check that `transition` properties are not disabled
- Verify no `prefers-reduced-motion` override is active

---

## Future Enhancements

Potential additions:
- Optional section headers for list mode (`<h2 class="general-subcats-subpages-header__title">`)
- Badge/count indicators on cards
- Search/filter functionality
- Drag-to-reorder capability
- Customizable grid columns via data attributes

---

## Version History

- **v1.0.0** (2025-12-23): Initial implementation with grid and list modes
