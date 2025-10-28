/**
 * State Management for Layout Module
 * Manages the state of moved nodes and created containers
 */

/**
 * @typedef {Object} OriginalPosition
 * @property {Node} parent - The original parent node
 * @property {Node} next - The original next sibling node
 */

/**
 * Store original positions of moved nodes
 * @type {WeakMap<Node, OriginalPosition>}
 */
export const originalPlace = new WeakMap();

/**
 * Track nodes that have been moved by the script
 * @type {Set<Node>}
 */
export const movedNodes = new Set();

/**
 * Track containers created by the script
 * @type {Set<HTMLElement>}
 */
export const createdContainers = new Set();
