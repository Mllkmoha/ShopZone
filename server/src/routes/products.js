import express from 'express'
import Product from '../models/Product.js'

const router = express.Router()

// GET all products
router.get('/', async (req, res) => {
  try {
    const products = await Product.find()
    res.json(products)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// POST create product
router.post('/', async (req, res) => {
  try {
    const product = await Product.create(req.body)
    res.status(201).json(product)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// GET single product
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
    res.json(product)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

export default router