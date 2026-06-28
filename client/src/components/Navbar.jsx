import { NavLink, Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { logout } from '../store/slices/authSlice'

export default function Navbar() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user } = useSelector(state => state.auth)
  const cartCount = useSelector(state => state.cart.items.reduce((n, i) => n + i.qty, 0))

  const handleLogout = () => {
    dispatch(logout())
    navigate('/')
  }

  return (
    <header className="nav" role="banner">
      <div className="container-page nav-inner">
        <Link to="/" className="nav-brand" aria-label="ShopZone home">
          <span className="nav-brand-mark" aria-hidden="true">S</span>
          ShopZone
        </Link>

        <nav className="nav-links" aria-label="Primary">
          <NavLink to="/" end className={({ isActive }) => 'nav-link' + (isActive ? ' is-active' : '')}>
            Shop
          </NavLink>
          <NavLink to="/?category=new" className="nav-link">New in</NavLink>
          <NavLink to="/?category=featured" className="nav-link">Featured</NavLink>
        </nav>

        <div className="nav-actions">
          {user ? (
            <>
              <div className="nav-user">
                <span className="nav-user-avatar" aria-hidden="true">
                  {user.name?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || 'U'}
                </span>
                <span className="nav-user-name">{user.name || user.email?.split('@')[0]}</span>
              </div>
              <button onClick={handleLogout} className="btn btn-sm btn-ghost">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-sm btn-ghost">Sign in</Link>
              <Link to="/register" className="btn btn-sm btn-primary">Join</Link>
            </>
          )}

          <Link
            to="/cart"
            className="cart-btn"
            aria-label={`Cart, ${cartCount} item${cartCount === 1 ? '' : 's'}`}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 0 1-8 0" />
            </svg>
            {cartCount > 0 && <span className="cart-btn-count">{cartCount}</span>}
          </Link>
        </div>
      </div>
    </header>
  )
}