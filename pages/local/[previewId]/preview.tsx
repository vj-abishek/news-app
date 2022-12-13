/* eslint-disable @next/next/no-img-element */
import Back from "@components/Back";
import { DropDown } from "@components/header";
import RenderImage from "@components/RenderImage";
import { unstable_getServerSession } from "next-auth";
import { useSession } from "next-auth/react";
import Head from "next/head";
import { useRouter } from "next/router";
import { authOptions } from "pages/api/auth/[...nextauth]";
import { useState } from "react";
import prisma from "../../../lib/prismadb";

export default function Preview({ data }: any) {
  const router = useRouter();
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);

  const deleteNews = async () => {
    setLoading(true);

    const prompt = window.confirm("Are you sure?");
    if (prompt === true) {
      try {
        const response = await fetch("/api/local/delete", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ postId: data.id }),
        });

        router.push("/local/view");
      } catch (err) {
        setLoading(false);
        console.log(err);
      }
    }

    setLoading(false);
  };

  return data?.title ? (
    <div className="w-full h-screen overflow-auto">
      <div className="container mx-auto">
        <Head>
          <title>Preview / {data.title}</title>
        </Head>
        <h1 className="sm:mt-3 p-2 flex items-center">
          <Back />
          <span className="font-bold text-2xl text-gray-200">Preview</span>
          <DropDown />
        </h1>
        <div className="mt-3 text-gray-200">
          <div className=" max-w-2xl">
            <RenderImage
              src={data.image}
              alt={data.tite}
              activeIndex={0}
              index={0}
            />
            <p className="p-2">{data.title}</p>
            <p className="p-2">{data.content}</p>

            {data.authorId === session?.user.id && (
              <>
                <p className="p-2 text-red-500">
                  {data.published ? (
                    <span className="text-green-400">
                      🎉 your news has been published
                    </span>
                  ) : (
                    <span className="text-red-400">
                      <span>⚠️</span>
                      <span> your news is not published</span>
                    </span>
                  )}
                </p>
                <p className="p-2" onClick={deleteNews}>
                  <button
                    className={`btn btn-error ${loading ? "loading" : ""}`}
                  >
                    Delete
                  </button>
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  ) : (
    <p className="text-gray-200">Preview not found</p>
  );
}

export async function getServerSideProps(context: any) {
  const { previewId } = context.params;
  const { req, res } = context;

  res.setHeader(
    "Cache-Control",
    "public, s-maxage=10, stale-while-revalidate=59"
  );

  try {
    const data = await prisma.post.findFirst({
      where: {
        id: previewId,
      },
    });

    if (!data) {
      return {
        notFound: true,
      };
    }

    return {
      props: {
        data: JSON.parse(JSON.stringify(data)),
      },
    };
  } catch (err) {
    return {
      notFound: true,
    };
  }
}
