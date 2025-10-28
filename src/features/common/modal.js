import MicroModal from "micromodal";

/**
 * Initialize MicroModal with custom configuration
 * @returns {void}
 */
export function initModal() {
  MicroModal.init({
    onShow: (modal) => console.info(`${modal.id} is shown`),
    onClose: (modal) => console.info(`${modal.id} is hidden`),
    openTrigger: "data-custom-open",
    closeTrigger: "data-custom-close",
    disableScroll: true,
    disableFocus: false,
    awaitCloseAnimation: false,
    debugMode: true,
  });
}