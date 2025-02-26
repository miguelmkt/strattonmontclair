import type { NextApiRequest, NextApiResponse } from "next"
import { getSession } from "next-auth/react"
import clientPromise from "@/lib/mongodb"
import { ObjectId } from "mongodb"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req })
  if (!session) {
    return res.status(401).json({ message: "Unauthorized" })
  }

  const client = await clientPromise
  const db = client.db()

  const { productId } = req.query

  if (req.method === "DELETE") {
    try {
      await db
        .collection("wishlists")
        .updateOne(
          { userId: new ObjectId(session.user.id) },
          { $pull: { items: { productId: new ObjectId(productId as string) } } },
        )
      res.status(200).json({ message: "Product removed from wishlist" })
    } catch (error) {
      res.status(500).json({ message: "Error removing product from wishlist" })
    }
  } else {
    res.setHeader("Allow", ["DELETE"])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}

