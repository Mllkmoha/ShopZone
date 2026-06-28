import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setCredentials } from '../store/slices/authSlice'
import { useNavigate, Link, Navigate } from 'react-router-dom'
import apiClient from '../api/client'
import { useToast } from '../components/Toast'

export default function Register() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { notify } = useToast()
  const { user, token } = useSelector(state => state.auth)

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  // Already signed in? Skip the form.
  if (user && token) {
    return <Navigate to="/" replace />
  }

  const handleRegister = async (e) => {
    e?.preventDefault?.()
    const trimmedName = name.trim()
    const trimmedEmail = email.trim().toLowerCase()
    if (!trimmedName || !trimmedEmail || !password) {
      setError('Please fill in every field.')
      return
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters.')
      return
    }
    setError('')
    setBusy(true)
    try {
      const { data } = await apiClient.post(`/auth/register`, {
        name: trimmedName,
        email: trimmedEmail,
        password,
      })
      dispatch(setCredentials(data))
      notify(`Welcome to ShopZone, ${trimmedName.split(' ')[0]}!`, { tone: 'success' })
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="auth-shell">
      <div className="auth-card">
        <span className="hero-eyebrow" style={{ marginBottom: '1rem' }}>
          <span className="hero-eyebrow-dot" aria-hidden="true" />
          Join ShopZone
        </span>
        <h2>Create your account</h2>
        <p className="auth-sub">It takes less than a minute. Cancel anytime.</p>

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

        <form className="auth-form" onSubmit={handleRegister} noValidate>
          <div className="field">
            <label className="field-label" htmlFor="name">Full name</label>
            <input
              id="name"
              type="text"
              autoComplete="name"
              placeholder="Alex Johnson"
              value={name}
              onChange={e => setName(e.target.value)}
              className="input-base"
              required
            />
          </div>

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
              autoComplete="new-password"
              placeholder="At least 8 characters"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="input-base"
              minLength={8}
              required
            />
            <span className="field-hint">Use 8+ characters with a mix of letters and numbers.</span>
          </div>

          <button type="submit" className="btn btn-primary btn-block btn-lg" disabled={busy} style={{ marginTop: '0.5rem' }}>
            {busy ? 'Creating account…' : 'Create account'}
          </button>
        </form>

        <p className="auth-foot">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  )
}