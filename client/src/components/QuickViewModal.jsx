import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { addToCart } from '../store/slices/cartSlice'
import { useToast } from './Toast'
import SafeImage from './SafeImage'

// QuickViewModal — lightweight preview overlay. Renders into the layout
// (no portal needed) and traps Escape to close.
export default function QuickViewModal({ product, onClose }) {
  const dispatch = useDispatch()
  const { notify } = useToast()
  const dialogRef = useRef(null)
  const lastFocused = useRef(null)

  // Close on Escape, restore focus to opener
  useEffect(() => {
    lastFocused.current = document.activeElement
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    // Move focus into the dialog
    dialogRef.current?.focus()
    // Lock body scroll
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = prevOverflow
      if (lastFocused.current && typeof lastFocused.current.focus === 'function') {
        lastFocused.current.focus()
      }
    }
  }, [onClose])

  if (!product) return null

  const price = Number(product.price) || 0
  const rating = Number(product.rating) || 0
  const reviewCount = Number(product.reviewCount) || 0

  const handleAdd = () => {
    dispatch(addToCart(product))
    notify(`${product.name} added to cart`, { tone: 'success' })
    onClose()
  }

  return (
    <div
      className="modal-backdrop"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="quickview-title"
        ref={dialogRef}
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          className="modal-close"
          onClick={onClose}
          aria-label="Close quick view"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        <div className="modal-media">
          <SafeImage src={product.image} alt={product.name} name={product.name} category={product.category} eager />
        </div>

        <div className="modal-body">
          {product.category && <span className="pdp-cat">{product.category}</span>}
          <h2 id="quickview-title" className="modal-title">{product.name}</h2>

          {rating > 0 && (
            <div className="pdp-rating" style={{ marginTop: 8 }}>
              <span className="pdp-rating-stars" aria-hidden="true">
                {[1, 2, 3, 4, 5].map(s => (
                  <svg key={s} width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>
                ))}
              </span>
              {rating.toFixed(1)} · {reviewCount > 0 ? `${reviewCount} reviews` : 'New release'}
            </div>
          )}

          <div className="modal-price">${price.toFixed(2)}</div>

          {product.description && <p className="modal-desc">{product.description}</p>}

          <div className="modal-actions">
            <button onClick={handleAdd} className="btn btn-primary btn-lg btn-block" type="button">
              Add to cart · ${price.toFixed(2)}
            </button>
            <Link
              to={`/product/${product._id}`}
              className="btn btn-ghost btn-sm btn-block"
              onClick={onClose}
            >
              View full details →
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}