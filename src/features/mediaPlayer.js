import Plyr from "plyr";
import "plyr/dist/plyr.css";

export function initVideoPlayer(
  videoSelector = "#main-video",
  listSelector = ".video-list__item",
  videoList = ".video-list__scroll"
) {
  const videoElement = document.querySelector(videoSelector);
  if (!videoElement) return;

  const player = new Plyr(videoElement);

  const videoItems = document.querySelectorAll(listSelector);
  videoItems.forEach((item) => {
    item.addEventListener("click", () => {
      videoItems.forEach((v) => v.classList.remove("active"));
      item.classList.add("active");

      const videoSrc = item.getAttribute("data-video-src");
      if (videoSrc) {
        player.source = {
          type: "video",
          sources: [
            {
              src: videoSrc,
              type: "video/mp4",
            },
          ],
        };
        player.play();
      }
    });
  });

  //scrollable list
  const tabList = document.querySelector(videoList);
  const tabs = document.querySelectorAll(listSelector);

  if (tabList && tabs.length > 0) {
    let isDragging = false;
    let startX;
    let scrollLeft;
    let autoScrollInterval;

    tabList.style.cursor = "grab";

    // اسکرول با چرخ ماوس
    tabList.addEventListener("wheel", function (event) {
      event.preventDefault();
      tabList.scrollLeft += event.deltaY * 2;
    });

    // Scroll with mouse wheel
    tabList.addEventListener("mousedown", function (event) {
      isDragging = true;
      tabList.style.cursor = "grabbing";
      startX = event.pageX - tabList.offsetLeft;
      scrollLeft = tabList.scrollLeft;
    });

    tabList.addEventListener("mouseleave", function () {
      isDragging = false;
      tabList.style.cursor = "grab";
      clearInterval(autoScrollInterval);
    });

    tabList.addEventListener("mouseup", function () {
      isDragging = false;
      tabList.style.cursor = "grab";
    });

    tabList.addEventListener("mousemove", function (event) {
      if (!isDragging) return;
      event.preventDefault();
      const x = event.pageX - tabList.offsetLeft;
      const walk = (x - startX) * 2;
      tabList.scrollLeft = scrollLeft - walk;
    });

    // Move selected tab to center of page when clicked
    tabs.forEach((tab) => {
      tab.addEventListener("click", function () {
        const tabRect = tab.getBoundingClientRect();
        const listRect = tabList.getBoundingClientRect();

        // Calculating the scroll amount so that the tab is exactly centered
        const scrollAmount =
          tabList.scrollLeft +
          (tabRect.left - listRect.left) -
          (listRect.width / 2 - tabRect.width / 2); // Adjust to center.

        tabList.scrollTo({
          left: scrollAmount,
          behavior: "smooth",
        });
      });
    });

    // Auto-scroll when the mouse approaches the edges of the list tab
    tabList.addEventListener("mousemove", function (event) {
      const rect = tabList.getBoundingClientRect();
      const mouseX = event.clientX - rect.left;

      const scrollSpeed = 3;
      const threshold = 110;

      clearInterval(autoScrollInterval);

      if (mouseX < threshold) {
        autoScrollInterval = setInterval(() => {
          tabList.scrollLeft -= scrollSpeed;
        }, 10);
      } else if (mouseX > rect.width - threshold) {
        autoScrollInterval = setInterval(() => {
          tabList.scrollLeft += scrollSpeed;
        }, 10);
      }
    });

    // Improved scrolling effect when mouse enters tab list
    tabList.addEventListener("mouseenter", function () {
      tabList.scrollBy({ left: 30, behavior: "smooth" });

      setTimeout(() => {
        tabList.scrollBy({ left: -30, behavior: "smooth" });
      }, 400); // We increased the animation time a bit to make it smoother.
    });
  }
}

export function initAudioPlayer(
  audioSelector = "#main-audio",
  listSelector = ".sound-list__item"
) {
  const audioElement = document.querySelector(audioSelector);
  if (!audioElement) return;

  const player = new Plyr(audioElement);

  const audioItems = document.querySelectorAll(listSelector);
  audioItems.forEach((item) => {
    item.addEventListener("click", () => {
      audioItems.forEach((v) => v.classList.remove("active"));
      item.classList.add("active");
      const audioSrc = item.getAttribute("data-audio-src");
      if (audioSrc) {
        player.source = {
          type: "audio",
          sources: [
            {
              src: audioSrc,
              type: "audio/mp3",
            },
          ],
        };
        player.play();
      }
    });
  });
}

export function initTts(audioSelector = "#tts-audio") {
  const audioElement = document.querySelector(audioSelector);
  if (!audioElement) return;

  const player = new Plyr(audioElement);
}