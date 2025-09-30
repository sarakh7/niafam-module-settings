// بازنویسی‌شده: انتقال المان‌ها + قابلیت ریست
const MIN_WIDTH = 959;
const MIN_DESKTOP_WIDTH = 992;

// ذخیره مرجع اصلی نودها تا هنگام ریست دوباره برگردونیم
const originalPlace = new WeakMap();
// مجموعه‌ای از نودهایی که اسکریپت آنها را جابجا کرده
const movedNodes = new Set();
// کانتینرهایی که اسکریپت خودش ساخته (تا در صورت خالی بودن آنها را حذف کنیم)
const createdContainers = new Set();

/**
 * یادداشت محل اصلی یک نود (parent + nextSibling)
 */
function rememberOriginal(node) {
  if (!node || originalPlace.has(node)) return;
  originalPlace.set(node, { parent: node.parentNode, next: node.nextSibling });
}

/**
 * انتقال یک آرایه از نودها به target
 */
function moveNodes(nodes, target) {
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
 * بازگرداندن همه نودهایی که جابجا شده‌اند به محل اصلی‌شان
 */
function resetMovedNodes() {
  let resetCount = 0;
  // تبدیل به آرایه تا در صورت تغییر movedNodes درون loop مشکلی پیش نیاد
  Array.from(movedNodes).forEach((node) => {
    const orig = originalPlace.get(node);
    if (orig && orig.parent) {
      try {
        if (orig.next && orig.next.parentNode === orig.parent) {
          orig.parent.insertBefore(node, orig.next);
        } else {
          orig.parent.appendChild(node);
        }
        originalPlace.delete(node);
        movedNodes.delete(node);
        resetCount++;
      } catch (e) {
        // اگر parent دیگه موجود نبود، نادیده می‌گیریم
        console.warn("Could not reset node:", e);
      }
    } else {
      // اگر اطلاعات اصلی نبود، فقط حذفش می‌کنیم از movedNodes
      movedNodes.delete(node);
    }
  });

  // حذف کانتینرهایی که اسکریپت ساخت و الان خالی شدن
  createdContainers.forEach((container) => {
    try {
      if (
        container &&
        container.parentNode &&
        container.childNodes.length === 0
      ) {
        container.parentNode.removeChild(container);
      }
    } catch (e) {
      /* ignore */
    }
  });
  createdContainers.clear();

  return resetCount;
}

/**
 * تابع کلی برای انتقال یا ریست المان‌ها.
 * rootSelector می‌تواند selector string یا خود عنصر DOM باشد.
 * اگر reset === false => انتقال انجام می‌شود.
 * اگر reset === true => بازگشت انجام می‌شود.
 */
export function moveArticleTools(
  rootSelector = ".page-content-main__article",
  reset = false
) {
  const root =
    typeof rootSelector === "string"
      ? document.querySelector(rootSelector)
      : rootSelector;
  if (!root) return { moved: 0, message: "no-root" };

  if (reset) {
    const restored = resetMovedNodes();
    return { movedBack: restored, message: "reset" };
  }

  // === بخش انتقال ===
  // ۱) tools: shortlink + accessibility
  let targetTools = root.querySelector(".es-article-tools");
  if (!targetTools) {
    targetTools = document.createElement("div");
    targetTools.className = "es-article-tools";
    targetTools.dataset.createdBy = "moveArticleTools";
    root.appendChild(targetTools);
    createdContainers.add(targetTools);
  }

  const selectors1 = [
    ".esprit-article-shortlink",
    ".esprit-article-accessibility__controls",
  ];
  let movedCount = 0;
  selectors1.forEach((sel) => {
    const nodes = Array.from(root.querySelectorAll(sel));
    if (nodes.length > 0) movedCount += moveNodes(nodes, targetTools);
  });

  // ۲) tts__container => سعی می‌کنیم اول به .esprit-article-tools داخل root صدا بزنیم، در غیر اینصورت همان targetTools
  const ttsTarget = root.querySelector(".esprit-article-tools") || targetTools;
  const ttsNodes = Array.from(root.querySelectorAll(".tts__container"));
  if (ttsNodes.length > 0) movedCount += moveNodes(ttsNodes, ttsTarget);

  // ۳) share => المان‌های .esprit-article-share به یک .es-article-share منتقل می‌شوند
  const shareNodes = Array.from(root.querySelectorAll(".esprit-article-share"));
  let shareTarget = root.querySelector(".es-article-share");
  if (!shareTarget && shareNodes.length > 0) {
    shareTarget = document.createElement("div");
    shareTarget.className = "es-article-share";
    shareTarget.dataset.createdBy = "moveArticleTools";
    root.appendChild(shareTarget);
    createdContainers.add(shareTarget);
  }
  if (shareTarget && shareNodes.length > 0)
    movedCount += moveNodes(shareNodes, shareTarget);

  return { moved: movedCount, message: "moved" };
}

/**
 * تابع عمومی برای ایجاد toggle behavior
 * opts: { btnSelector, listSelector, wrapperSelector, bodyFlagName }
 * bodyFlagName برای جلوگیری از دوبار اضافه کردن document click listener است.
 */
function setupToggle(opts = {}) {
  const { btnSelector, listSelector, wrapperSelector, bodyFlagName } = opts;
  const btn = document.querySelector(btnSelector);
  const list = document.querySelector(listSelector);
  const wrapper = document.querySelector(wrapperSelector);

  if (!btn || !list || !wrapper) return false;

  // مطمئن شدن از position relative روی wrapper تا absolute داخلش درست عمل کنه
  if (!wrapper.style.position) wrapper.style.position = "relative";

  const open = () => {
    // قبل از باز شدن یکبار overflow را hide می‌کنیم (در صورت باز ماندن قبلی)
    list.style.overflow = "hidden";
    list.classList.add("active");
    // وقتی transition تموم شد overflow visible شود تا tooltipها بیرون دیده شوند
    list.addEventListener(
      "transitionend",
      () => {
        if (list.classList.contains("active")) list.style.overflow = "visible";
      },
      { once: true }
    );
  };

  const close = () => {
    list.style.overflow = "hidden";
    list.classList.remove("active");
  };

  // جلوگیری از bind دوباره روی دکمه
  if (!btn.dataset.bound) {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      list.classList.contains("active") ? close() : open();
    });
    btn.dataset.bound = "true";
  }

  // جلوگیری از bind دوباره روی document برای کلیک بیرونی
  const flag = bodyFlagName || "toggleBound";
  if (!document.body.dataset[flag]) {
    document.addEventListener("click", (e) => {
      if (!wrapper.contains(e.target)) {
        close();
      }
    });
    document.body.dataset[flag] = "true";
  }

  return true;
}

