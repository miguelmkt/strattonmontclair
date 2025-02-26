import express from "express"
import jwt from "jsonwebtoken"
import User from "../models/user"

const router = express.Router()

// Register new user
router.post("/register", async (req, res) => {
  const { name, email, password } = req.body

  try {
    const userExists = await User.findOne({ email })
    if (userExists) {
      return res.status(400).json({ message: "User already exists!" })
    }

    const user = new User({ name, email, password })
    await user.save()

    res.status(201).json({ message: "User registered successfully!" })
  } catch (error) {
    res.status(500).json({ message: "Error registering user!" })
  }
})

// User login
router.post("/login", async (req, res) => {
  const { email, password } = req.body

  try {
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(400).json({ message: "User not found!" })
    }

    const isMatch = await user.matchPassword(password)
    if (!isMatch) {
      return res.status(400).json({ message: "Incorrect password!" })
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET as string, { expiresIn: "1h" })
    res.json({ token })
  } catch (error) {
    res.status(500).json({ message: "Error logging in!" })
  }
})

export default router

