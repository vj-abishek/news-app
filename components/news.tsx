/* eslint-disable @next/next/no-img-element */
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  CheckBadgeIcon,
  MagnifyingGlassCircleIcon,
  QuestionMarkCircleIcon,
  SpeakerWaveIcon,
} from "@heroicons/react/24/solid";
import { format } from "timeago.js";
import Toast from "@components/toast";

import { ArrowTopRightOnSquareIcon, SpeakerWaveIcon as SpeakerWaveOutline } from "@heroicons/react/24/outline";
import Link from "next/link";
import RenderImage from "./RenderImage";
import { LazyLoadImage } from "react-lazy-load-image-component";

function cloneImage(
  image: HTMLImageElement | null,
  imageConatiner: HTMLDivElement | null
) {
  if (image) {
    const clonedImage = image.cloneNode(true) as HTMLImageElement;
    imageConatiner?.appendChild(clonedImage);
  }
}

function News({ data, isLocal, activeIndex, index }: any) {
  const imageConatiner = useRef<HTMLDivElement>(null);
  const [showToast, setShowToast] = useState(false);
  const [isTTSSpeaking, setTTSSpeaking] = useState(false);

  const parseImage = useCallback((thumb: string) => {
    let width = 600;
    let height = 400;
    try {
      if (typeof thumb === "string") {
        const imageRegex = /(.+\.jpg)|(.+\.png)/;
        const isImageLink = imageRegex.test(thumb);

        if (isImageLink) {
          const encodedURL = encodeURIComponent(thumb);
          return `https://wsrv.nl/?url=${encodedURL}&w=320&h=180`;
        }

        return thumb;
      }

      const tb = thumb[0] as any;
      if (tb && tb.width) {
        width = tb?.width;
        height = tb?.height;
      }

      let url = tb?.url?.replace(
        "#DH_EMB_IMG_REP#__DHQ_",
        `${width}x${height}__90`
      );
      return url;
    } catch (err) {
      console.log(err);
    }
  }, []);

  const toggleSpeech = () => {
    const ttsText = `${data?.title} 
      ${data?.content}
    `;

    if ('speechSynthesis' in window) {
      if (speechSynthesis.speaking) {
        speechSynthesis.cancel();
        setTTSSpeaking(false);
      } else {
        let utterance = new SpeechSynthesisUtterance(ttsText);
        speechSynthesis.speak(utterance);
        setTTSSpeaking(true);
      }
    } else {
      console.error('Text-to-speech is not supported in this browser.');
    }
  };
  
  return (
    <>
      {showToast && <Toast msg="Something went wrong. " />}

      <div className="w-screen mobile-height sm:w-[350px] sm:h-[650px] shadow-xl rounded-2xl overflow-hidden">
        <div
          ref={imageConatiner}
          className="w-full h-full flex justify-center items-center relative"
        >
          <div className="absolute w-full h-full bg-gradient-to-b from-slate-700 to-gradient-bg"></div>
          <LazyLoadImage
            src={parseImage(data?.thumbnailInfos)}
            alt={data.title}
            className="w-full h-full object-cover blur-2xl brightness-50 absolute top-0 left-0 opacity-60"
          />
          <div className="relative text-slate-300 z-10 w-full">
            <h1 className="text-xl p-3 text-slate-100 ">
              <span className="line-clamp-3">{data?.title}</span>
            </h1>

            <RenderImage
              src={parseImage(data?.thumbnailInfos)}
              alt={data?.title}
              activeIndex={activeIndex}
              index={index}
            />

            <Link
              href={
                isLocal
                  ? `/local/${data.id}/preview`
                  : data.sourceProvidedContentUrl
              }
            >
              {/* News Content */}
              <p className="p-3">
                <span className="line-clamp-5 text-base inline pr-1">
                  {data?.content}
                </span>
              </p>
            </Link>

            {/* Author */}
            <div className="text-slate-500 px-3 pb-5 text-xs">
              <span>{data?.source?.displayName + " "}</span>
              {data?.source?.badgeType === "VERIFIED" ? (
                <span>
                  <CheckBadgeIcon className="w-4 h-4 inline-block" />{" "}
                </span>
              ) : (
                <span>{" • "}</span>
              )}

              <span>{format(new Date(data.timesAgo))}</span>
              {!data.sourceProvidedContentUrl ? (
                <span className="tooltip" data-tip="News from local expert">
                  <QuestionMarkCircleIcon className="w-4 h-4 inline-block ml-2 " />
                </span>
              ) : (
                <a
                  href={data?.sourceProvidedContentUrl || "#"}
                  rel="noreferrer"
                  target="_blank"
                >
                  <ArrowTopRightOnSquareIcon className="w-4 h-4 inline-block ml-2" />
                </a>
              )}

              {!isLocal && (
                <>
                  <Link
                    href={`/local/?topic=${window.location.search === ""
                        ? "For+You"
                        : new URLSearchParams(window.location.search).get("topic")
                      }`}
                    className="tooltip"
                    data-tip="Look from local experts"
                  >
                    <MagnifyingGlassCircleIcon className="w-5 h-5 ml-4 inline-block" />
                  </Link>
                  {window.location.search.includes('english') && (
                    isTTSSpeaking ? (
                      <SpeakerWaveIcon onClick={toggleSpeech} className="w-5 h-5 ml-4 inline-block cursor-pointer" />

                    ) : (
                      <SpeakerWaveOutline onClick={toggleSpeech} className="w-5 h-5 ml-4 inline-block cursor-pointer" />
                    )
                  )}

                </>

              )}
              {/* {router.pathname === "/bookmarks" || bookmarked ? (
              <BookmarkIcon className="w-5 h-5 ml-4 inline-block" />
            ) : (
              <a href={`${session ? "#" : "#login"}`}>
                <BookmarkOutlineIcon
                  onClick={handleBookmark}
                  className="cursor-pointer w-5 h-5 ml-4 inline-block"
                />
              </a>
            )} */}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

const MemoizedNews = React.memo(News);
export default MemoizedNews;
