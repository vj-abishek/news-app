/* eslint-disable react/display-name */
/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useRef, useState } from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";

const YTVideoPlayer = React.memo(({ src }: any) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (iframeRef.current) {
      const observer = new IntersectionObserver(
        (entries) => {
          const entry = entries[0];
          if (entry.isIntersecting && iframeRef.current) {
            iframeRef.current.src = src;
            observer.disconnect();
          }
        },
        { rootMargin: "50%" }
      );
      observer.observe(iframeRef?.current);
    }
  }, [src]);

  return (
    <iframe
      className="w-full aspect-video"
      frameBorder="0"
      allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
      ref={iframeRef}
    />
  );
});

function RenderImage({ src, alt }: any) {
  const [isImage, setIsImage] = useState(false);
  const [video_id, setVideoId] = useState("");

  useEffect(() => {
    const imageRegex = /(.+\.jpg)|(.+\.png)|(.+\.webp)/;
    const isImageLink = imageRegex.test(src);
    if (isImageLink) {
      setIsImage(true);
    } else {
      const videoRegex =
        /^(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;
      const isVideoLink = videoRegex.test(src);
      if (isVideoLink) {
        const videoId = src.match(videoRegex)[1];
        setVideoId(videoId);
      }
    }
  }, []);

  if (isImage) {
    return (
      <LazyLoadImage
        src={src}
        alt={alt}
        className="w-full bg-slate-600 aspect-video"
      />
    );
  }

  if (video_id) {
    return <YTVideoPlayer src={`https://www.youtube.com/embed/${video_id}`} />;
  }

  return null;
}

const MemoizedRenderImage = React.memo(RenderImage);
export default MemoizedRenderImage;
