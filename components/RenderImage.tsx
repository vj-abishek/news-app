/* eslint-disable @next/next/no-img-element */
import React, { useCallback, useEffect, useRef, useState } from "react";
import Plyr from "plyr";
import "plyr/dist/plyr.css";

export default function RenderImage({ src, alt, activeIndex, index }: any) {
  const [isImage, setIsImage] = useState(false);
  const [video_id, setVideoId] = useState("");
  const [isRendered, setIsRendered] = useState(false);
  const videoRef = useRef<HTMLDivElement>(null);
  const [playerRef, setPlayerRef] = useState<any>(null);

  useEffect(() => {
    if (activeIndex === index) {
      const youtubeRegex =
        /(http(s)?:\/\/)?(www\.)?(m\.)?youtu(be|\.be)?(\.com)?\/[a-zA-Z0-9]+/;

      if (youtubeRegex.test(src)) {
        const pattern =
          /^(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;
        const match = pattern.exec(src);
        const videoID = match?.length && match[1];
        setVideoId(videoID || "");

        // const videos = ["itvS62kWALA", "eqBrHvdGbOY", "zuVV9Y55gvc"];

        // const random = Math.floor(Math.random() * 2);
        // setVideoId(videos[random]);

        setIsImage(false);
      } else {
        setIsImage(true);
      }
    }
  }, [src, activeIndex, index]);

  useEffect(() => {
    if (video_id && videoRef.current && !isRendered) {
      const player = new Plyr(videoRef.current, {});
      setPlayerRef(player);
      player.on("ready", () => {
        player.play();
      });
      setIsRendered(true);
    }
  }, [video_id, videoRef, isRendered]);

  const togglePlayer = () => {
    if (activeIndex === index && document.hasFocus()) {
      playerRef?.play();
    } else if (playerRef?.playing) {
      playerRef?.pause();
    }
  };

  useEffect(() => {
    togglePlayer();
  });

  return isImage ? (
    <img src={src} alt={alt} loading="lazy" className="w-full aspect-video" />
  ) : (
    <div
      ref={videoRef}
      data-plyr-provider="youtube"
      data-plyr-embed-id={video_id}
      className="w-full aspect-video"
    ></div>
  );
}
