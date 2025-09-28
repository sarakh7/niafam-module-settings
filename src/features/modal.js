import MicroModal from "micromodal";

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

//   var button = document.querySelector("#open-modal-send-to-friend");
//   button.addEventListener("click", function () {
//     MicroModal.show("modal-send-to-friend");
//   });
}
