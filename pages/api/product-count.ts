import client from "@/shopify/client";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const products = await client.product.fetchAll();
    res.status(200).json({ count: products.length });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch product count' });
  }
}