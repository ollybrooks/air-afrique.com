import { getArticles } from "@/sanity/utils";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const articles = await getArticles(req.query.locale as string);
    res.status(200).json({ count: articles.length });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch article count' });
  }
}