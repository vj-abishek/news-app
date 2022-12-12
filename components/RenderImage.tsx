/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useState } from "react";
import Plyr from "plyr";
import "plyr/dist/plyr.css";

export default function RenderImage({ src, alt }: any) {
  const [isImage, setIsImage] = useState(false);
  const [video_id, setVideoId] = useState("");
  const videoRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    const youtubeRegex =
      /(http(s)?:\/\/)?(www\.)?(m\.)?youtu(be|\.be)?(\.com)?\/[a-zA-Z0-9]+/;

    if (!youtubeRegex.test(src)) {
      const pattern =
        /^(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;
      const match = pattern.exec(src);
      const videoID = match?.length && match[1];
      setVideoId(videoID || "");

      setIsImage(false);
    } else {
      setIsImage(true);
    }
  }, [src]);

  useEffect(() => {
    if (videoRef.current) {
      console.log(videoRef.current);
      const player = new Plyr(videoRef.current, {});
    }
  }, [videoRef]);

  return isImage ? (
    <img src={src} alt={alt} loading="lazy" className="w-full aspect-video" />
  ) : (
    <div
      id="player"
      ref={videoRef}
      data-plyr-provider="youtube"
      data-plyr-embed-id="itvS62kWALA"
    ></div>
  );
}
