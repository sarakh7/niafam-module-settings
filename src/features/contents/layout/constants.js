import { getSettings } from "../../../config/settings.js";

/**
 * Get responsive breakpoints from settings
 * Note: This is a getter function to always get the latest settings
 */
export function getMinWidth() {
  const settings = getSettings();
  return settings.layout.mobileContentMax;
}

/**
 * DOM Selectors Configuration
 * All selectors used in the layout module for easy maintenance
 */
export const SELECTORS = {
  // Main containers
  ARTICLE_MAIN: "#page-content-main-article",
  SIDEBAR: "#es-page-sidebar",
  SHORTLINK_WRAPPER: "#esprit-article-shortlink-wrapper",

  // Tools related
  ES_ARTICLE_TOOLS: "#es-article-tools",
  ESPRIT_ARTICLE_TOOLS: "#esprit-article-tools",
  ESPRIT_ARTICLE_TOOLS_ACTIONS: "#esprit-article-tools-actions",

  // Buttons
  TOGGLE_TOOLS_BOX: "#toggle-tools-box",
  TOGGLE_SHARE_BOX: "#toggle-share-box",
  COPY_SHORTURL_BTN: "#copy-shorturl-btn",

  // Share related
  ES_ARTICLE_SHARE: "#es-article-share",
  ESPRIT_ARTICLE_SHARE: "#esprit-article-share",
  ESPRIT_ARTICLE_TOOLS_SHARE: "#esprit-article-tools-share",

  // Other elements
  ESPRIT_ARTICLE_ACCESSIBILITY_CONTROLS:
    "#esprit-article-accessibility-controls",
  ESPRIT_ARTICLE_SHORTLINK_ACTIONS: "#esprit-article-shortlink-actions",
  ESPRIT_ARTICLE_TOOLS_BTNS: "#esprit-article-tools-btns",
  ESPRIT_ARTICLE_TOOLS_SHORTLINK: "#esprit-article-tools-shortlink",
  TTS_CONTAINER: "#tts-container",
  ESPRIT_ARTICLE_INFO: "#esprit-article-info",
  MOBILE_AUTHOR_WRAPPER: "#mobile-author-wrapper",
};

/**
 * CSS Classes used for dynamic styling
 */
export const CSS_CLASSES = {
  ES_ARTICLE_TOOLS: "es-article-tools",
  ES_ARTICLE_TOOLS_BTNS: "es-article-tools__btns",
  ES_ARTICLE_TOOLS_SHORTLINK: "esprit-article-tools__shortlink",
  ES_ARTICLE_SHARE: "es-article-share",
  ACTIVE: "active",
  SHOW: "show",
  HIDE_SIDEBAR: "hide-sidebar",
};
