import { originalPlace, movedNodes, createdContainers } from "./state.js";

/**
 * Remember the original position of a DOM node
 * @param {Node} node - The DOM node to remember
 * @returns {void}
 */
export function rememberOriginal(node) {
  if (!node || originalPlace.has(node) || !node.parentNode) return;
  originalPlace.set(node, { parent: node.parentNode, next: node.nextSibling });
}

/**
 * Move an array of nodes to a target container
 * @param {Node[]} nodes - Array of nodes to move
 * @param {HTMLElement} target - Target container element
 * @returns {number} Count of successfully moved nodes
 */
export function moveNodes(nodes, target) {
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
export function resetMovedNodes() {
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

/**
 * Get or create a container element
 * @param {HTMLElement} root - Root element to search in
 * @param {string} selector - Selector for existing container
 * @param {string} id - ID for new container
 * @param {string} className - Class name for new container
 * @returns {HTMLElement|null} The container element or null
 */
export function getOrCreateContainer(root, selector, id, className) {
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
