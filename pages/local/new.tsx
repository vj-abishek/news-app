import Back from "@components/Back";
import { unstable_getServerSession } from "next-auth";
import { useSession } from "next-auth/react";
import Head from "next/head";
import { useRouter } from "next/router";
import { FormEvent, useState } from "react";
import { authOptions } from "../api/auth/[...nextauth]";

export default function Create() {
  const { data: session } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!session) return;

    const form = e.target as any;
    const title = form[0].value;
    const image = form[1].value;
    const content = form[2].value;

    const obj = {
      title,
      image,
      content,
      authorId: session?.user?.id,
    };

    fetch("/api/local/edit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(obj),
    })
      .then((json) => {
        return json.json();
      })
      .then((data) => {
        router.push(`/local/${data.response.id}/preview`);
      })
      .catch((err) => {
        setLoading(false);
        console.error(err);
      });
  };

  return (
    <div className="container mx-auto text-gray-200 p-3">
      <h1 className="sm:mt-3 flex items-center font-bold text-2xl">
        <Back />
        <span>Create Community news</span>
      </h1>

      <Head>
        <title>Create Community news</title>
      </Head>
      <form className="mt-3" onSubmit={handleSubmit}>
        <div className="form-control w-full max-w-2xl">
          <label className="label">
            <span className="label-text text-gray-200">
              Enter the title for the news
            </span>
          </label>
          <input
            type="text"
            placeholder="Enter the title"
            className="input input-bordered w-full max-w-2xl text-black dark:text-gray-200"
            required
          />
        </div>

        <div className="form-control w-full max-w-2xl mt-5">
          <label className="label">
            <span className="label-text text-gray-200">
              Enter the photo for the news
            </span>
          </label>
          <input
            type="url"
            placeholder="Enter the url"
            className="input input-bordered w-full max-w-2xl text-black dark:text-gray-200"
            required
          />
        </div>

        <div className="form-control w-full max-w-2xl mt-5">
          <label className="label">
            <span className="label-text text-gray-200">
              Briefly describe the news
            </span>
          </label>
          <textarea
            className="textarea textarea-bordered h-24 text-black dark:text-gray-200"
            placeholder="Type here..."
            required
          ></textarea>
        </div>

        <button
          type="submit"
          className={`btn btn-primary mt-5 ${loading ? "loading" : ""}`}
        >
          Create
        </button>
      </form>
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

  return {
    props: {},
  };
}
