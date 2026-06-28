import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setCredentials } from '../store/slices/authSlice'
import { useNavigate, Link, Navigate } from 'react-router-dom'
import axios from 'axios'
import { useToast } from '../components/Toast'

const API_BASE = import.meta.env.VITE_API_URL || '/api'

export default function Login() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { notify } = useToast()
  const { user, token } = useSelector(state => state.auth)

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  // Already signed in? Bounce them home instead of showing a useless form.
  if (user && token) {
    return <Navigate to="/" replace />
  }

  const handleLogin = async (e) => {
    e?.preventDefault?.()
    if (!email.trim() || !password) {
      setError('Please enter your email and password.')
      return
    }
    setError('')
    setBusy(true)
    try {
      const { data } = await axios.post(`${API_BASE}/auth/login`, {
        email: email.trim().toLowerCase(),
        password,
      })
      dispatch(setCredentials(data))
      notify(`Welcome back${data?.user?.name ? `, ${data.user.name.split(' ')[0]}` : ''}!`, { tone: 'success' })
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="auth-shell">
      <div className="auth-card">
        <span className="hero-eyebrow" style={{ marginBottom: '1rem' }}>
          <span className="hero-eyebrow-dot" aria-hidden="true" />
          Welcome back
        </span>
        <h2>Sign in to ShopZone</h2>
        <p className="auth-sub">Enter your details to access your account.</p>

        {error && (
          <div className="alert alert-error" role="alert" style={{ marginBottom: '1.25rem' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 1 }} aria-hidden="true">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <span>{error}</span>
          </div>
        )}

        <form className="auth-form" onSubmit={handleLogin} noValidate>
          <div className="field">
            <label className="field-label" htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="input-base"
              required
            />
          </div>

          <div className="field">
            <label className="field-label" htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="input-base"
              required
            />
          </div>

          <button type="submit" className="btn btn-primary btn-block btn-lg" disabled={busy} style={{ marginTop: '0.5rem' }}>
            {busy ? 'Signing in…' : 'Sign in'}
          </button>
        </form>

        <p className="auth-foot">
          Don't have an account? <Link to="/register">Create one</Link>
        </p>
      </div>
    </div>
  )
}