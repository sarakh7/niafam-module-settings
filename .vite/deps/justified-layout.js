import {
  __commonJS
} from "./chunk-EQCVQC35.js";

// node_modules/justified-layout/lib/row.js
var require_row = __commonJS({
  "node_modules/justified-layout/lib/row.js"(exports, module) {
    var Row = module.exports = function(params) {
      this.top = params.top;
      this.left = params.left;
      this.width = params.width;
      this.spacing = params.spacing;
      this.targetRowHeight = params.targetRowHeight;
      this.targetRowHeightTolerance = params.targetRowHeightTolerance;
      this.minAspectRatio = this.width / params.targetRowHeight * (1 - params.targetRowHeightTolerance);
      this.maxAspectRatio = this.width / params.targetRowHeight * (1 + params.targetRowHeightTolerance);
      this.edgeCaseMinRowHeight = params.edgeCaseMinRowHeight;
      this.edgeCaseMaxRowHeight = params.edgeCaseMaxRowHeight;
      this.widowLayoutStyle = params.widowLayoutStyle;
      this.isBreakoutRow = params.isBreakoutRow;
      this.items = [];
      this.height = 0;
    };
    Row.prototype = {
      /**
       * Attempt to add a single item to the row.
       * This is the heart of the justified algorithm.
       * This method is direction-agnostic; it deals only with sizes, not positions.
       *
       * If the item fits in the row, without pushing row height beyond min/max tolerance,
       * the item is added and the method returns true.
       *
       * If the item leaves row height too high, there may be room to scale it down and add another item.
       * In this case, the item is added and the method returns true, but the row is incomplete.
       *
       * If the item leaves row height too short, there are too many items to fit within tolerance.
       * The method will either accept or reject the new item, favoring the resulting row height closest to within tolerance.
       * If the item is rejected, left/right padding will be required to fit the row height within tolerance;
       * if the item is accepted, top/bottom cropping will be required to fit the row height within tolerance.
       *
       * @method addItem
       * @param itemData {Object} Item layout data, containing item aspect ratio.
       * @return {Boolean} True if successfully added; false if rejected.
       */
      addItem: function(itemData) {
        var newItems = this.items.concat(itemData), rowWidthWithoutSpacing = this.width - (newItems.length - 1) * this.spacing, newAspectRatio = newItems.reduce(function(sum, item) {
          return sum + item.aspectRatio;
        }, 0), targetAspectRatio = rowWidthWithoutSpacing / this.targetRowHeight, previousRowWidthWithoutSpacing, previousAspectRatio, previousTargetAspectRatio;
        if (this.isBreakoutRow) {
          if (this.items.length === 0) {
            if (itemData.aspectRatio >= 1) {
              this.items.push(itemData);
              this.completeLayout(rowWidthWithoutSpacing / itemData.aspectRatio, "justify");
              return true;
            }
          }
        }
        if (newAspectRatio < this.minAspectRatio) {
          this.items.push(Object.assign({}, itemData));
          return true;
        } else if (newAspectRatio > this.maxAspectRatio) {
          if (this.items.length === 0) {
            this.items.push(Object.assign({}, itemData));
            this.completeLayout(rowWidthWithoutSpacing / newAspectRatio, "justify");
            return true;
          }
          previousRowWidthWithoutSpacing = this.width - (this.items.length - 1) * this.spacing;
          previousAspectRatio = this.items.reduce(function(sum, item) {
            return sum + item.aspectRatio;
          }, 0);
          previousTargetAspectRatio = previousRowWidthWithoutSpacing / this.targetRowHeight;
          if (Math.abs(newAspectRatio - targetAspectRatio) > Math.abs(previousAspectRatio - previousTargetAspectRatio)) {
            this.completeLayout(previousRowWidthWithoutSpacing / previousAspectRatio, "justify");
            return false;
          } else {
            this.items.push(Object.assign({}, itemData));
            this.completeLayout(rowWidthWithoutSpacing / newAspectRatio, "justify");
            return true;
          }
        } else {
          this.items.push(Object.assign({}, itemData));
          this.completeLayout(rowWidthWithoutSpacing / newAspectRatio, "justify");
          return true;
        }
      },
      /**
       * Check if a row has completed its layout.
       *
       * @method isLayoutComplete
       * @return {Boolean} True if complete; false if not.
       */
      isLayoutComplete: function() {
        return this.height > 0;
      },
      /**
       * Set row height and compute item geometry from that height.
       * Will justify items within the row unless instructed not to.
       *
       * @method completeLayout
       * @param newHeight {Number} Set row height to this value.
       * @param widowLayoutStyle {String} How should widows display? Supported: left | justify | center
       */
      completeLayout: function(newHeight, widowLayoutStyle) {
        var itemWidthSum = this.left, rowWidthWithoutSpacing = this.width - (this.items.length - 1) * this.spacing, clampedToNativeRatio, clampedHeight, errorWidthPerItem, roundedCumulativeErrors, singleItemGeometry, centerOffset;
        if (typeof widowLayoutStyle === "undefined" || ["justify", "center", "left"].indexOf(widowLayoutStyle) < 0) {
          widowLayoutStyle = "left";
        }
        clampedHeight = Math.max(this.edgeCaseMinRowHeight, Math.min(newHeight, this.edgeCaseMaxRowHeight));
        if (newHeight !== clampedHeight) {
          this.height = clampedHeight;
          clampedToNativeRatio = rowWidthWithoutSpacing / clampedHeight / (rowWidthWithoutSpacing / newHeight);
        } else {
          this.height = newHeight;
          clampedToNativeRatio = 1;
        }
        this.items.forEach(function(item) {
          item.top = this.top;
          item.width = item.aspectRatio * this.height * clampedToNativeRatio;
          item.height = this.height;
          item.left = itemWidthSum;
          itemWidthSum += item.width + this.spacing;
        }, this);
        if (widowLayoutStyle === "justify") {
          itemWidthSum -= this.spacing + this.left;
          errorWidthPerItem = (itemWidthSum - this.width) / this.items.length;
          roundedCumulativeErrors = this.items.map(function(item, i) {
            return Math.round((i + 1) * errorWidthPerItem);
          });
          if (this.items.length === 1) {
            singleItemGeometry = this.items[0];
            singleItemGeometry.width -= Math.round(errorWidthPerItem);
          } else {
            this.items.forEach(function(item, i) {
              if (i > 0) {
                item.left -= roundedCumulativeErrors[i - 1];
                item.width -= roundedCumulativeErrors[i] - roundedCumulativeErrors[i - 1];
              } else {
                item.width -= roundedCumulativeErrors[i];
              }
            });
          }
        } else if (widowLayoutStyle === "center") {
          centerOffset = (this.width - itemWidthSum) / 2;
          this.items.forEach(function(item) {
            item.left += centerOffset + this.spacing;
          }, this);
        }
      },
      /**
       * Force completion of row layout with current items.
       *
       * @method forceComplete
       * @param fitToWidth {Boolean} Stretch current items to fill the row width.
       *                             This will likely result in padding.
       * @param fitToWidth {Number}
       */
      forceComplete: function(fitToWidth, rowHeight) {
        if (typeof rowHeight === "number") {
          this.completeLayout(rowHeight, this.widowLayoutStyle);
        } else {
          this.completeLayout(this.targetRowHeight, this.widowLayoutStyle);
        }
      },
      /**
       * Return layout data for items within row.
       * Note: returns actual list, not a copy.
       *
       * @method getItems
       * @return Layout data for items within row.
       */
      getItems: function() {
        return this.items;
      }
    };
  }
});

