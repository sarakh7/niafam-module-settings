/**
 * Initialize scroll navigation with active state management
 * @param {string} navContainerId - ID of navigation container
 * @returns {void}
 */
export function initScrollNav(navContainerId = "") {
  const container = document.getElementById(navContainerId);
  
  if (!container) {
    console.warn(`Scroll nav container not found: #${navContainerId}`);
    return;
  }

  const navlinks = container.querySelectorAll(".scroll-nav-link");

  navlinks.forEach((link) =>
    link.addEventListener("click", (event) => {
      event.preventDefault();
      
      const elementId = event.target
        .closest(".scroll-nav-link")
        .getAttribute("href")
        .replace("#", "");
      
      const element = document.getElementById(elementId);
      const activeSection = document.querySelector(".scroll-content.active");
      
      activeSection?.classList.remove("active");
      element?.classList.add("active");
      element?.scrollIntoView({ behavior: "smooth" });
    })
  );

  const sections = document.querySelectorAll(".scroll-content[id]");

  window.addEventListener("scroll", navHighlighter);

  function navHighlighter() {
    const scrollY = window.pageYOffset;

    sections.forEach((current) => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.getBoundingClientRect().top + window.pageYOffset - 75;
      const sectionId = current.getAttribute("id");

      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        document
          .querySelector(".scroll-nav-link[href*=" + sectionId + "]")
          ?.classList.add("active");
        current.classList.add("active");
      } else {
        document
          .querySelector(".scroll-nav-link[href*=" + sectionId + "]")
          ?.classList.remove("active");
        current.classList.remove("active");
      }
    });
  }
}