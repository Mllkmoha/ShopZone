import express from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import User from '../models/User.js'
import { logServerError } from '../../index.js'

const router = express.Router()

// 7-day token. Long enough to not annoy users, short enough to limit damage
// from a stolen token.
const JWT_EXPIRES_IN = '7d'

function signToken(user) {
  return jwt.sign({ id: user._id, isAdmin: user.isAdmin }, process.env.JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  })
}

function publicUser(user) {
  return { id: user._id, name: user.name, email: user.email, isAdmin: user.isAdmin }
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function validateRegisterBody(body) {
  const errors = []
  const { name, email, password } = body || {}
  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    errors.push('`name` is required')
  }
  if (!email || typeof email !== 'string' || !EMAIL_RE.test(email.trim())) {
    errors.push('`email` must be a valid email address')
  }
  if (!password || typeof password !== 'string' || password.length < 8) {
    errors.push('`password` must be at least 8 characters')
  }
  return errors
}

function validateLoginBody(body) {
  const errors = []
  const { email, password } = body || {}
  if (!email || typeof email !== 'string') errors.push('`email` is required')
  if (!password || typeof password !== 'string') errors.push('`password` is required')
  return errors
}

router.post('/register', async (req, res) => {
  const errors = validateRegisterBody(req.body)
  if (errors.length > 0) {
    return res.status(400).json({ message: 'Invalid registration payload', errors })
  }
  try {
    const email = req.body.email.trim().toLowerCase()
    const exists = await User.findOne({ email })
    if (exists) {
      return res.status(400).json({ message: 'An account with this email already exists' })
    }
    const hashed = await bcrypt.hash(req.body.password, 10)
    const user = await User.create({
      name: req.body.name.trim(),
      email,
      password: hashed,
    })
    res.status(201).json({ token: signToken(user), user: publicUser(user) })
  } catch (err) {
    logServerError('POST /api/auth/register', err)
    res.status(500).json({ message: 'Failed to register' })
  }
})

router.post('/login', async (req, res) => {
  const errors = validateLoginBody(req.body)
  if (errors.length > 0) {
    return res.status(400).json({ message: 'Invalid login payload', errors })
  }
  try {
    const email = req.body.email.trim().toLowerCase()
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' })
    }
    const match = await bcrypt.compare(req.body.password, user.password)
    if (!match) {
      return res.status(401).json({ message: 'Invalid email or password' })
    }
    res.json({ token: signToken(user), user: publicUser(user) })
  } catch (err) {
    logServerError('POST /api/auth/login', err)
    res.status(500).json({ message: 'Failed to log in' })
  }
})

export default router