/* eslint-disable @next/next/no-img-element */
import Back from "@components/Back";
import { DefaultSession, unstable_getServerSession } from "next-auth";
import Head from "next/head";
import { useRouter } from "next/router";
import { authOptions } from "pages/api/auth/[...nextauth]";
import { useState } from "react";
import prisma from "../../../lib/prismadb";

export const approve = async (postId: string | string[] | undefined) => {
  const body = {
    postId,
  };
  try {
    const reponse = await fetch("/api/local/approve", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const json = await reponse.json();
    return json;
  } catch (err) {
    console.log(err);
  }
};

export default function Preview({ data }: any) {
  const router = useRouter();
  const { previewId } = router.query;

  const [loading, setLoading] = useState(false);

  const handleClick = () => {
    setLoading(true);
    approve(previewId)
      .then(() => {
        setLoading(false);
        router.back();
      })
      .catch(() => {
        setLoading(false);
      });
  };

  return data?.title ? (
    <div className="w-full h-screen overflow-auto">
      <div className="container mx-auto text-gray-200">
        <Head>
          <title>Preview / {data.title}</title>
        </Head>
        <h1 className="sm:  mt-3 p-2 font-bold text-2xl  flex items-center">
          <Back />
          <span>Preview</span>
        </h1>
        <div className="mt-8">
          <div className=" max-w-2xl">
            <img
              className="aspect-video rounded-md"
              src={data.image}
              alt={data.title}
            />
            <p className="p-2">{data.title}</p>
            <p className="p-2">{data.content}</p>

            <p className="p-2 text-red-500">
              <button
                className="btn btn-info btn-sm mr-3"
                onClick={() => router.back()}
              >
                Back
              </button>
              {!data.published && (
                <button
                  className={`btn btn-success btn-sm ${
                    loading ? "loading" : ""
                  }`}
                  onClick={handleClick}
                  disabled={loading}
                >
                  Approve
                </button>
              )}
            </p>
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

  const session = await unstable_getServerSession(req, res, authOptions);

  if (!session) {
    return {
      redirect: {
        permanent: false,
        destination: "/api/auth/signin",
      },
    };
  }

  if (session?.user?.role !== "ADMIN") {
    return {
      notFound: true,
    };
  }

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
