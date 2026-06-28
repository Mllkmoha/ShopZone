import express from 'express'
import mongoose from 'mongoose'
import Product from '../models/Product.js'
import { logServerError } from '../../index.js'

const router = express.Router()

// Validate POST body. Returns an array of error messages, or empty if valid.
function validateProductBody(body) {
  const errors = []
  if (!body || typeof body !== 'object') {
    return ['Request body must be a JSON object']
  }
  if (!body.name || typeof body.name !== 'string') {
    errors.push('`name` is required and must be a string')
  }
  if (body.price === undefined || body.price === null || typeof body.price !== 'number' || !Number.isFinite(body.price) || body.price < 0) {
    errors.push('`price` is required and must be a non-negative number')
  }
  if (body.description !== undefined && typeof body.description !== 'string') {
    errors.push('`description` must be a string')
  }
  if (body.image !== undefined && typeof body.image !== 'string') {
    errors.push('`image` must be a string')
  }
  if (body.category !== undefined && typeof body.category !== 'string') {
    errors.push('`category` must be a string')
  }
  if (body.stock !== undefined) {
    if (typeof body.stock !== 'number' || !Number.isInteger(body.stock) || body.stock < 0) {
      errors.push('`stock` must be a non-negative integer')
    }
  }
  return errors
}

// GET all products
router.get('/', async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 })
    res.json(products)
  } catch (err) {
    logServerError('GET /api/products', err)
    res.status(500).json({ message: 'Failed to load products' })
  }
})

// POST create product
router.post('/', async (req, res) => {
  const errors = validateProductBody(req.body)
  if (errors.length > 0) {
    return res.status(400).json({ message: 'Invalid product payload', errors })
  }
  try {
    const product = await Product.create(req.body)
    res.status(201).json(product)
  } catch (err) {
    logServerError('POST /api/products', err)
    res.status(500).json({ message: 'Failed to create product' })
  }
})

// GET single product
router.get('/:id', async (req, res) => {
  // Invalid ObjectId would otherwise surface as a Mongoose CastError → 500.
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(404).json({ message: 'Product not found' })
  }
  try {
    const product = await Product.findById(req.params.id)
    if (!product) {
      return res.status(404).json({ message: 'Product not found' })
    }
    res.json(product)
  } catch (err) {
    logServerError('GET /api/products/:id', err)
    res.status(500).json({ message: 'Failed to load product' })
  }
})

export default router