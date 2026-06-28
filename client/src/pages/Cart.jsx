import { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import {
  incrementQty,
  decrementQty,
  removeFromCart,
  clearCart,
} from '../store/slices/cartSlice'
import { EmptyState } from '../components/States'
import { useToast } from '../components/Toast'
import SafeImage from '../components/SafeImage'

const FREE_SHIPPING_THRESHOLD = 75

export default function Cart() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { notify } = useToast()
  const { items } = useSelector(state => state.cart)

  const subtotal = items.reduce((acc, item) => acc + (Number(item.price) || 0) * (Number(item.qty) || 0), 0)
  const shipping = subtotal === 0 ? 0 : subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : 9.99
  const tax = subtotal * 0.08
  const total = subtotal + shipping + tax
  const itemCount = items.reduce((n, i) => n + (Number(i.qty) || 0), 0)

  const handleRemove = useCallback((id, name) => {
    dispatch(removeFromCart(id))
    notify(`${name} removed from cart`, { tone: 'default' })
  }, [dispatch, notify])

  const handleClear = useCallback(() => {
    if (items.length === 0) return
    const ok = window.confirm(`Remove all ${items.length} item${items.length === 1 ? '' : 's'} from your cart?`)
    if (!ok) return
    dispatch(clearCart())
    notify('Cart cleared', { tone: 'default' })
  }, [dispatch, items.length, notify])

  const handleCheckout = useCallback(() => {
    if (items.length === 0) {
      notify('Your cart is empty', { tone: 'error' })
      return
    }
    // No real checkout backend yet — give the user feedback instead of a no-op.
    notify(`Checkout flow coming soon. ${itemCount} item${itemCount === 1 ? '' : 's'} ready.`, { tone: 'info', duration: 3200 })
  }, [items.length, itemCount, notify])

  const handleContinueShopping = useCallback(() => {
    navigate('/')
  }, [navigate])

  if (items.length === 0) {
    return (
      <div className="container-page">
        <EmptyState
          icon={
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 0 1-8 0" />
            </svg>
          }
          title="Your cart is empty"
          description="Browse our collection and add a few favorites to get started."
          actionLabel="Shop now"
          actionTo="/"
        />
      </div>
    )
  }

  return (
    <div className="container-page">
      <header style={{ padding: '40px 0 24px' }}>
        <span className="section-eyebrow">Checkout</span>
        <h1 className="section-title" style={{ marginBottom: 6 }}>Your cart</h1>
        <p className="section-sub">{itemCount} item{itemCount === 1 ? '' : 's'} ready for checkout</p>
      </header>

      <div className="cart-layout">
        <div className="cart-list" role="list">
          {items.map(item => (
            <article key={item._id} className="cart-item" role="listitem">
              <Link to={`/product/${item._id}`} className="cart-item-media" aria-label={`View ${item.name}`}>
                <SafeImage src={item.image} alt={item.name} name={item.name} category={item.category} loading="lazy" rounded="md" />
              </Link>

              <div className="cart-item-info">
                {item.category && <div className="cart-item-cat">{item.category}</div>}
                <Link to={`/product/${item._id}`} className="cart-item-title">
                  {item.name}
                </Link>
                <div className="cart-item-price">${Number(item.price || 0).toFixed(2)} each</div>

                <div className="cart-item-actions">
                  <div className="qty-stepper" role="group" aria-label={`Quantity for ${item.name}`}>
                    <button
                      onClick={() => dispatch(decrementQty(item._id))}
                      aria-label={`Decrease quantity of ${item.name}`}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /></svg>
                    </button>
                    <span className="qty-stepper-value" aria-live="polite">{item.qty}</span>
                    <button
                      onClick={() => dispatch(incrementQty(item._id))}
                      aria-label={`Increase quantity of ${item.name}`}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
                    </button>
                  </div>
                  <button
                    onClick={() => handleRemove(item._id, item.name)}
                    className="btn btn-sm btn-ghost"
                    style={{ color: 'var(--color-ink-3)' }}
                  >
                    Remove
                  </button>
                </div>
              </div>

              <div className="cart-item-side">
                <span className="cart-item-subtotal-label">Subtotal</span>
                <div className="cart-item-subtotal">${(Number(item.price) * Number(item.qty || 0)).toFixed(2)}</div>
              </div>
            </article>
          ))}
        </div>

        <aside className="cart-summary" aria-label="Order summary">
          <h3>Order summary</h3>
          <div className="cart-summary-row muted">
            <span>Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="cart-summary-row muted">
            <span>Shipping</span>
            <span>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
          </div>
          <div className="cart-summary-row muted">
            <span>Estimated tax</span>
            <span>${tax.toFixed(2)}</span>
          </div>
          <div className="cart-summary-divider" />
          <div className="cart-summary-total">
            <span style={{ fontWeight: 600, color: 'var(--color-ink-2)' }}>Total</span>
            <span className="v">${total.toFixed(2)}</span>
          </div>

          {subtotal < FREE_SHIPPING_THRESHOLD && (
            <div className="alert alert-info" style={{ marginTop: 20, fontSize: '0.8125rem' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 2 }} aria-hidden="true">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              <span>Add <strong>${(FREE_SHIPPING_THRESHOLD - subtotal).toFixed(2)}</strong> more for free shipping.</span>
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 24 }}>
            <button
              type="button"
              className="btn btn-primary btn-xl btn-block"
              onClick={handleCheckout}
              disabled={items.length === 0}
            >
              Checkout securely
            </button>
            <button
              type="button"
              onClick={handleContinueShopping}
              className="btn btn-secondary btn-block"
            >
              Continue shopping
            </button>
            <button
              type="button"
              onClick={handleClear}
              className="btn btn-ghost btn-sm btn-block"
              style={{ color: 'var(--color-ink-3)' }}
              disabled={items.length === 0}
            >
              Clear cart
            </button>
          </div>
        </aside>
      </div>
    </div>
  )
}