// node_modules/justified-layout/lib/index.js
var require_lib = __commonJS({
  "node_modules/justified-layout/lib/index.js"(exports, module) {
    var Row = require_row();
    function createNewRow(layoutConfig, layoutData) {
      var isBreakoutRow;
      if (layoutConfig.fullWidthBreakoutRowCadence !== false) {
        if ((layoutData._rows.length + 1) % layoutConfig.fullWidthBreakoutRowCadence === 0) {
          isBreakoutRow = true;
        }
      }
      return new Row({
        top: layoutData._containerHeight,
        left: layoutConfig.containerPadding.left,
        width: layoutConfig.containerWidth - layoutConfig.containerPadding.left - layoutConfig.containerPadding.right,
        spacing: layoutConfig.boxSpacing.horizontal,
        targetRowHeight: layoutConfig.targetRowHeight,
        targetRowHeightTolerance: layoutConfig.targetRowHeightTolerance,
        edgeCaseMinRowHeight: 0.5 * layoutConfig.targetRowHeight,
        edgeCaseMaxRowHeight: 2 * layoutConfig.targetRowHeight,
        rightToLeft: false,
        isBreakoutRow,
        widowLayoutStyle: layoutConfig.widowLayoutStyle
      });
    }
    function addRow(layoutConfig, layoutData, row) {
      layoutData._rows.push(row);
      layoutData._layoutItems = layoutData._layoutItems.concat(row.getItems());
      layoutData._containerHeight += row.height + layoutConfig.boxSpacing.vertical;
      return row.items;
    }
    function computeLayout(layoutConfig, layoutData, itemLayoutData) {
      var laidOutItems = [], itemAdded, currentRow, nextToLastRowHeight;
      if (layoutConfig.forceAspectRatio) {
        itemLayoutData.forEach(function(itemData) {
          itemData.forcedAspectRatio = true;
          itemData.aspectRatio = layoutConfig.forceAspectRatio;
        });
      }
      itemLayoutData.some(function(itemData, i) {
        if (isNaN(itemData.aspectRatio)) {
          throw new Error("Item " + i + " has an invalid aspect ratio");
        }
        if (!currentRow) {
          currentRow = createNewRow(layoutConfig, layoutData);
        }
        itemAdded = currentRow.addItem(itemData);
        if (currentRow.isLayoutComplete()) {
          laidOutItems = laidOutItems.concat(addRow(layoutConfig, layoutData, currentRow));
          if (layoutData._rows.length >= layoutConfig.maxNumRows) {
            currentRow = null;
            return true;
          }
          currentRow = createNewRow(layoutConfig, layoutData);
          if (!itemAdded) {
            itemAdded = currentRow.addItem(itemData);
            if (currentRow.isLayoutComplete()) {
              laidOutItems = laidOutItems.concat(addRow(layoutConfig, layoutData, currentRow));
              if (layoutData._rows.length >= layoutConfig.maxNumRows) {
                currentRow = null;
                return true;
              }
              currentRow = createNewRow(layoutConfig, layoutData);
            }
          }
        }
      });
      if (currentRow && currentRow.getItems().length && layoutConfig.showWidows) {
        if (layoutData._rows.length) {
          if (layoutData._rows[layoutData._rows.length - 1].isBreakoutRow) {
            nextToLastRowHeight = layoutData._rows[layoutData._rows.length - 1].targetRowHeight;
          } else {
            nextToLastRowHeight = layoutData._rows[layoutData._rows.length - 1].height;
          }
          currentRow.forceComplete(false, nextToLastRowHeight);
        } else {
          currentRow.forceComplete(false);
        }
        laidOutItems = laidOutItems.concat(addRow(layoutConfig, layoutData, currentRow));
        layoutConfig._widowCount = currentRow.getItems().length;
      }
      layoutData._containerHeight = layoutData._containerHeight - layoutConfig.boxSpacing.vertical;
      layoutData._containerHeight = layoutData._containerHeight + layoutConfig.containerPadding.bottom;
      return {
        containerHeight: layoutData._containerHeight,
        widowCount: layoutConfig._widowCount,
        boxes: layoutData._layoutItems
      };
    }
    module.exports = function(input, config) {
      var layoutConfig = {};
      var layoutData = {};
      var defaults = {
        containerWidth: 1060,
        containerPadding: 10,
        boxSpacing: 10,
        targetRowHeight: 320,
        targetRowHeightTolerance: 0.25,
        maxNumRows: Number.POSITIVE_INFINITY,
        forceAspectRatio: false,
        showWidows: true,
        fullWidthBreakoutRowCadence: false,
        widowLayoutStyle: "left"
      };
      var containerPadding = {};
      var boxSpacing = {};
      config = config || {};
      layoutConfig = Object.assign(defaults, config);
      containerPadding.top = !isNaN(parseFloat(layoutConfig.containerPadding.top)) ? layoutConfig.containerPadding.top : layoutConfig.containerPadding;
      containerPadding.right = !isNaN(parseFloat(layoutConfig.containerPadding.right)) ? layoutConfig.containerPadding.right : layoutConfig.containerPadding;
      containerPadding.bottom = !isNaN(parseFloat(layoutConfig.containerPadding.bottom)) ? layoutConfig.containerPadding.bottom : layoutConfig.containerPadding;
      containerPadding.left = !isNaN(parseFloat(layoutConfig.containerPadding.left)) ? layoutConfig.containerPadding.left : layoutConfig.containerPadding;
      boxSpacing.horizontal = !isNaN(parseFloat(layoutConfig.boxSpacing.horizontal)) ? layoutConfig.boxSpacing.horizontal : layoutConfig.boxSpacing;
      boxSpacing.vertical = !isNaN(parseFloat(layoutConfig.boxSpacing.vertical)) ? layoutConfig.boxSpacing.vertical : layoutConfig.boxSpacing;
      layoutConfig.containerPadding = containerPadding;
      layoutConfig.boxSpacing = boxSpacing;
      layoutData._layoutItems = [];
      layoutData._awakeItems = [];
      layoutData._inViewportItems = [];
      layoutData._leadingOrphans = [];
      layoutData._trailingOrphans = [];
      layoutData._containerHeight = layoutConfig.containerPadding.top;
      layoutData._rows = [];
      layoutData._orphans = [];
      layoutConfig._widowCount = 0;
      return computeLayout(layoutConfig, layoutData, input.map(function(item) {
        if (item.width && item.height) {
          return { aspectRatio: item.width / item.height };
        } else {
          return { aspectRatio: item };
        }
      }));
    };
  }
});
export default require_lib();
/*! Bundled license information:

justified-layout/lib/row.js:
justified-layout/lib/index.js:
  (*!
   * Copyright 2019 SmugMug, Inc.
   * Licensed under the terms of the MIT license. Please see LICENSE file in the project root for terms.
   * @license
   *)
*/
//# sourceMappingURL=justified-layout.js.map
