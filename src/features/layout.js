/**
 * Layout Management Module
 * Handles responsive layout adjustments and element repositioning
 * @module features/layout
 */

import { LAYOUT_BREAKPOINTS } from "../config/constants.js";

// ============================================================================
// CONSTANTS & SELECTORS
// ============================================================================

/**
 * Responsive breakpoints imported from config
 */
const MIN_WIDTH = LAYOUT_BREAKPOINTS.MOBILE_CONTENT_MAX;
const MIN_DESKTOP_WIDTH = LAYOUT_BREAKPOINTS.DESKTOP_VIEWPORT_MIN;

/**
 * DOM Selectors Configuration
 * All selectors used in this module for easy maintenance
 */
const SELECTORS = {
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
const CSS_CLASSES = {
  ES_ARTICLE_TOOLS: "es-article-tools",
  ES_ARTICLE_TOOLS_BTNS: "es-article-tools__btns",
  ES_ARTICLE_TOOLS_SHORTLINK: "esprit-article-tools__shortlink",
  ES_ARTICLE_SHARE: "es-article-share",
  ACTIVE: "active",
  SHOW: "show",
  HIDE_SIDEBAR: "hide-sidebar",
};

// ============================================================================
// STATE MANAGEMENT
// ============================================================================

/** @type {WeakMap<Node, {parent: Node, next: Node}>} Store original positions of moved nodes */
const originalPlace = new WeakMap();

/** @type {Set<Node>} Track nodes that have been moved by the script */
const movedNodes = new Set();

/** @type {Set<HTMLElement>} Track containers created by the script */
const createdContainers = new Set();

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Remember the original position of a DOM node
 * @param {Node} node - The DOM node to remember
 * @returns {void}
 */
function rememberOriginal(node) {
  if (!node || originalPlace.has(node) || !node.parentNode) return;
  originalPlace.set(node, { parent: node.parentNode, next: node.nextSibling });
}

/**
 * Move an array of nodes to a target container
 * @param {Node[]} nodes - Array of nodes to move
 * @param {HTMLElement} target - Target container element
 * @returns {number} Count of successfully moved nodes
 */
function moveNodes(nodes, target) {
  if (!target || !nodes || nodes.length === 0) return 0;
  let count = 0;
  nodes.forEach((node) => {
    if (!node || !node.parentNode) return;
    rememberOriginal(node);
    target.appendChild(node);
    movedNodes.add(node);
    count++;
  });
  return count;
}

/**
 * Reset all moved nodes to their original positions
 * @returns {number} Count of nodes successfully reset
 */
function resetMovedNodes() {
  let resetCount = 0;

  Array.from(movedNodes).forEach((node) => {
    const orig = originalPlace.get(node);
    if (orig?.parent) {
      try {
        // Check if the next sibling still exists in the original parent
        if (orig.next?.parentNode === orig.parent) {
          orig.parent.insertBefore(node, orig.next);
        } else {
          orig.parent.appendChild(node);
        }
        originalPlace.delete(node);
        movedNodes.delete(node);
        resetCount++;
      } catch (e) {
        console.warn("resetMovedNodes: Could not reset node", e);
        movedNodes.delete(node); // Clean up even if reset failed
      }
    } else {
      movedNodes.delete(node);
    }
  });

  // Remove empty created containers
  createdContainers.forEach((container) => {
    try {
      if (container?.parentNode && container.childNodes.length === 0) {
        container.parentNode.removeChild(container);
      }
    } catch (e) {
      console.warn("resetMovedNodes: Could not remove empty container", e);
    }
  });
  createdContainers.clear();

  return resetCount;
}

// ============================================================================
// MAIN FUNCTIONS - HELPER FUNCTIONS
// ============================================================================

/**
 * Get or create a container element
 * @param {HTMLElement} root - Root element to search in
 * @param {string} selector - Selector for existing container
 * @param {string} id - ID for new container
 * @param {string} className - Class name for new container
 * @returns {HTMLElement|null} The container element or null
 */
function getOrCreateContainer(root, selector, id, className) {
  let container = root?.querySelector(selector);
  if (!container) {
    container = document.createElement("div");
    container.id = id;
    container.className = className;
    container.dataset.createdBy = "moveArticleTools";
    root?.appendChild(container);
    createdContainers.add(container);
  }
  return container;
}

/**
 * Move accessibility controls to tools container
 * @param {HTMLElement} root - Root element
 * @param {HTMLElement} targetTools - Target tools container
 * @returns {number} Count of moved elements
 */
function moveAccessibilityControls(root, targetTools) {
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
function moveShortlinkActions(root, targetTools) {
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
function moveCopyShortUrlButton(root, targetTools) {
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
function moveTTSContainer(root, targetTools) {
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
function moveShareElements(root) {
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
function moveAuthorInfo(root) {
  const authorInfo = root.querySelector(SELECTORS.ESPRIT_ARTICLE_INFO);
  const mobileAuthorWrapper = root.querySelector(
    SELECTORS.MOBILE_AUTHOR_WRAPPER
  );

  if (!authorInfo || !mobileAuthorWrapper) return 0;
  return moveNodes([authorInfo], mobileAuthorWrapper);
}

// ============================================================================
// MAIN FUNCTIONS
// ============================================================================

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

/**
 * Close a toggle element and reset its state
 * @param {string} selector - Selector for the toggle element
 * @returns {boolean} Success status
 */
function closeToggle(selector) {
  const element = document.querySelector(selector);
  if (!element) return false;

  element.classList.remove(CSS_CLASSES.ACTIVE);
  element.style.overflow = "hidden";
  return true;
}

/**
 * Setup toggle behavior for collapsible elements
 * @param {Object} opts - Toggle configuration options
 * @param {string} opts.btnSelector - Button selector
 * @param {string} opts.listSelector - List/content selector
 * @param {string} opts.wrapperSelector - Wrapper selector
 * @param {string} [opts.bodyFlagName] - Flag name to prevent duplicate listeners
 * @returns {boolean} Success status
 */
function setupToggle(opts = {}) {
  const { btnSelector, listSelector, wrapperSelector, bodyFlagName } = opts;

  if (!btnSelector || !listSelector || !wrapperSelector) {
    console.warn("setupToggle: Missing required selectors");
    return false;
  }

  const btn = document.querySelector(btnSelector);
  const list = document.querySelector(listSelector);
  const wrapper = document.querySelector(wrapperSelector);

  if (!btn || !list || !wrapper) {
    console.warn("setupToggle: Required elements not found", {
      btn: !!btn,
      list: !!list,
      wrapper: !!wrapper,
    });
    return false;
  }

  // Ensure wrapper has relative positioning for absolute children
  if (!wrapper.style.position) {
    wrapper.style.position = "relative";
  }

  /**
   * Open the toggle list
   */
  const open = () => {
    // Hide overflow before opening to prevent content flash
    list.style.overflow = "hidden";
    list.classList.add(CSS_CLASSES.ACTIVE);
    // After transition ends, set overflow visible for tooltips to show
    list.addEventListener(
      "transitionend",
      () => {
        if (list.classList.contains(CSS_CLASSES.ACTIVE))
          list.style.overflow = "visible";
      },
      { once: true }
    );
  };

  /**
   * Close the toggle list
   */
  const close = () => {
    list.style.overflow = "hidden";
    list.classList.remove(CSS_CLASSES.ACTIVE);
  };

  // Prevent duplicate button binding
  if (!btn.dataset.bound) {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      list.classList.contains(CSS_CLASSES.ACTIVE) ? close() : open();
    });
    btn.dataset.bound = "true";
  }

  // Prevent duplicate document click listener
  const flag = bodyFlagName || "toggleBound";
  if (!document.body.dataset[flag]) {
    document.addEventListener("click", (e) => {
      if (!wrapper.contains(e.target)) {
        close();
      }
    });
    document.body.dataset[flag] = "true";
  }

  return true;
}

/**
 * Initialize responsive layout system
 * Handles element repositioning based on viewport width
 * @returns {void}
 */
export function setLayout() {
  const articleSelector = SELECTORS.ARTICLE_MAIN;

  let lastWasSmall = null;

  /**
   * Check viewport width and adjust layout accordingly
   */
  function checkWidth() {
    const article = document.querySelector(articleSelector);

    if (!article) {
      console.warn("setLayout: Article element not found");
      return;
    }

    const contentWidth = Math.round(article.getBoundingClientRect().width);
    const isSmall =
      window.innerWidth < MIN_DESKTOP_WIDTH || contentWidth < MIN_WIDTH;

    // Toggle visibility class on article tools
    const myElement = document.querySelector(SELECTORS.ESPRIT_ARTICLE_TOOLS);
    if (myElement) {
      myElement.classList.toggle(CSS_CLASSES.SHOW, isSmall);
    }

    if (isSmall) {
      // Apply mobile layout: move elements and initialize toggles
      if (!article.classList.contains(CSS_CLASSES.HIDE_SIDEBAR)) {
        article.classList.add(CSS_CLASSES.HIDE_SIDEBAR);
      }

      const sidebar = document.querySelector(SELECTORS.SIDEBAR);
      const shortLinksWrapper = document.querySelector(
        SELECTORS.SHORTLINK_WRAPPER
      );
      // Apply mobile styles
      article.style.gridTemplateColumns = "1fr";

      if (sidebar) {
        sidebar.style.width = "100%";
      }
      if (shortLinksWrapper) {
        shortLinksWrapper.style.display = "none";
      }

      if (lastWasSmall !== true) {
        // Move elements to mobile layout
        moveArticleTools(article, false);

        // Initialize toggle for tools
        setupToggle({
          btnSelector: SELECTORS.TOGGLE_TOOLS_BOX,
          listSelector: SELECTORS.ES_ARTICLE_TOOLS,
          wrapperSelector: SELECTORS.ESPRIT_ARTICLE_TOOLS_ACTIONS,
          bodyFlagName: "toolsBound",
        });

        // Initialize toggle for share
        setupToggle({
          btnSelector: SELECTORS.TOGGLE_SHARE_BOX,
          listSelector: SELECTORS.ES_ARTICLE_SHARE,
          wrapperSelector: SELECTORS.ESPRIT_ARTICLE_TOOLS_SHARE,
          bodyFlagName: "shareBound",
        });
      }
    } else {
      // Apply desktop layout: reset elements
      if (article.classList.contains(CSS_CLASSES.HIDE_SIDEBAR)) {
        article.classList.remove(CSS_CLASSES.HIDE_SIDEBAR);
      }

      // Remove mobile styles
      article.style.gridTemplateColumns = "";

      const sidebar = document.querySelector(SELECTORS.SIDEBAR);
      const shortLinksWrapper = document.querySelector(
        SELECTORS.SHORTLINK_WRAPPER
      );

      // Reset sidebar and shortlink wrapper styles
      if (sidebar) {
        sidebar.style.width = "";
      }
      if (shortLinksWrapper) {
        shortLinksWrapper.style.display = "";
      }

      const shortlinkElement = document.querySelector(
        SELECTORS.ESPRIT_ARTICLE_TOOLS_SHORTLINK
      );
      if (shortlinkElement) {
        shortlinkElement.style.display = "";
      }

      if (lastWasSmall === true) {
        // Reset element movements
        moveArticleTools(article, true);

        // Close any open toggles and reset their state
        closeToggle(SELECTORS.ES_ARTICLE_TOOLS);
        closeToggle(SELECTORS.ES_ARTICLE_SHARE);

        // Note: Event listeners are not removed as elements return to original positions
        // and will continue to work naturally. For complete cleanup, listeners could be
        // removed, but for simplicity, we only close the toggle state here.
      }
    }

    lastWasSmall = isSmall;
  }

  /**
   * Debounced resize handler using requestAnimationFrame
   */
  let rafId = null;
  function debouncedCheck() {
    if (rafId) cancelAnimationFrame(rafId);
    rafId = requestAnimationFrame(() => {
      checkWidth();
      rafId = null;
    });
  }

  window.addEventListener("DOMContentLoaded", checkWidth);
  window.addEventListener("resize", debouncedCheck);

  // Run immediately if DOM is already loaded
  if (
    document.readyState === "complete" ||
    document.readyState === "interactive"
  ) {
    checkWidth();
  }
}
