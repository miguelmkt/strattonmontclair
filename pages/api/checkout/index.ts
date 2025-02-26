import type { NextApiRequest, NextApiResponse } from "next"
import { getSession } from "next-auth/react"
import clientPromise from "@/lib/mongodb"
import { ObjectId } from "mongodb"
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
})

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Método não permitido" })
  }

  const session = await getSession({ req })
  if (!session) {
    return res.status(401).json({ message: "Não autorizado" })
  }

  const client = await clientPromise
  const db = client.db()

  try {
    const cart = await db.collection("carts").findOne({ userId: new ObjectId(session.user.id) })
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Carrinho vazio" })
    }

    const line_items = await Promise.all(
      cart.items.map(async (item: any) => {
        const product = await db.collection("products").findOne({ _id: new ObjectId(item.productId) })
        return {
          price_data: {
            currency: "brl",
            product_data: {
              name: product.name,
              images: [product.imageUrl],
            },
            unit_amount: Math.round(product.price * 100),
          },
          quantity: item.quantity,
        }
      }),
    )

    const stripeSession = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items,
      mode: "payment",
      success_url: `${process.env.NEXTAUTH_URL}/order-confirmation?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXTAUTH_URL}/cart`,
      customer_email: session.user.email!,
      metadata: {
        userId: session.user.id,
      },
    })

    // Criar o pedido no banco de dados
    const order = {
      userId: new ObjectId(session.user.id),
      items: cart.items,
      total: line_items.reduce((sum, item) => sum + item.price_data.unit_amount * item.quantity, 0) / 100,
      status: "pending",
      stripeSessionId: stripeSession.id,
      createdAt: new Date(),
    }

    await db.collection("orders").insertOne(order)

    // Limpar o carrinho do usuário
    await db.collection("carts").updateOne({ userId: new ObjectId(session.user.id) }, { $set: { items: [] } })

    res.status(200).json({ sessionId: stripeSession.id })
  } catch (error) {
    console.error("Erro no checkout:", error)
    res.status(500).json({ message: "Erro ao criar sessão de checkout" })
  }
}

