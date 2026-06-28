import { createSlice } from '@reduxjs/toolkit'

// Whitelist the fields we keep in cart items so we don't bloat Redux state
// (or localStorage, if persisted) with full product blobs (descriptions,
// long image URLs, badge metadata, etc.).
function pickCartItem(p) {
  if (!p) return null
  return {
    _id: p._id,
    name: p.name,
    price: Number(p.price) || 0,
    image: p.image,
    category: p.category,
    qty: Number(p.qty) || 0,
  }
}

const STORAGE_KEY = 'cart'

function loadInitial() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return { items: [] }
    const parsed = JSON.parse(raw)
    if (!parsed || !Array.isArray(parsed.items)) return { items: [] }
    // Re-pick to drop any legacy fields
    const items = parsed.items.map(pickCartItem).filter(Boolean)
    return { items }
  } catch {
    return { items: [] }
  }
}

const initialState = typeof window !== 'undefined' ? loadInitial() : { items: [] }

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const picked = pickCartItem(action.payload)
      if (!picked) return
      const existing = state.items.find(i => i._id === picked._id)
      if (existing) {
        existing.qty += 1
      } else {
        state.items.push({ ...picked, qty: 1 })
      }
    },
    incrementQty: (state, action) => {
      const item = state.items.find(i => i._id === action.payload)
      if (item) item.qty += 1
    },
    decrementQty: (state, action) => {
      const item = state.items.find(i => i._id === action.payload)
      if (!item) return
      if (item.qty > 1) {
        item.qty -= 1
      } else {
        state.items = state.items.filter(i => i._id !== action.payload)
      }
    },
    removeFromCart: (state, action) => {
      state.items = state.items.filter(i => i._id !== action.payload)
    },
    clearCart: (state) => {
      state.items = []
    },
  },
})

export const {
  addToCart,
  incrementQty,
  decrementQty,
  removeFromCart,
  clearCart,
} = cartSlice.actions

export default cartSlice.reducer

// Persist cart to localStorage so refreshes don't lose it.
// Subscribed from store/index.js.
export const CART_STORAGE_KEY = STORAGE_KEY

export function persistCart(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ items: state.cart.items }))
  } catch { /* quota / disabled — ignore */ }
}
