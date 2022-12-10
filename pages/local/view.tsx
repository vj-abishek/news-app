import Back from "@components/Back";
import { DropDown } from "@components/header";
import { unstable_getServerSession } from "next-auth";
import Head from "next/head";
import Link from "next/link";
import { authOptions } from "pages/api/auth/[...nextauth]";
import prisma from "../../lib/prismadb";

export default function View({ posts }: any) {
  return (
    <div className="w-full h-screen overflow-auto">
      <div className="container mx-auto p-2">
        <Head>
          <title>Your contributions / {posts.length}</title>
        </Head>
        <h1 className=" sm:mt-3 p-2  flex items-center">
          <Back />
          <span className="text-gray-200 font-bold text-2xl ">
            {" "}
            Your contributions
          </span>
          <DropDown />
        </h1>

        <main className="mt-8 overflow-x-auto">
          {posts.length ? (
            <table className="table table-compact w-full ">
              <thead>
                <tr>
                  <th></th>
                  <th>Title</th>
                  <th>Content</th>
                  <th>Image</th>
                  <th>Published</th>
                  <th>createdAt</th>
                  <th>updatedAt</th>
                </tr>
              </thead>
              <tbody>
                {posts.map((post: any, i: number) => (
                  <tr key={post.id}>
                    <th>
                      <Link href={`${post.id}/preview`}>{i + 1}</Link>
                    </th>
                    <td className="max-w-sm text-ellipsis overflow-hidden">
                      {post.title}
                    </td>
                    <td className="max-w-sm text-ellipsis overflow-hidden">
                      {post.content}
                    </td>
                    <td className="max-w-sm text-ellipsis overflow-hidden">
                      {post.image}
                    </td>
                    <td className="max-w-sm text-ellipsis overflow-hidden">{`${post.published}`}</td>
                    <td className="max-w-sm text-ellipsis overflow-hidden">
                      {post.createdAt}
                    </td>
                    <td className="max-w-sm text-ellipsis overflow-hidden">
                      {post.updatedAt}
                    </td>
                  </tr>
                ))}
              </tbody>

              {posts.length > 20 && (
                <tfoot>
                  <tr>
                    <th></th>
                    <th>Title</th>
                    <th>Content</th>
                    <th>Image</th>
                    <th>Published</th>
                    <th>createdAt</th>
                    <th>updatedAt</th>
                  </tr>
                </tfoot>
              )}
            </table>
          ) : (
            <p className="text-gray-200">No news found!</p>
          )}
        </main>
      </div>
    </div>
  );
}

export async function getServerSideProps(context: any) {
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

  try {
    const posts = await prisma.post.findMany({
      where: {
        authorId: session?.user?.id,
      },
    });

    return {
      props: {
        posts: JSON.parse(JSON.stringify(posts)),
      },
    };
  } catch (err) {
    console.log(err);
  }

  return {
    props: {},
  };
}
