import type { NextApiRequest, NextApiResponse } from "next"
import { getSession } from "next-auth/react"
import clientPromise from "@/lib/mongodb"
import { ObjectId } from "mongodb"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req })
  const { id } = req.query

  const client = await clientPromise
  const db = client.db()

  if (req.method === "GET") {
    try {
      const reviews = await db
        .collection("reviews")
        .find({ productId: new ObjectId(id as string) })
        .sort({ createdAt: -1 })
        .toArray()

      res.status(200).json(reviews)
    } catch (error) {
      res.status(500).json({ message: "Erro ao buscar avaliações" })
    }
  } else if (req.method === "POST") {
    if (!session) {
      return res.status(401).json({ message: "Não autorizado" })
    }

    try {
      const { rating, comment } = req.body
      const review = {
        productId: new ObjectId(id as string),
        userId: new ObjectId(session.user.id),
        userName: session.user.name,
        rating,
        comment,
        createdAt: new Date(),
      }

      const result = await db.collection("reviews").insertOne(review)
      res.status(201).json({ ...review, _id: result.insertedId })
    } catch (error) {
      res.status(500).json({ message: "Erro ao adicionar avaliação" })
    }
  } else {
    res.setHeader("Allow", ["GET", "POST"])
    res.status(405).end(`Método ${req.method} não permitido`)
  }
}

