function initStickySidebar(sidebarSelector, containerSelector, topSpacing = 20, bottomSpacing = 20, minWidth = 0) {
  const sidebar = document.querySelector(sidebarSelector);
  const container = document.querySelector(containerSelector);
  if (!sidebar || !container) return;

  const inner = sidebar.querySelector('.sidebar__inner');

  function update() {
    const scrollTop = window.scrollY || window.pageYOffset;
    const viewportHeight = window.innerHeight;
    const sidebarHeight = inner.offsetHeight;
    const containerTop = container.offsetTop;
    const containerHeight = container.offsetHeight;

    if (window.innerWidth < minWidth) {
      inner.style.position = 'static';
      inner.style.top = 'auto';
      return;
    }

    const maxTop = containerHeight - sidebarHeight;
    let newTop = scrollTop - containerTop + topSpacing;

    if (newTop < 0) newTop = 0;
    if (newTop > maxTop) newTop = maxTop;

    if (sidebarHeight < viewportHeight) {
      inner.style.position = 'fixed';
      inner.style.top = topSpacing + 'px';
    } else {
      inner.style.position = 'absolute';
      inner.style.top = newTop + 'px';
    }
  }

  window.addEventListener('scroll', update);
  window.addEventListener('resize', update);
  update();
}

// export function initStickySidebar(){

//   var sidebar = new stickySidebar('.es-sidebar', {
//       topSpacing: 20,
//       bottomSpacing: 20,
//       containerSelector: '.es-main-content',
//       innerWrapperSelector: '.sidebar__inner'
//     });
// }