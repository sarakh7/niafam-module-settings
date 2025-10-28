import { SELECTORS, CSS_CLASSES } from "./constants.js";
import {
  moveNodes,
  getOrCreateContainer,
  resetMovedNodes,
} from "./nodeManipulation.js";
import { createdContainers } from "./state.js";

/**
 * Move accessibility controls to tools container
 * @param {HTMLElement} root - Root element
 * @param {HTMLElement} targetTools - Target tools container
 * @returns {number} Count of moved elements
 */
export function moveAccessibilityControls(root, targetTools) {
  const nodes = Array.from(
    root.querySelectorAll(SELECTORS.ESPRIT_ARTICLE_ACCESSIBILITY_CONTROLS)
  );
  return nodes.length > 0 ? moveNodes(nodes, targetTools) : 0;
}

/**
 * Move shortlink actions to tools buttons container
 * @param {HTMLElement} root - Root element
 * @param {HTMLElement} targetTools - Target tools container
 * @returns {number} Count of moved elements
 */
export function moveShortlinkActions(root, targetTools) {
  const shortlinkActions = Array.from(
    root.querySelectorAll(SELECTORS.ESPRIT_ARTICLE_SHORTLINK_ACTIONS)
  );

  if (shortlinkActions.length === 0) return 0;

  // Find or create toolsBtns container in root (not targetTools!)
  let toolsBtns = root.querySelector(SELECTORS.ESPRIT_ARTICLE_TOOLS_BTNS);
  if (!toolsBtns && shortlinkActions.length > 0) {
    toolsBtns = document.createElement("div");
    toolsBtns.id = "esprit-article-tools-btns";
    toolsBtns.className = CSS_CLASSES.ES_ARTICLE_TOOLS_BTNS;
    toolsBtns.dataset.createdBy = "moveArticleTools";
    targetTools.appendChild(toolsBtns);
    createdContainers.add(toolsBtns);
  }

  return toolsBtns ? moveNodes(shortlinkActions, toolsBtns) : 0;
}

/**
 * Move copy shorturl button to shortlink container
 * @param {HTMLElement} root - Root element
 * @param {HTMLElement} targetTools - Target tools container
 * @returns {number} Count of moved elements
 */
export function moveCopyShortUrlButton(root, targetTools) {
  const copyBtn = root.querySelector(SELECTORS.COPY_SHORTURL_BTN);
  if (!copyBtn) return 0;

  // Find or create shortlinkBox container in root (not targetTools!)
  let shortlinkBox = root.querySelector(
    SELECTORS.ESPRIT_ARTICLE_TOOLS_SHORTLINK
  );
  if (!shortlinkBox) {
    shortlinkBox = document.createElement("div");
    shortlinkBox.id = "esprit-article-tools-shortlink";
    shortlinkBox.className = CSS_CLASSES.ES_ARTICLE_TOOLS_SHORTLINK;
    shortlinkBox.dataset.createdBy = "moveArticleTools";
    targetTools.appendChild(shortlinkBox);
    createdContainers.add(shortlinkBox);
  }

  return moveNodes([copyBtn], shortlinkBox);
}

/**
 * Move TTS container to tools
 * @param {HTMLElement} root - Root element
 * @param {HTMLElement} targetTools - Target tools container
 * @returns {number} Count of moved elements
 */
export function moveTTSContainer(root, targetTools) {
  const ttsTarget =
    root.querySelector(SELECTORS.ESPRIT_ARTICLE_TOOLS) || targetTools;
  const ttsNodes = Array.from(root.querySelectorAll(SELECTORS.TTS_CONTAINER));
  return ttsNodes.length > 0 ? moveNodes(ttsNodes, ttsTarget) : 0;
}

/**
 * Move share elements to share container
 * @param {HTMLElement} root - Root element
 * @returns {number} Count of moved elements
 */
export function moveShareElements(root) {
  const shareNodes = Array.from(
    root.querySelectorAll(SELECTORS.ESPRIT_ARTICLE_SHARE)
  );
  if (shareNodes.length === 0) return 0;

  const shareTarget = getOrCreateContainer(
    root,
    SELECTORS.ES_ARTICLE_SHARE,
    "es-article-share",
    CSS_CLASSES.ES_ARTICLE_SHARE
  );

  return shareTarget ? moveNodes(shareNodes, shareTarget) : 0;
}

/**
 * Move author info to mobile wrapper
 * @param {HTMLElement} root - Root element
 * @returns {number} Count of moved elements
 */
export function moveAuthorInfo(root) {
  const authorInfo = root.querySelector(SELECTORS.ESPRIT_ARTICLE_INFO);
  const mobileAuthorWrapper = root.querySelector(
    SELECTORS.MOBILE_AUTHOR_WRAPPER
  );

  if (!authorInfo || !mobileAuthorWrapper) return 0;
  return moveNodes([authorInfo], mobileAuthorWrapper);
}

/**
 * Move or reset article tool elements based on viewport
 * @param {string|HTMLElement} rootSelector - Root element selector or element itself
 * @param {boolean} [reset=false] - If true, reset to original positions
 * @returns {{moved?: number, movedBack?: number, message: string}} Operation result
 */
export function moveArticleTools(
  rootSelector = SELECTORS.ARTICLE_MAIN,
  reset = false
) {
  const root =
    typeof rootSelector === "string"
      ? document.querySelector(rootSelector)
      : rootSelector;

  if (!root) {
    console.warn("moveArticleTools: Root element not found");
    return { moved: 0, message: "no-root" };
  }

  // Reset mode: restore all elements to original positions
  if (reset) {
    const restored = resetMovedNodes();
    return { movedBack: restored, message: "reset" };
  }

  // Move mode: relocate elements for mobile layout
  try {
    // Create or get main tools container
    const targetTools = getOrCreateContainer(
      root,
      SELECTORS.ES_ARTICLE_TOOLS,
      "es-article-tools",
      CSS_CLASSES.ES_ARTICLE_TOOLS
    );

    let movedCount = 0;

    // Execute all move operations
    movedCount += moveAccessibilityControls(root, targetTools);
    movedCount += moveShortlinkActions(root, targetTools);
    movedCount += moveCopyShortUrlButton(root, targetTools);
    movedCount += moveTTSContainer(root, targetTools);
    movedCount += moveShareElements(root);
    movedCount += moveAuthorInfo(root);

    return { moved: movedCount, message: "moved" };
  } catch (error) {
    console.error("moveArticleTools: Error during move operation", error);
    return { moved: 0, message: "error", error };
  }
}
