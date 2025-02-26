import type { NextApiRequest, NextApiResponse } from "next"
import clientPromise from "@/lib/mongodb"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Método não permitido" })
  }

  const { email } = req.body

  if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
    return res.status(400).json({ message: "E-mail inválido" })
  }

  try {
    const client = await clientPromise
    const db = client.db()

    const existingSubscriber = await db.collection("newsletter").findOne({ email })
    if (existingSubscriber) {
      return res.status(400).json({ message: "Este e-mail já está inscrito" })
    }

    await db.collection("newsletter").insertOne({ email, subscribedAt: new Date() })
    res.status(201).json({ message: "Inscrito com sucesso" })
  } catch (error) {
    console.error("Erro ao inscrever na newsletter:", error)
    res.status(500).json({ message: "Erro ao processar a inscrição" })
  }
}

