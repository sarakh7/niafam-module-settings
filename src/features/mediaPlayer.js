import Plyr from "plyr";
import "plyr/dist/plyr.css";

export function initVideoPlayer(
  videoSelector = "#main-video",
  listSelector = ".video-list__item"
) {
  const videoElement = document.querySelector(videoSelector);
  if (!videoElement) return;

  const player = new Plyr(videoElement);

  const videoItems = document.querySelectorAll(listSelector);
  videoItems.forEach((item) => {
    item.addEventListener("click", () => {
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
