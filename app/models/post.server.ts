import { prisma } from "~/db.server";

type Post = {
  slug: string;
  title: string;
};

export async function getPosts(): Promise<Array<Post>> {
  return prisma.post.findMany();
  //   return [
  //     {
  //       slug: "my-first-post",
  //       title: "My First Post",
  //     },
  //     {
  //       slug: "90s-mixtape",
  //       title: "A Mixtape I Made Just For You",
  //     },
  //   ];
}

export async function getPost(slug: string) {
  return prisma.post.findUnique({
    where: {
      slug,
    },
  });
}
