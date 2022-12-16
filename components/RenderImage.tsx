/* eslint-disable react/display-name */
/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useRef, useState } from "react";

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

const LazyLoadImage = React.memo(({ src, alt }: any) => {
  const imageRef = useRef<HTMLImageElement>(null);
  const [isRendered, setIsRendered] = useState(false);

  useEffect(() => {
    if (imageRef.current && !isRendered) {
      const observer = new IntersectionObserver(
        (entries) => {
          const entry = entries[0];
          if (entry.isIntersecting && imageRef.current) {
            imageRef.current.src = src;
            setIsRendered(true);
            observer.disconnect();
          }
        },
        { rootMargin: "50%" }
      );
      observer.observe(imageRef.current);
    }
  }, [src, isRendered]);

  return <img ref={imageRef} alt={alt} className="w-full aspect-video" />;
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
    return <LazyLoadImage src={src} alt={alt} />;
  }

  if (video_id) {
    return <YTVideoPlayer src={`https://www.youtube.com/embed/${video_id}`} />;
  }

  return null;
}

const MemoizedRenderImage = React.memo(RenderImage);
export default MemoizedRenderImage;
