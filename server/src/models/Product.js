import mongoose from 'mongoose'

const productSchema = new mongoose.Schema({
  name:        { type: String, required: true, trim: true },
  description: { type: String, trim: true },
  price:       { type: Number, required: true, min: 0 },
  image:       { type: String, trim: true },
  category:    { type: String, trim: true, lowercase: true },
  stock:       { type: Number, default: 10, min: 0 },
}, { timestamps: true })

export default mongoose.model('Product', productSchema)