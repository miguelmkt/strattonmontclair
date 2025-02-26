import type { NextApiRequest, NextApiResponse } from "next"
import { getSession } from "next-auth/react"
import clientPromise from "@/lib/mongodb"
import { ObjectId } from "mongodb"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req })
  if (!session) {
    return res.status(401).json({ message: "Não autorizado" })
  }

  const { id } = req.query

  const client = await clientPromise
  const db = client.db()

  if (req.method === "GET") {
    try {
      const order = await db.collection("orders").findOne({
        _id: new ObjectId(id as string),
        userId: new ObjectId(session.user.id),
      })

      if (!order) {
        return res.status(404).json({ message: "Pedido não encontrado" })
      }

      res.status(200).json(order)
    } catch (error) {
      res.status(500).json({ message: "Erro ao buscar detalhes do pedido" })
    }
  } else {
    res.setHeader("Allow", ["GET"])
    res.status(405).end(`Método ${req.method} não permitido`)
  }
}

