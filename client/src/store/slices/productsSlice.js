import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

export const fetchProducts = createAsyncThunk('products/fetchAll', async () => {
  const { data } = await axios.get('http://localhost:5000/api/products')
  return data
})

const productsSlice = createSlice({
  name: 'products',
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false
        const payload = action.payload
        // Normalize: accept either a bare array or { products: [...] } / { data: [...] }
        state.items = Array.isArray(payload)
          ? payload
          : payload?.products ?? payload?.data ?? []
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message
      })
  },
})

export default productsSlice.reducer