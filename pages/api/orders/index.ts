import type { NextApiRequest, NextApiResponse } from "next"
import { getSession } from "next-auth/react"
import clientPromise from "@/lib/mongodb"
import { ObjectId } from "mongodb"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req })
  if (!session) {
    return res.status(401).json({ message: "Não autorizado" })
  }

  const client = await clientPromise
  const db = client.db()

  if (req.method === "GET") {
    try {
      const orders = await db
        .collection("orders")
        .find({ userId: new ObjectId(session.user.id) })
        .sort({ createdAt: -1 })
        .toArray()

      res.status(200).json(orders)
    } catch (error) {
      res.status(500).json({ message: "Erro ao buscar pedidos" })
    }
  } else {
    res.setHeader("Allow", ["GET"])
    res.status(405).end(`Método ${req.method} não permitido`)
  }
}