/**
 * مقداردهی کلی: چک کردن عرض، انتقال المان‌ها وقتی کوچک شد و ریست وقتی بزرگ شد.
 * همین تابع export می‌شود تا در نقطه لازم اجرا شود.
 */
export function setLayout() {
  const articleSelector = ".page-content-main__article";
  let lastWasSmall = null;

  function checkWidth() {
    const article = document.querySelector(articleSelector);
    if (!article) return;

    const isExactly992 = window.innerWidth === MIN_DESKTOP_WIDTH;
    const contentWidth = Math.round(article.getBoundingClientRect().width);
    const isSmall = !isExactly992 && contentWidth < MIN_WIDTH;

    const myElement = document.querySelector("#esprit-article-tools");
    if (myElement) {
      if (isSmall) {
        myElement.classList.add("show");
      } else {
        myElement.classList.remove("show");
      }
    }

    if (isSmall) {
      // اگر قبلاً کوچک نبود، منتقل کن و toggle ها را init کن
      if (!article.classList.contains("hide-sidebar")) {
        article.classList.add("hide-sidebar");
      }

      if (lastWasSmall !== true) {
        // انتقال المان‌ها به حالت موبایل
        moveArticleTools(article, false);

        // init toggle برای tools
        setupToggle({
          btnSelector: "#toggle-tools-box",
          listSelector: ".es-article-tools",
          wrapperSelector: ".esprit-article-tools__actions",
          bodyFlagName: "toolsBound",
        });

        // init toggle برای share
        setupToggle({
          btnSelector: "#toggle-share-box",
          listSelector: ".es-article-share",
          wrapperSelector: ".esprit-article-tools__share",
          bodyFlagName: "shareBound",
        });
      }
    } else {
      // وقتی بزرگ شد: اگر قبلاً کوچک بوده، ریست کنیم
      if (article.classList.contains("hide-sidebar")) {
        article.classList.remove("hide-sidebar");
      }

      if (lastWasSmall === true) {
        // ریست انتقال‌ها
        moveArticleTools(article, true);

        // اگر ابزارها باز بودند، ببندیمشان
        const tools = document.querySelector(".es-article-tools");
        if (tools) {
          tools.classList.remove("active");
          tools.style.overflow = "hidden";
        }
        const share = document.querySelector(".es-article-share");
        if (share) {
          share.classList.remove("active");
          share.style.overflow = "hidden";
        }
        // (دقت: event listenerها حذف نمی‌شوند؛ ولی چون المان‌ها به جای اصلی برگشتند، رفتار طبیعی ادامه پیدا می‌کند.
        //  اگر خواستی می‌تونیم لیسنرها رو کامل پاک کنیم، اما برای سادگی اینجا فقط وضعیت بسته می‌شود.)
      }
    }

    lastWasSmall = isSmall;
  }

  // debounce ساده با requestAnimationFrame برای resize
  let rafId = null;
  function debouncedCheck() {
    if (rafId) cancelAnimationFrame(rafId);
    rafId = requestAnimationFrame(() => {
      checkWidth();
      rafId = null;
    });
  }

  window.addEventListener("DOMContentLoaded", checkWidth);
  window.addEventListener("resize", debouncedCheck);

  // اجرای اولیه اگر setLayout بعد از DOMLoaded صدا زده شود
  if (
    document.readyState === "complete" ||
    document.readyState === "interactive"
  ) {
    checkWidth();
  }
}
