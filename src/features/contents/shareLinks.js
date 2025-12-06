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
 *
 * Security: Settings object is frozen to prevent tampering. Direct modification is not allowed.
 * Instead, create custom settings and pass them to setShareLinks():
 *
 * Example:
 *   const customSettings = {
 *     enabled: true,
 *     platforms: {
 *       ...getSettings().socialShare.platforms,
 *       telegram: { ...getSettings().socialShare.platforms.telegram, enabled: true }
 *     }
 *   };
 *   setShareLinks('text', customSettings);
 *
 * @deprecated This function cannot modify frozen settings. Use setShareLinks() with custom settings.
 * @param {string} platformName - Platform name from SOCIAL_SHARE_PLATFORMS
 * @returns {void}
 */
export function enableSharePlatform(platformName) {
  console.warn(
    `enableSharePlatform('${platformName}') cannot modify frozen settings. ` +
    `Use setShareLinks() with custom settings instead. See function documentation for example.`
  );
}

/**
 * Disable a specific social share platform
 *
 * Security: Settings object is frozen to prevent tampering. Direct modification is not allowed.
 * Instead, create custom settings and pass them to setShareLinks():
 *
 * Example:
 *   const customSettings = {
 *     enabled: true,
 *     platforms: {
 *       ...getSettings().socialShare.platforms,
 *       telegram: { ...getSettings().socialShare.platforms.telegram, enabled: false }
 *     }
 *   };
 *   setShareLinks('text', customSettings);
 *
 * @deprecated This function cannot modify frozen settings. Use setShareLinks() with custom settings.
 * @param {string} platformName - Platform name from SOCIAL_SHARE_PLATFORMS
 * @returns {void}
 */
export function disableSharePlatform(platformName) {
  console.warn(
    `disableSharePlatform('${platformName}') cannot modify frozen settings. ` +
    `Use setShareLinks() with custom settings instead. See function documentation for example.`
  );
}

/**
 * Enable all social share platforms
 *
 * Security: Settings object is frozen to prevent tampering. Direct modification is not allowed.
 * Instead, create custom settings and pass them to setShareLinks():
 *
 * Example:
 *   const platforms = {};
 *   Object.keys(getSettings().socialShare.platforms).forEach(key => {
 *     platforms[key] = { ...getSettings().socialShare.platforms[key], enabled: true };
 *   });
 *   const customSettings = { enabled: true, platforms };
 *   setShareLinks('text', customSettings);
 *
 * @deprecated This function cannot modify frozen settings. Use setShareLinks() with custom settings.
 * @returns {void}
 */
export function enableAllSharePlatforms() {
  console.warn(
    `enableAllSharePlatforms() cannot modify frozen settings. ` +
    `Use setShareLinks() with custom settings instead. See function documentation for example.`
  );
}

/**
 * Disable all social share platforms
 *
 * Security: Settings object is frozen to prevent tampering. Direct modification is not allowed.
 * Instead, create custom settings and pass them to setShareLinks():
 *
 * Example:
 *   const platforms = {};
 *   Object.keys(getSettings().socialShare.platforms).forEach(key => {
 *     platforms[key] = { ...getSettings().socialShare.platforms[key], enabled: false };
 *   });
 *   const customSettings = { enabled: true, platforms };
 *   setShareLinks('text', customSettings);
 *
 * @deprecated This function cannot modify frozen settings. Use setShareLinks() with custom settings.
 * @returns {void}
 */
export function disableAllSharePlatforms() {
  console.warn(
    `disableAllSharePlatforms() cannot modify frozen settings. ` +
    `Use setShareLinks() with custom settings instead. See function documentation for example.`
  );
}