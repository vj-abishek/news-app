import { JSDOM } from "jsdom";
import { NextApiRequest, NextApiResponse } from "next";

export default async function getHeadlines(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const data = await fetch(process.env.BASE_URL || "");
  const html = await data.text();
  const dom = new JSDOM(html, { runScripts: "dangerously" });
  const response = dom.window.__STATE.topicsList || {};
  res.status(200).json(response);
}
