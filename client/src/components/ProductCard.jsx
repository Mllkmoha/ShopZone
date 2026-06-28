import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { addToCart } from '../store/slices/cartSlice'
import { useToast } from './Toast'
import QuickViewModal from './QuickViewModal'
import SafeImage from './SafeImage'

const STARS = [1, 2, 3, 4, 5]

// Deterministic pseudo-random based on product id — gives swatches variety per card
function seededPalette(seed = '') {
  const palettes = [
    ['#1f1f1f', '#3d3a36', '#9a958c'],
    ['#2a5b3e', '#ecf3ee', '#1f1f1f'],
    ['#b85c38', '#e8d5c4', '#3d3a36'],
    ['#1e3a5f', '#cfd8e3', '#0a0a0a'],
    ['#6b3e8e', '#e6dcf0', '#3d3a36'],
    ['#d4a574', '#f0e4d0', '#5c4a36'],
  ]
  let hash = 0
  for (let i = 0; i < seed.length; i++) hash = (hash * 31 + seed.charCodeAt(i)) >>> 0
  return palettes[hash % palettes.length]
}

export default function ProductCard({ product }) {
  const dispatch = useDispatch()
  const { notify } = useToast()
  const cartQty = useSelector(state => {
    const item = state.cart.items.find(i => i._id === product._id)
    return item?.qty ?? 0
  })

  const [quickOpen, setQuickOpen] = useState(false)
  const [wishlisted, setWishlisted] = useState(false)

  // Guard: skip render if product is missing or has no id
  if (!product || !product._id) return null

  const handleQuickAdd = (e) => {
    e.preventDefault()
    e.stopPropagation()
    dispatch(addToCart(product))
    notify(`${product.name} added to cart`, { tone: 'success' })
  }

  const handleWishlist = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setWishlisted(w => {
      const next = !w
      notify(
        next ? `Saved ${product.name} to wishlist` : `Removed ${product.name} from wishlist`,
        { tone: 'default' },
      )
      return next
    })
  }

  const handleQuickView = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setQuickOpen(true)
  }

  const price = Number(product.price) || 0
  const comparePrice = product.comparePrice ? Number(product.comparePrice) : null
  const rating = Number(product.rating) || 0
  const reviewCount = Number(product.reviewCount) || 0
  const palette = seededPalette(product._id)
  const hasSale = comparePrice && comparePrice > price
  const badge = product.badge || (hasSale ? 'Sale' : product.isNew ? 'New' : null)

  return (
    <>
      <article className="card-product">
        {/* Media wrapper is a div, not a Link, so we can layer buttons over it legally */}
        <div className="card-product-media">
          <Link
            to={`/product/${product._id}`}
            className="card-product-media-link"
            aria-label={`View ${product.name}`}
          >
            {badge && (
              <span className={`card-product-badge ${hasSale ? 'is-sale' : ''}`}>{badge}</span>
            )}

            <SafeImage
              src={product.image}
              alt={product.name}
              name={product.name}
              category={product.category}
              loading="lazy"
              decoding="async"
              className="card-product-media-img"
            />
          </Link>

          <button
            type="button"
            className={`card-product-wishlist ${wishlisted ? 'is-active' : ''}`}
            aria-label={wishlisted ? 'Remove from wishlist' : 'Save to wishlist'}
            aria-pressed={wishlisted}
            onClick={handleWishlist}
          >
            <svg
              width="18" height="18" viewBox="0 0 24 24"
              fill={wishlisted ? 'currentColor' : 'none'}
              stroke="currentColor" strokeWidth="2"
              strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"
              style={wishlisted ? { color: 'var(--color-danger)' } : undefined}
            >
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
          </button>

          <div className="card-product-actions">
            <button
              type="button"
              className="card-product-quickview"
              onClick={handleQuickView}
              aria-label={`Quick view ${product.name}`}
            >
              Quick view
            </button>
            <button
              type="button"
              className="card-product-quickadd"
              aria-label={`Quick add ${product.name} to cart`}
              onClick={handleQuickAdd}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="card-product-body">
          {product.category && (
            <Link
              to={`/?category=${encodeURIComponent(product.category)}`}
              className="card-product-cat"
            >
              {product.category}
            </Link>
          )}
          <Link to={`/product/${product._id}`} className="card-product-title">
            {product.name}
          </Link>

          <div className="card-product-swatches" aria-hidden="true">
            {palette.map((c, i) => (
              <span
                key={i}
                className="card-product-swatch"
                style={{ background: c }}
              />
            ))}
          </div>

          <div className="card-product-foot">
            <div>
              <span className="card-product-price">${price.toFixed(2)}</span>
              {hasSale && (
                <span className="card-product-price-old">${comparePrice.toFixed(2)}</span>
              )}
            </div>
            {reviewCount > 0 && rating > 0 && (
              <span className="card-product-rating" aria-label={`${rating.toFixed(1)} out of 5, ${reviewCount} reviews`}>
                <span className="card-product-rating-stars" aria-hidden="true">
                  {STARS.map(s => (
                    <svg key={s} width="11" height="11" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                  ))}
                </span>
                ({reviewCount})
              </span>
            )}
          </div>

          {cartQty > 0 && (
            <span className="card-product-incart">
              ✓ {cartQty} in cart
            </span>
          )}
        </div>
      </article>

      {quickOpen && (
        <QuickViewModal
          product={product}
          onClose={() => setQuickOpen(false)}
        />
      )}
    </>
  )
}