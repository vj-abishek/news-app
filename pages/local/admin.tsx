import { unstable_getServerSession } from "next-auth";
import Head from "next/head";
import Link from "next/link";
import { authOptions } from "pages/api/auth/[...nextauth]";
import { useState } from "react";
import prisma from "../../lib/prismadb";
import { approve } from "./[previewId]/edit";

const Button = (props: any) => {
  const { post } = props;

  const [loading, setLoading] = useState(false);
  const [disabled, setDisabled] = useState(false);

  const handleClick = () => {
    setLoading(true);
    approve(post.id)
      .then(() => {
        setLoading(false);
        setDisabled(true);
      })
      .catch(() => {
        setLoading(false);
      });
  };

  return (
    <button
      className={`btn btn-success btn-sm ${loading ? "loading" : ""}`}
      disabled={disabled}
      onClick={handleClick}
    >
      Approve
    </button>
  );
};

export default function Admin({ data }: any) {
  return (
    <div className="container mx-auto">
      <Head>
        <title>News app / Admin</title>
      </Head>

      <h1 className="sm:mt-3 p-2 font-bold text-2xl text-gray-200 flex w-full items-center justify-between">
        <div>Approve these news</div>
        <Link className="btn btn-sm btn-info" href={"/local"}>
          Community news
        </Link>
      </h1>

      <main className="mt-8 overflow-x-auto">
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
            {data.map((post: any, i: number) => (
              <tr key={post.id}>
                <th>
                  <Button post={post} />
                  <Link
                    href={`/local/${post.id}/edit`}
                    role="button"
                    className="btn btn-info btn-sm ml-3"
                  >
                    View
                  </Link>
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

          {data.length > 20 && (
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
      </main>
    </div>
  );
}

export async function getServerSideProps(context: any) {
  const { req, res } = context;

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

  const response = await prisma.post.findMany({
    where: {
      published: false,
    },
  });

  return {
    props: {
      data: JSON.parse(JSON.stringify(response)),
    },
  };
}
