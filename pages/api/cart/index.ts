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

  if (req.method === "GET") {
    try {
      const cart = await db.collection("carts").findOne({ userId: new ObjectId(session.user.id) })
      const cartItems = cart ? cart.items : []

      const populatedItems = await Promise.all(
        cartItems.map(async (item: any) => {
          const product = await db.collection("products").findOne({ _id: new ObjectId(item.productId) })
          return { ...item, product }
        }),
      )

      res.status(200).json(populatedItems)
    } catch (error) {
      res.status(500).json({ message: "Error fetching cart" })
    }
  } else if (req.method === "POST") {
    try {
      const { productId, quantity } = req.body
      const cart = await db.collection("carts").findOneAndUpdate(
        { userId: new ObjectId(session.user.id) },
        {
          $push: { items: { productId: new ObjectId(productId), quantity } },
        },
        { upsert: true, returnDocument: "after" },
      )
      res.status(200).json(cart.value?.items || [])
    } catch (error) {
      res.status(500).json({ message: "Error updating cart" })
    }
  } else {
    res.setHeader("Allow", ["GET", "POST"])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}

