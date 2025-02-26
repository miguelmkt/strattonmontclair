import type { NextApiRequest, NextApiResponse } from "next"
import clientPromise from "@/lib/mongodb"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" })
  }

  const { q } = req.query

  if (!q) {
    return res.status(400).json({ message: "Missing search query" })
  }

  try {
    const client = await clientPromise
    const db = client.db()

    const products = await db
      .collection("products")
      .find({ $text: { $search: q as string } })
      .toArray()

    res.status(200).json(products)
  } catch (error) {
    console.error("Error searching products:", error)
    res.status(500).json({ message: "Error searching products" })
  }
}

