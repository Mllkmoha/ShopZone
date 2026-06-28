import express from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import User from '../models/User.js'

const router = express.Router()

// Register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body
    const exists = await User.findOne({ email })
    if (exists) return res.status(400).json({ message: 'User already exists' })

    const hashed = await bcrypt.hash(password, 10)
    const user = await User.create({ name, email, password: hashed })

    const token = jwt.sign({ id: user._id, isAdmin: user.isAdmin }, process.env.JWT_SECRET)

    res.json({ token, user: { id: user._id, name: user.name, email: user.email, isAdmin: user.isAdmin } })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body
    const user = await User.findOne({ email })
    if (!user) return res.status(400).json({ message: 'Invalid credentials' })

    const match = await bcrypt.compare(password, user.password)
    if (!match) return res.status(400).json({ message: 'Invalid credentials' })

    const token = jwt.sign({ id: user._id, isAdmin: user.isAdmin }, process.env.JWT_SECRET)

    res.json({ token, user: { id: user._id, name: user.name, email: user.email, isAdmin: user.isAdmin } })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

export default router