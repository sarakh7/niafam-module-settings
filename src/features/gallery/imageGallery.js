import { initGallery } from '../common/gallery';

/**
 * Initialize image gallery section
 */
export function initImageGallery() {
  const galleryContainer = document.getElementById('gallery-images');

  if (!galleryContainer) {
    console.warn('Image gallery container not found');
    return;
  }

  // Reuse existing initGallery with custom selector
  initGallery('#gallery-images');
}
