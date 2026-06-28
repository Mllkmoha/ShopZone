import { configureStore } from '@reduxjs/toolkit'
import authReducer from './slices/authSlice'
import cartReducer, { persistCart } from './slices/cartSlice'
import productsReducer from './slices/productsSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
    products: productsReducer,
  },
})

// Persist cart on every change. Cart state is small (a few items), so the
// serialization cost is negligible compared to the win of surviving refresh.
let lastCart = store.getState().cart
store.subscribe(() => {
  // Redux Toolkit uses Immer, so a slice reference only changes when one of
  // its top-level fields is reassigned. `!==` is therefore exactly the right
  // equality check here — strict-equal would miss any nested mutation that
  // doesn't replace the slice root.
  const next = store.getState().cart
  if (next !== lastCart) {
    lastCart = next
    persistCart({ cart: next })
  }
})
