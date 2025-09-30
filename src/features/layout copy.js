function moveArticleTools(rootSelector = ".hide-sidebar") {
  try {
    const root = document.querySelector(rootSelector);
    if (!root) return;

    // بخش ۱: انتقال accessibility + shortlink
    const selectors1 = [
      ".esprit-article-shortlink",
      ".esprit-article-accessibility__controls",
    ];

    let target1 = root.querySelector(".es-article-tools");
    if (!target1) {
      target1 = document.createElement("div");
      target1.className = "es-article-tools";
      root.appendChild(target1);
    }

    selectors1.forEach((sel) => {
      root.querySelectorAll(sel).forEach((node) => target1.appendChild(node));
    });

    // بخش ۲: انتقال tts
    let target2 = root.querySelector(".esprit-article-tools");
    root.querySelectorAll(".tts__container").forEach((node) => {
      if (target2) target2.appendChild(node);
    });

    // بخش ۳: انتقال share
    let shareTarget = root.querySelector(".es-article-share");
    const shareNodes = [...root.querySelectorAll(".esprit-article-share")];
    if (!shareTarget && shareNodes.length > 0) {
      shareTarget = document.createElement("div");
      shareTarget.className = "es-article-share";
      root.appendChild(shareTarget);
    }
    shareNodes.forEach((node) => shareTarget.appendChild(node));

    return { message: "done" };
  } catch (err) {
    console.error("Error moving article tools:", err);
    return { message: "error", error: String(err) };
  }
}

function initToolsToggle() {
  const btn = document.querySelector("#toggle-tools-box");
  const tools = document.querySelector(".es-article-tools");
  const wrapper = document.querySelector(".esprit-article-tools__actions");

  if (!btn || !tools || !wrapper) return;

  if (!wrapper.style.position) wrapper.style.position = "relative";

  const open = () => {
    tools.classList.add("active");
    tools.addEventListener("transitionend", function handler() {
      if (tools.classList.contains("active")) {
        tools.style.overflow = "visible";
      }
      tools.removeEventListener("transitionend", handler);
    });
  };

  const close = () => {
    tools.style.overflow = "hidden";
    tools.classList.remove("active");
  };

  if (!btn.dataset.bound) {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      tools.classList.contains("active") ? close() : open();
    });
    btn.dataset.bound = "true";
  }

  if (!document.body.dataset.toolsBound) {
    document.addEventListener("click", (e) => {
      if (!wrapper.contains(e.target)) close();
    });
    document.body.dataset.toolsBound = "true";
  }
}

function initShareToggle() {
  const btn = document.querySelector("#toggle-share-box");
  const sharelist = document.querySelector(".es-article-share");
  const shareWrapper = document.querySelector(".esprit-article-tools__share");

  if (!btn || !sharelist || !shareWrapper) return;

  if (!shareWrapper.style.position) shareWrapper.style.position = "relative";

  const open = () => {
    sharelist.classList.add("active");
    sharelist.addEventListener("transitionend", function handler() {
      if (sharelist.classList.contains("active")) {
        sharelist.style.overflow = "visible";
      }
      sharelist.removeEventListener("transitionend", handler);
    });
  };

  const close = () => {
    sharelist.style.overflow = "hidden";
    sharelist.classList.remove("active");
  };

  if (!btn.dataset.bound) {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      sharelist.classList.contains("active") ? close() : open();
    });
    btn.dataset.bound = "true";
  }

  if (!document.body.dataset.shareBound) {
    document.addEventListener("click", (e) => {
      if (!shareWrapper.contains(e.target)) close();
    });
    document.body.dataset.shareBound = "true";
  }
}

export function setLayout() {
  function checkWidth() {
    const article = document.querySelector(".page-content-main__article");
    if (!article) return;

    if (article.offsetWidth < 992) {
      if (!article.classList.contains("hide-sidebar")) {
        article.classList.add("hide-sidebar");
        moveArticleTools();
        initToolsToggle();
        initShareToggle();
      }
    } else {
      article.classList.remove("hide-sidebar");
    }
  }

  window.addEventListener("DOMContentLoaded", checkWidth);
  window.addEventListener("resize", checkWidth);
}
