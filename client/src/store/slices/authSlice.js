import { createSlice } from '@reduxjs/toolkit'

// Read persisted auth from localStorage safely — corrupted JSON would otherwise
// throw and crash the entire app at boot.
function safeReadJSON(key) {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return null
    return JSON.parse(raw)
  } catch {
    try { localStorage.removeItem(key) } catch { /* no-op */ }
    return null
  }
}

function safeReadString(key) {
  try {
    return localStorage.getItem(key) || null
  } catch {
    return null
  }
}

const initialUser = safeReadJSON('user')
const initialToken = safeReadString('token')

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: initialUser,
    token: initialToken,
  },
  reducers: {
    setCredentials: (state, action) => {
      const { user, token } = action.payload || {}
      state.user = user || null
      state.token = token || null
      if (user) {
        try { localStorage.setItem('user', JSON.stringify(user)) } catch { /* quota / disabled */ }
      }
      if (token) {
        try { localStorage.setItem('token', token) } catch { /* quota / disabled */ }
      }
    },
    logout: (state) => {
      state.user = null
      state.token = null
      try {
        localStorage.removeItem('user')
        localStorage.removeItem('token')
      } catch { /* no-op */ }
    },
  },
})

export const { setCredentials, logout } = authSlice.actions
export default authSlice.reducer
