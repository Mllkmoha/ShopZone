import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import apiClient from '../../api/client'

export const fetchProducts = createAsyncThunk('products/fetchAll', async () => {
  const { data } = await apiClient.get(`/products`)
  // The server returns a bare JSON array. Anything else is a server bug.
  if (!Array.isArray(data)) {
    throw new Error('Unexpected response shape from /api/products')
  }
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
        state.error = null
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false
        state.items = action.payload
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Failed to load products'
      })
  },
})

export default productsSlice.reducer