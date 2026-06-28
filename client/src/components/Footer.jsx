import { Link } from 'react-router-dom'

const SUPPORT_EMAIL = 'support@shopzone.example'

// Links that aren't backed by a real route yet render as a non-clickable
// <span> with a "Coming soon" badge — honest UX beats a dead anchor.
function ComingSoon() {
  return (
    <span className="footer-coming" aria-label="Coming soon">
      <span className="footer-coming-dot" aria-hidden="true" />
      Soon
    </span>
  )
}

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="footer" role="contentinfo">
      <div className="container-page">
        <div className="footer-inner">
          <div>
            <Link to="/" className="nav-brand" aria-label="ShopZone home">
              <span className="nav-brand-mark" aria-hidden="true">S</span>
              ShopZone
            </Link>
            <p className="footer-tag">
              Premium products, curated for the modern lifestyle. Free shipping on orders over $75.
            </p>
            <p className="footer-tag" style={{ marginTop: 12 }}>
              <a href={`mailto:${SUPPORT_EMAIL}`} style={{ color: 'var(--color-ink)', fontWeight: 600 }}>
                {SUPPORT_EMAIL}
              </a>
            </p>
          </div>

          <div>
            <h4>Shop</h4>
            <ul>
              <li><Link to="/">All products</Link></li>
              <li><Link to="/?category=new">New arrivals</Link></li>
              <li><Link to="/?category=featured">Featured</Link></li>
              <li><Link to="/cart">Cart</Link></li>
            </ul>
          </div>

          <div>
            <h4>Account</h4>
            <ul>
              <li><Link to="/login">Sign in</Link></li>
              <li><Link to="/register">Create account</Link></li>
              <li>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                  Orders <ComingSoon />
                </span>
              </li>
              <li>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                  Wishlist <ComingSoon />
                </span>
              </li>
            </ul>
          </div>

          <div>
            <h4>Support</h4>
            <ul>
              <li>
                <a href={`mailto:${SUPPORT_EMAIL}`}>Contact us</a>
              </li>
              <li>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                  Shipping <ComingSoon />
                </span>
              </li>
              <li>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                  Returns <ComingSoon />
                </span>
              </li>
              <li>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                  FAQ <ComingSoon />
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <span>© {year} ShopZone. All rights reserved.</span>
          <span>
            Made with care ·
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, marginLeft: 6 }}>
              <a href="#" onClick={(e) => e.preventDefault()} style={{ color: 'var(--color-ink-2)' }}>
                Privacy
              </a>
              <span style={{ color: 'var(--color-ink-4)' }}>·</span>
              <a href="#" onClick={(e) => e.preventDefault()} style={{ color: 'var(--color-ink-2)' }}>
                Terms
              </a>
            </span>
          </span>
        </div>
      </div>
    </footer>
  )
}
