/**
 * Layout Management Module
 * Handles responsive layout adjustments and element repositioning
 * @module features/layout
 */

// ============================================================================
// CONSTANTS & SELECTORS
// ============================================================================

const MIN_WIDTH = 959;
const MIN_DESKTOP_WIDTH = 992;

/**
 * DOM Selectors Configuration
 * All selectors used in this module for easy maintenance
 */
const SELECTORS = {
  // Main containers
  ARTICLE_MAIN: "#page-content-main-article",
  
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
  ESPRIT_ARTICLE_ACCESSIBILITY_CONTROLS: "#esprit-article-accessibility-controls",
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
  if (!node || originalPlace.has(node)) return;
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
    if (orig && orig.parent) {
      try {
        if (orig.next && orig.next.parentNode === orig.parent) {
          orig.parent.insertBefore(node, orig.next);
        } else {
          orig.parent.appendChild(node);
        }
        originalPlace.delete(node);
        movedNodes.delete(node);
        resetCount++;
      } catch (e) {
        console.warn("Could not reset node:", e);
      }
    } else {
      movedNodes.delete(node);
    }
  });

  // Remove empty created containers
  createdContainers.forEach((container) => {
    try {
      if (
        container &&
        container.parentNode &&
        container.childNodes.length === 0
      ) {
        container.parentNode.removeChild(container);
      }
    } catch (e) {
      /* Ignore removal errors */
    }
  });
  createdContainers.clear();

  return resetCount;
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
  if (!root) return { moved: 0, message: "no-root" };

  if (reset) {
    const restored = resetMovedNodes();
    return { movedBack: restored, message: "reset" };
  }

  // === Move Section ===
  // 1) Move tools: accessibility controls
  let targetTools = root.querySelector(SELECTORS.ES_ARTICLE_TOOLS);
  if (!targetTools) {
    targetTools = document.createElement("div");
    targetTools.id = "es-article-tools";
    targetTools.className = CSS_CLASSES.ES_ARTICLE_TOOLS;
    targetTools.dataset.createdBy = "moveArticleTools";
    root.appendChild(targetTools);
    createdContainers.add(targetTools);
  }

  const selectors1 = [
    SELECTORS.ESPRIT_ARTICLE_ACCESSIBILITY_CONTROLS,
  ];
  let movedCount = 0;
  selectors1.forEach((sel) => {
    const nodes = Array.from(root.querySelectorAll(sel));
    if (nodes.length > 0) movedCount += moveNodes(nodes, targetTools);
  });

  // 1.5) Move shortlink actions to tools buttons container
  const shortlinkActions = Array.from(
    root.querySelectorAll(SELECTORS.ESPRIT_ARTICLE_SHORTLINK_ACTIONS)
  );
  let toolsBtns = root.querySelector(SELECTORS.ESPRIT_ARTICLE_TOOLS_BTNS);
  if (!toolsBtns && shortlinkActions.length > 0) {
    toolsBtns = document.createElement("div");
    toolsBtns.id = "esprit-article-tools-btns";
    toolsBtns.className = CSS_CLASSES.ES_ARTICLE_TOOLS_BTNS;
    toolsBtns.dataset.createdBy = "moveArticleTools";
    targetTools.appendChild(toolsBtns);
    createdContainers.add(toolsBtns);
  }
  if (toolsBtns && shortlinkActions.length > 0) {
    movedCount += moveNodes(shortlinkActions, toolsBtns);
  }

  // 1.6) Move copy shorturl button to shortlink container
  const copyBtn = root.querySelector(SELECTORS.COPY_SHORTURL_BTN);
  if (copyBtn) {
    let shortlinkBox = root.querySelector(SELECTORS.ESPRIT_ARTICLE_TOOLS_SHORTLINK);
    if (!shortlinkBox) {
      shortlinkBox = document.createElement("div");
      shortlinkBox.id = "esprit-article-tools-shortlink";
      shortlinkBox.className = CSS_CLASSES.ES_ARTICLE_TOOLS_SHORTLINK;
      shortlinkBox.dataset.createdBy = "moveArticleTools";
      targetTools.appendChild(shortlinkBox);
      createdContainers.add(shortlinkBox);
    }
    movedCount += moveNodes([copyBtn], shortlinkBox);
  }

  // 2) Move TTS container
  const ttsTarget = root.querySelector(SELECTORS.ESPRIT_ARTICLE_TOOLS) || targetTools;
  const ttsNodes = Array.from(root.querySelectorAll(SELECTORS.TTS_CONTAINER));
  if (ttsNodes.length > 0) movedCount += moveNodes(ttsNodes, ttsTarget);

  // 3) Move share elements to share container
  const shareNodes = Array.from(root.querySelectorAll(SELECTORS.ESPRIT_ARTICLE_SHARE));
  let shareTarget = root.querySelector(SELECTORS.ES_ARTICLE_SHARE);
  if (!shareTarget && shareNodes.length > 0) {
    shareTarget = document.createElement("div");
    shareTarget.id = "es-article-share";
    shareTarget.className = CSS_CLASSES.ES_ARTICLE_SHARE;
    shareTarget.dataset.createdBy = "moveArticleTools";
    root.appendChild(shareTarget);
    createdContainers.add(shareTarget);
  }
  if (shareTarget && shareNodes.length > 0)
    movedCount += moveNodes(shareNodes, shareTarget);

  // 4) Move author info to mobile wrapper
  const authorInfo = root.querySelector(SELECTORS.ESPRIT_ARTICLE_INFO);
  const mobileAuthorWrapper = root.querySelector(SELECTORS.MOBILE_AUTHOR_WRAPPER);
  if (authorInfo && mobileAuthorWrapper) {
    movedCount += moveNodes([authorInfo], mobileAuthorWrapper);
  }

  return { moved: movedCount, message: "moved" };
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
  const btn = document.querySelector(btnSelector);
  const list = document.querySelector(listSelector);
  const wrapper = document.querySelector(wrapperSelector);

  if (!btn || !list || !wrapper) return false;

  // Ensure wrapper has relative positioning for absolute children
  if (!wrapper.style.position) wrapper.style.position = "relative";

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
        if (list.classList.contains(CSS_CLASSES.ACTIVE)) list.style.overflow = "visible";
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
    if (!article) return;

    const isExactly992 = window.innerWidth === MIN_DESKTOP_WIDTH;
    const contentWidth = Math.round(article.getBoundingClientRect().width);
    const isSmall = !isExactly992 && contentWidth < MIN_WIDTH;

    const myElement = document.querySelector(SELECTORS.ESPRIT_ARTICLE_TOOLS);
    if (myElement) {
      if (isSmall) {
        myElement.classList.add(CSS_CLASSES.SHOW);
      } else {
        myElement.classList.remove(CSS_CLASSES.SHOW);
      }
    }

    if (isSmall) {
      // Apply mobile layout: move elements and initialize toggles
      if (!article.classList.contains(CSS_CLASSES.HIDE_SIDEBAR)) {
        article.classList.add(CSS_CLASSES.HIDE_SIDEBAR);
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

      if (lastWasSmall === true) {
        // Reset element movements
        moveArticleTools(article, true);

        // Close any open toggles
        const tools = document.querySelector(SELECTORS.ES_ARTICLE_TOOLS);
        if (tools) {
          tools.classList.remove(CSS_CLASSES.ACTIVE);
          tools.style.overflow = "hidden";
        }
        const share = document.querySelector(SELECTORS.ES_ARTICLE_SHARE);
        if (share) {
          share.classList.remove(CSS_CLASSES.ACTIVE);
          share.style.overflow = "hidden";
        }
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