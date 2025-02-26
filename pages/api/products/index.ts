import type { NextApiRequest, NextApiResponse } from "next"
import clientPromise from "@/lib/mongodb"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const client = await clientPromise
  const db = client.db()

  if (req.method === "GET") {
    const { featured, category } = req.query
    try {
      const query: any = {}
      if (featured === "true") {
        query.featured = true
      }
      if (category) {
        query.category = category
      }
      const products = await db.collection("products").find(query).toArray()
      res.status(200).json(products)
    } catch (error) {
      res.status(500).json({ message: "Error fetching products" })
    }
  } else {
    res.setHeader("Allow", ["GET"])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}

