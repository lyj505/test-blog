import { json } from "@remix-run/node";
import { useLoaderData, Link } from "@remix-run/react";

import { getPosts } from "~/models/post.server";

type LoaderData = {
  //   posts: Array<Post>;
  posts: Awaited<ReturnType<typeof getPosts>>;
};

export const loader = async (request: any) => {
  return json<LoaderData>({
    posts: await getPosts(),
  });
};

export default function Posts() {
  const { posts } = useLoaderData() as LoaderData;
  console.log("posts", posts);

  return (
    <main>
      <Link to="admin" className="text-red-600 underline">
        Admin
      </Link>
      <h1>Posts</h1>
      <ul>
        {posts.map((post) => (
          <li key={post.slug}>
            <Link to={post.slug} className="text-blue-600 underline">
              {post.title}
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
