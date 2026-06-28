import { useCallback, useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { addToCart } from '../store/slices/cartSlice'
import { ProductDetailSkeleton } from '../components/Skeleton'
import { ErrorState } from '../components/States'
import { useToast } from '../components/Toast'
import SafeImage from '../components/SafeImage'

const API_BASE = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? '/api' : 'http://localhost:5000/api')

async function fetchProduct(id, signal) {
  const { data } = await axios.get(`${API_BASE}/products/${id}`, { signal })
  return data
}

export default function ProductDetail() {
  const { id } = useParams()
  const dispatch = useDispatch()
  const { notify } = useToast()
  const cartQty = useSelector(state => state.cart.items.find(i => i._id === id)?.qty ?? 0)
  const inCart = cartQty > 0

  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [wishlisted, setWishlisted] = useState(false)
  const [retryToken, setRetryToken] = useState(0)

  useEffect(() => {
    const controller = new AbortController()
    let cancelled = false
    setLoading(true)
    setError(null)

    fetchProduct(id, controller.signal)
      .then((data) => {
        if (cancelled) return
        if (!data || !data._id) {
          setError("We couldn't find that product.")
        } else {
          setProduct(data)
        }
      })
      .catch((err) => {
        if (cancelled || err.name === 'CanceledError' || err.name === 'AbortError') return
        setError(err.response?.data?.message || err.message || 'Failed to load product')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
      controller.abort()
    }
  }, [id, retryToken])

  const handleRetry = useCallback(() => {
    setRetryToken(t => t + 1)
  }, [])

  const handleAddToCart = useCallback(() => {
    if (!product) return
    dispatch(addToCart(product))
    notify(`${product.name} added to cart`, { tone: 'success' })
  }, [dispatch, product, notify])

  const handleWishlist = useCallback(() => {
    setWishlisted(w => {
      const next = !w
      notify(next ? 'Saved to wishlist' : 'Removed from wishlist', { tone: 'default' })
      return next
    })
  }, [notify])

  if (loading) {
    return (
      <div className="container-page">
        <ProductDetailSkeleton />
      </div>
    )
  }

  if (error) {
    return (
      <div className="container-page">
        <ErrorState message={error} onRetry={handleRetry} />
      </div>
    )
  }

  if (!product || !product._id) {
    return (
      <div className="container-page">
        <ErrorState message="We couldn't find that product." onRetry={handleRetry} />
      </div>
    )
  }

  const price = Number(product.price) || 0
  const rating = Number(product.rating) || 0
  const reviewCount = Number(product.reviewCount) || 0
  const hasRating = rating > 0

  return (
    <div className="container-page">
      <nav className="pdp-breadcrumb" aria-label="Breadcrumb">
        <Link to="/">Shop</Link>
        <span className="pdp-breadcrumb-sep">/</span>
        {product.category && (
          <>
            <Link to={`/?category=${encodeURIComponent(product.category)}`}>{product.category}</Link>
            <span className="pdp-breadcrumb-sep">/</span>
          </>
        )}
        <span style={{ color: 'var(--color-ink)', fontWeight: 500 }}>{product.name}</span>
      </nav>

      <article className="pdp">
        <div className="pdp-media">
          <SafeImage
            src={product.image}
            alt={product.name}
            name={product.name}
            category={product.category}
            loading="eager"
            decoding="async"
          />
        </div>

        <div>
          {product.category && <span className="pdp-cat">{product.category}</span>}
          <h1 className="pdp-title">{product.name}</h1>

          {hasRating && (
            <div className="pdp-rating">
              <span className="pdp-rating-stars">
                {[1, 2, 3, 4, 5].map(s => (
                  <svg key={s} width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                ))}
              </span>
              {rating.toFixed(1)} · {reviewCount > 0 ? `${reviewCount} reviews` : 'New release'}
            </div>
          )}

          <div className="pdp-price">${price.toFixed(2)}</div>

          {product.description && <p className="pdp-desc">{product.description}</p>}

          <div className="pdp-actions">
            <button
              onClick={handleAddToCart}
              className="btn btn-primary btn-xl"
              disabled={!product._id}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 0 1-8 0" />
              </svg>
              {inCart ? `In cart (${cartQty}) · $${(price * cartQty).toFixed(2)}` : `Add to cart · $${price.toFixed(2)}`}
            </button>
            <button
              type="button"
              className={`btn btn-secondary btn-xl btn-icon ${wishlisted ? 'is-active' : ''}`}
              aria-label={wishlisted ? 'Remove from wishlist' : 'Save to wishlist'}
              aria-pressed={wishlisted}
              onClick={handleWishlist}
            >
              <svg
                width="18" height="18" viewBox="0 0 24 24"
                fill={wishlisted ? 'currentColor' : 'none'}
                stroke="currentColor" strokeWidth="1.8"
                strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"
                style={wishlisted ? { color: 'var(--color-danger)' } : undefined}
              >
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
            </button>
          </div>

          <div className="pdp-meta">
            <div className="pdp-meta-row">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <rect x="1" y="3" width="15" height="13" />
                <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
                <circle cx="5.5" cy="18.5" r="2.5" />
                <circle cx="18.5" cy="18.5" r="2.5" />
              </svg>
              <span><strong>Free shipping</strong> on orders over $75</span>
            </div>
            <div className="pdp-meta-row">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="1 4 1 10 7 10" />
                <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
              </svg>
              <span><strong>30-day returns</strong> · no questions asked</span>
            </div>
            <div className="pdp-meta-row">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
              <span><strong>Secure checkout</strong> · SSL encrypted</span>
            </div>
          </div>
        </div>
      </article>
    </div>
  )
}
