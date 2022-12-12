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
  const [urlError, setUrlError] = useState(false);
  const [newsLink, setNewsLink] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!session || !urlError) {
      setLoading(false);
      return;
    }

    const form = e.target as any;
    const title = form[0].value;
    const image = form[1].value;
    const content = form[2].value;
    const category = form[3].value;

    const obj = {
      title,
      image,
      content,
      authorId: session?.user?.id,
      category,
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

  const handleUrl = (e: any) => {
    const link = e.target.value;

    const youtubeRegex =
      /(http(s)?:\/\/)?(www\.)?(m\.)?youtu(be|\.be)?(\.com)?\/[a-zA-Z0-9]+/;

    const imageRegex = /(.+\.jpg)|(.+\.png)/;

    const isYoutubeLink = youtubeRegex.test(link);
    const isImageLink = imageRegex.test(link);

    if (isYoutubeLink) {
      const pattern =
        /^(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;
      const match = pattern.exec(link);
      const video_id = match?.length && match[1];
      setNewsLink(`https://www.youtube.com/embed/${video_id}`);
    }
    if (isYoutubeLink || isImageLink) {
      setUrlError(false);
    } else {
      setUrlError(true);
    }
  };

  const setLink = (e: any) => {
    setNewsLink(e.target.value);
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
            onChange={setLink}
            value={newsLink}
            onBlur={handleUrl}
            placeholder="Enter the url"
            className={`input input-bordered w-full max-w-2xl text-black dark:text-gray-200" ${
              urlError ? "input-error" : ""
            }`}
            required
          />
          {urlError && (
            <p className="text-red-400">
              Enter a valid image url or youtube video url.{" "}
            </p>
          )}
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

        <div className="form-control w-full max-w-2xl mt-5 text-gray-600  dark:text-gray-200">
          <label className="label">
            <span className="label-text text-gray-200">
              Select news category
            </span>
          </label>
          <select className="select select-bordered w-full max-w-xs" required>
            <option>FOR_YOU</option>
            <option>BUSINESS</option>
            <option>ENTERTAINMENT</option>
            <option>TECHNOLOGY</option>
            <option>POLITICS</option>
            <option>MOVIES</option>
            <option>INDIA</option>
          </select>
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
