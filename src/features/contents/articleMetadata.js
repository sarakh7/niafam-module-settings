/**
 * Article Metadata Manager
 * Handles dynamic icon and label updates for article metadata items
 * based on cast role types (photographer, videographer, editor)
 */

import i18next from 'i18next';

// Mapping between backend role names and translation keys
const ROLE_MAPPINGS = {
  // Persian role names from backend
  'عکاس': {
    singular: 'metadata.photographer',
    plural: 'metadata.photographers',
    icon: 'esprit-fi-rr-camera'
  },
  'فیلمبردار': {
    singular: 'metadata.videographer',
    plural: 'metadata.videographers',
    icon: 'esprit-fi-rr-video-camera'
  },
  'فیلم بردار': {
    singular: 'metadata.videographer',
    plural: 'metadata.videographers',
    icon: 'esprit-fi-rr-video-camera'
  },
  'تدوین گر': {
    singular: 'metadata.editor',
    plural: 'metadata.editors',
    icon: 'esprit-fi-rr-film'
  },
  'تدوینگر': {
    singular: 'metadata.editor',
    plural: 'metadata.editors',
    icon: 'esprit-fi-rr-film'
  },

  // English role names from backend
  'Photographer': {
    singular: 'metadata.photographer',
    plural: 'metadata.photographers',
    icon: 'esprit-fi-rr-camera'
  },
  'Photographer(s)': {
    singular: 'metadata.photographer',
    plural: 'metadata.photographers',
    icon: 'esprit-fi-rr-camera'
  },
  'Cameraman': {
    singular: 'metadata.videographer',
    plural: 'metadata.videographers',
    icon: 'esprit-fi-rr-video-camera'
  },
  'Cameraman(s)': {
    singular: 'metadata.videographer',
    plural: 'metadata.videographers',
    icon: 'esprit-fi-rr-video-camera'
  },
  'Editor': {
    singular: 'metadata.editor',
    plural: 'metadata.editors',
    icon: 'esprit-fi-rr-edit'
  },
  'Editor(s)': {
    singular: 'metadata.editor',
    plural: 'metadata.editors',
    icon: 'esprit-fi-rr-edit'
  }
};

/**
 * Get role configuration by backend role name (case-insensitive)
 * @param {string} backendRole - Role name from backend (e.g., 'عکاس', 'Photographer', 'photographer(s)')
 * @returns {Object|null} Role configuration with translation keys and icon
 */
function getRoleConfig(backendRole) {
  if (!backendRole) return null;

  // Try exact match first (for Persian and other non-Latin scripts)
  if (ROLE_MAPPINGS[backendRole]) {
    return ROLE_MAPPINGS[backendRole];
  }

  // For Latin scripts, try case-insensitive match
  const normalizedRole = backendRole.trim();
  const mappingKey = Object.keys(ROLE_MAPPINGS).find(
    key => key.toLowerCase() === normalizedRole.toLowerCase()
  );

  return mappingKey ? ROLE_MAPPINGS[mappingKey] : null;
}

/**
 * Count how many items of each role exist (case-insensitive for Latin scripts)
 * @returns {Object} Count of each role type
 */
function countRoleItems() {
  const items = document.querySelectorAll('.esprit-article-info__item[data-casttitle]');
  const counts = {};

  items.forEach(item => {
    const role = item.getAttribute('data-casttitle');
    if (role && role !== '{section}') {
      // Normalize role name for counting (case-insensitive for Latin scripts)
      const normalizedRole = role.trim().toLowerCase();
      counts[normalizedRole] = (counts[normalizedRole] || 0) + 1;
    }
  });

  return counts;
}

/**
 * Update icon and label for a single metadata item
 * @param {HTMLElement} item - The article info item element
 * @param {string} backendRole - Role name from backend
 */
function updateMetadataItem(item, backendRole) {
  const roleConfig = getRoleConfig(backendRole);

  if (!roleConfig) {
    console.warn(`Unknown role: ${backendRole}`);
    return;
  }

  // Count items to determine if we should use plural (normalized for case-insensitive comparison)
  const counts = countRoleItems();
  const normalizedRole = backendRole.trim().toLowerCase();
  const itemCount = counts[normalizedRole] || 1;
  const translationKey = itemCount > 1 ? roleConfig.plural : roleConfig.singular;

  // Update icon
  const iconElement = item.querySelector('i.es');
  if (iconElement) {
    // Remove all existing icon classes except 'es'
    iconElement.className = 'es ' + roleConfig.icon;
  }

  // Update label with translation
  const labelElement = item.querySelector('.esprit-article-info__label');
  if (labelElement) {
    const translatedLabel = i18next.t(translationKey);
    labelElement.textContent = translatedLabel;
  }
}

/**
 * Initialize article metadata by processing all items with data-casttitle
 */
export function initArticleMetadata() {
  const items = document.querySelectorAll('.esprit-article-info__item[data-casttitle]');

  items.forEach(item => {
    const backendRole = item.getAttribute('data-casttitle');

    // Skip if placeholder not yet replaced by backend
    if (!backendRole || backendRole === '{section}') {
      console.warn('Backend has not replaced {section} placeholder yet');
      return;
    }

    updateMetadataItem(item, backendRole);
  });

  // Re-process when language changes
  i18next.on('languageChanged', () => {
    items.forEach(item => {
      const backendRole = item.getAttribute('data-casttitle');
      if (backendRole && backendRole !== '{section}') {
        updateMetadataItem(item, backendRole);
      }
    });
  });

  console.log('Article metadata initialized');
}
