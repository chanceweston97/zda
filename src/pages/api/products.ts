import type { NextApiRequest, NextApiResponse } from "next";
import { getProductsByFilter } from "@/sanity/sanity-shop-utils";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { limit } = req.query;
  let query = '*[_type == "product"]';
  if (limit) {
    query = `*[_type == "product"][0...${limit}]`;
  }
  try {
    const products = await getProductsByFilter(query, ["product"]);
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch products" });
  }
} 
