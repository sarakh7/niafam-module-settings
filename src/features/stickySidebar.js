import StickySidebar from "../utils/sticky-sidebar.esm";

export function initStickySidebar() {
  var sidebar = new StickySidebar(".es-page-sidebar", {
    topSpacing: 20,
    bottomSpacing: 20,
    containerSelector: ".es-page-content-container",
    innerWrapperSelector: ".sidebar__inner",
    minWidth: 991,
  });
}
