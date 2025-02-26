import express from "express"
import Product from "../models/product"

const router = express.Router()

// List all products
router.get("/", async (req, res) => {
  try {
    const products = await Product.find()
    res.json(products)
  } catch (error) {
    res.status(500).json({ message: "Error fetching products!" })
  }
})

// Add product (admin)
router.post("/", async (req, res) => {
  const { name, price, description, imageUrl } = req.body

  try {
    const product = new Product({ name, price, description, imageUrl })
    await product.save()

    res.status(201).json(product)
  } catch (error) {
    res.status(500).json({ message: "Error adding product!" })
  }
})

export default router

