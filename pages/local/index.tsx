import Header from "@components/header";
import News from "@components/news";
import { isMobile } from "react-device-detect";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/bundle";

import "swiper/css";

import { useEffect, useState } from "react";
import BottomNav from "@components/bottomNav";
import Select from "@components/Select";
import DialogComponent from "@components/Dialog";
import Head from "next/head";
import prisma from "../../lib/prismadb";

export default function IndexPage({ data }: any) {
  const [space, setSpace] = useState(0);
  const [swiperRef, setSwiperRef] = useState();
  const [currentData, setCurrentData] = useState<any>([]);

  useEffect(() => {
    const parsed = data.map((item: any) => {
      return {
        id: item.id,
        title: item.title,
        sourceProvidedContentUrl: null,
        thumbnailInfos: item.image,
        content: item.content,
        timesAgo: item.createdAt,
        source: {
          badgeType: "NOT_VERIFIED",
          displayName: item.author.name,
        },
      };
    });
    setCurrentData(parsed);
  }, [data]);

  useEffect(() => {
    if (!isMobile && typeof window !== "undefined") {
      setSpace(-80);
    }
  }, []);

  return data ? (
    <>
      <Header />

      <Head>
        <title>News App - content at your finger tips</title>
        <meta
          name="description"
          content="Check what's happening around, anytime anywhere. No spammy content. "
        />
      </Head>

      <Select />
      <Swiper
        // @ts-ignore
        onSwiper={setSwiperRef}
        spaceBetween={space}
        direction={"vertical"}
        mousewheel={true}
        className="mySwiper"
      >
        {currentData?.length &&
          currentData.map((item: any, i: number) => {
            return (
              <SwiperSlide key={item.id}>
                <News data={item} isLocal={true} />
              </SwiperSlide>
            );
          })}
      </Swiper>

      <BottomNav swiperRef={swiperRef} />

      <DialogComponent />
    </>
  ) : (
    <div>Loading...</div>
  );
}

export async function getServerSideProps({ req, res, query }: any) {
  res.setHeader(
    "Cache-Control",
    "public, s-maxage=10, stale-while-revalidate=59"
  );

  try {
    const data = await prisma?.post.findMany({
      where: {
        published: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        author: true,
      },
    });

    return {
      props: {
        data: JSON.parse(JSON.stringify(data)),
      },
    };
  } catch (err) {
    console.log(err);
  }

  return {
    props: {
      data: [],
    },
  };
}
