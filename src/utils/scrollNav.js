export function initScrollNav(navContainer = "") {
  const container = document.getElementById(navContainer);
  if (!container) return null;

  const navlinks = container.querySelectorAll(".scroll-nav-link");

  navlinks.forEach((link) =>
    link.addEventListener("click", (event) => {
      event.preventDefault();
      let elmentId = event.target
        .closest(".scroll-nav-link")
        .getAttribute("href")
        .replace("#", "");
      let element = document.getElementById(elmentId);
      let activeSection = document.querySelector(".scroll-content.active");
      activeSection?.classList.remove("active");
      element?.classList.add("active");
      element?.scrollIntoView({ behavior: "smooth" });
    })
  );

  const sections = document.querySelectorAll(".scroll-content[id]");

  window.addEventListener("scroll", navHighlighter);

  function navHighlighter() {
    let scrollY = window.pageYOffset;

    sections.forEach((current) => {
      const sectionHeight = current.offsetHeight;

      const sectionTop =
        current.getBoundingClientRect().top + window.pageYOffset - 75;
      const sectionId = current.getAttribute("id");

      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        document
          .querySelector(".scroll-nav-link[href*=" + sectionId + "]")
          .classList.add("active");
        current.classList.add("active");
      } else {
        document
          .querySelector(".scroll-nav-link[href*=" + sectionId + "]")
          .classList.remove("active");
        current.classList.remove("active");
      }
    });
  }
}
