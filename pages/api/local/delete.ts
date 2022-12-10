import type { NextApiRequest, NextApiResponse } from "next";
import { unstable_getServerSession } from "next-auth";
import prisma from "../../../lib/prismadb";
import { authOptions } from "../auth/[...nextauth]";

type Data = {
  message: string;
  response?: any;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const { postId } = req.body;

  if (!postId) {
    return res.status(400).json({ message: "Invalid data" });
  }

  try {
    const session = await unstable_getServerSession(req, res, authOptions);

    if (!session) {
      return res.status(401).json({ message: "unauthorized" });
    }

    await prisma.post.delete({
      where: {
        id: postId,
      },
    });

    return res.status(200).json({ message: "Deleted!!" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal server error" });
  }
}
