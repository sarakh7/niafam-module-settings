import { getSettings } from "../../config/settings";

/**
 * Replace placeholders in URL template
 * @param {string} template - URL template
 * @param {string} url - Encoded URL
 * @param {string} text - Encoded text
 * @returns {string} Final URL
 */
function buildShareUrl(template, url, text) {
  return template
    .replace('{url}', url)
    .replace('{text}', text);
}

/**
 * Set social media share links based on configuration
 * @param {string} [text=''] - Optional share text
 * @param {Object} [customSettings=null] - Optional custom settings to override defaults
 * @returns {void}
 */
export function setShareLinks(text = "", customSettings = null) {
  const currentSettings = getSettings();
  const settings = customSettings || currentSettings.socialShare;

  // Get share container
  const shareContainer = document.getElementById("esprit-article-share");

  // Check if share functionality is enabled globally
  if (!settings.enabled) {
    console.info("Social share is disabled");
    
    // Hide entire share container
    if (shareContainer) {
      shareContainer.style.display = "none";
    }
    
    return;
  }

  // Show share container if it was previously hidden
  if (shareContainer) {
    shareContainer.style.display = "";
  }

  const currentUrl = encodeURIComponent(window.location.href);
  const shareText = encodeURIComponent(text);

  // Iterate through all configured platforms
  Object.entries(settings.platforms).forEach(([platformName, config]) => {
    const button = document.getElementById(config.id);
    
    if (!button) {
      console.warn(`Share button not found: #${config.id}`);
      return;
    }

    // Hide or show button based on enabled state
    if (!config.enabled) {
      button.style.display = "none";
      // console.info(`${platformName} share button hidden`);
      return;
    }

    // Show button if it was previously hidden
    button.style.display = "";

    // Build and set the share URL
    const shareUrl = buildShareUrl(config.url, currentUrl, shareText);
    button.href = shareUrl;
  });
}

/**
 * Enable a specific social share platform
 * Note: This function modifies window.NIAFAM_MODULE_SETTINGS directly
 * @param {string} platformName - Platform name from SOCIAL_SHARE_PLATFORMS
 * @returns {void}
 */
export function enableSharePlatform(platformName) {
  if (window.NIAFAM_MODULE_SETTINGS?.socialShare?.platforms?.[platformName]) {
    window.NIAFAM_MODULE_SETTINGS.socialShare.platforms[platformName].enabled = true;
    // console.info(`${platformName} share enabled`);
  }
}

/**
 * Disable a specific social share platform
 * Note: This function modifies window.NIAFAM_MODULE_SETTINGS directly
 * @param {string} platformName - Platform name from SOCIAL_SHARE_PLATFORMS
 * @returns {void}
 */
export function disableSharePlatform(platformName) {
  if (window.NIAFAM_MODULE_SETTINGS?.socialShare?.platforms?.[platformName]) {
    window.NIAFAM_MODULE_SETTINGS.socialShare.platforms[platformName].enabled = false;
    // console.info(`${platformName} share disabled`);
  }
}

/**
 * Enable all social share platforms
 * Note: This function modifies window.NIAFAM_MODULE_SETTINGS directly
 * @returns {void}
 */
export function enableAllSharePlatforms() {
  if (window.NIAFAM_MODULE_SETTINGS?.socialShare?.platforms) {
    Object.keys(window.NIAFAM_MODULE_SETTINGS.socialShare.platforms).forEach(platform => {
      window.NIAFAM_MODULE_SETTINGS.socialShare.platforms[platform].enabled = true;
    });
    // console.info("All share platforms enabled");
  }
}

/**
 * Disable all social share platforms
 * Note: This function modifies window.NIAFAM_MODULE_SETTINGS directly
 * @returns {void}
 */
export function disableAllSharePlatforms() {
  if (window.NIAFAM_MODULE_SETTINGS?.socialShare?.platforms) {
    Object.keys(window.NIAFAM_MODULE_SETTINGS.socialShare.platforms).forEach(platform => {
      window.NIAFAM_MODULE_SETTINGS.socialShare.platforms[platform].enabled = false;
    });
    // console.info("All share platforms disabled");
  }
}