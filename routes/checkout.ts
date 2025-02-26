import express from "express"
import Stripe from "stripe"
import Product from "../models/product"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2023-10-16",
})

const router = express.Router()

// Create Stripe checkout session
router.post("/", async (req, res) => {
  const { cart } = req.body // Example: [{ productId: '123', quantity: 2 }, ...]

  try {
    const line_items = await Promise.all(
      cart.map(async (item: { productId: string; quantity: number }) => {
        const product = await Product.findById(item.productId)
        if (!product) throw new Error("Product not found")
        return {
          price_data: {
            currency: "brl",
            product_data: { name: product.name },
            unit_amount: product.price * 100, // Converting to cents
          },
          quantity: item.quantity,
        }
      }),
    )

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items,
      mode: "payment",
      success_url: `${process.env.BASE_URL}/success`,
      cancel_url: `${process.env.BASE_URL}/cancel`,
    })

    res.json({ sessionId: session.id })
  } catch (error) {
    res.status(500).json({ message: "Error creating payment session!" })
  }
})

export default router

