import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prismadb";

type Data = {
  message: string;
  response?: any;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const { title, content, image, authorId } = req.body;

  if (!title || !content || !image || !authorId) {
    return res.status(400).json({ message: "Invalid data" });
  }

  try {
    const response = await prisma.post.create({
      data: req.body,
    });
    return res.status(200).json({ message: "Post created", response });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal server error" });
  }
}
