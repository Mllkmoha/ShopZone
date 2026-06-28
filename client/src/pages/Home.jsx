import { useEffect, useMemo } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchProducts } from '../store/slices/productsSlice'
import ProductCard from '../components/ProductCard'
import { ProductGridSkeleton } from '../components/Skeleton'
import { EmptyState, ErrorState } from '../components/States'

function useQueryParam(name) {
  const { search } = useLocation()
  return useMemo(() => new URLSearchParams(search).get(name), [search, name])
}

function applyFilter(items, category) {
  if (!category) return { items, label: null }
  const c = category.toLowerCase()
  if (c === 'new') {
    // No `isNew` flag in the data — derive "new" from createdAt (latest 4).
    const sorted = [...items].sort((a, b) => {
      const ta = new Date(a.createdAt || 0).getTime()
      const tb = new Date(b.createdAt || 0).getTime()
      return tb - ta
    })
    return {
      items: sorted.slice(0, Math.max(4, Math.ceil(sorted.length / 2))),
      label: 'New arrivals',
    }
  }
  if (c === 'featured') {
    // No `featured` flag in the data — surface top half by price as "Featured".
    const sorted = [...items].sort((a, b) => (Number(b.price) || 0) - (Number(a.price) || 0))
    return {
      items: sorted.slice(0, Math.max(4, Math.ceil(sorted.length / 2))),
      label: 'Featured',
    }
  }
  // Treat any other value as a literal category match.
  return {
    items: items.filter(p => (p.category || '').toLowerCase() === c),
    label: category,
  }
}

export default function Home() {
  const dispatch = useDispatch()
  const { items, loading, error } = useSelector(state => state.products)
  const category = useQueryParam('category')

  // Fetch once. If we already have items (persisted via Redux cache or
  // localStorage), don't refetch on every nav into Home.
  useEffect(() => {
    if (items.length === 0 && !loading && !error) {
      dispatch(fetchProducts())
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch])

  const { items: visibleItems, label } = applyFilter(items, category)

  return (
    <>
      {/* Hero */}
      <section className="hero">
        <div className="hero-bg" aria-hidden="true" />
        <div className="container-page" style={{ position: 'relative' }}>
          <span className="hero-eyebrow">
            <span className="hero-eyebrow-dot" aria-hidden="true" />
            New · ShopZone Summer 2026
          </span>
          <h1 className="hero-title">
            ShopZone.<br />
            <span className="hero-title-grad">Curated for you.</span>
          </h1>
          <p className="hero-sub">
            ShopZone is a curated home for premium essentials — honest materials,
            considered details, and pieces built for the way you actually live.
            Free shipping on orders over $75.
          </p>
          <div className="hero-cta">
            <a href="#products" className="btn btn-primary btn-xl">Shop the collection</a>
            <Link to="/cart" className="btn btn-secondary btn-xl">View cart</Link>
          </div>

          <div className="hero-meta">
            <div className="hero-meta-item">
              <strong>240+</strong>
              Curated brands
            </div>
            <div className="hero-meta-item">
              <strong>4.9 ★</strong>
              Average rating
            </div>
            <div className="hero-meta-item">
              <strong>Free</strong>
              Shipping over $75
            </div>
          </div>
        </div>
      </section>

      {/* Product grid */}
      <section className="section" id="products">
        <div className="container-page">
          <div className="section-head">
            <div>
              <span className="section-eyebrow">
                {label ? `Browsing · ${label}` : 'Just landed'}
              </span>
              <h2 className="section-title">
                {label ? label : 'Featured products'}
              </h2>
              <p className="section-sub">
                {label
                  ? `Showing ${visibleItems.length} item${visibleItems.length === 1 ? '' : 's'} in ${label}.`
                  : 'Hand-picked pieces our customers love right now.'}
              </p>
            </div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 12 }}>
              {label && (
                <Link
                  to="/"
                  className="btn btn-sm btn-ghost"
                  style={{ color: 'var(--color-ink-2)' }}
                >
                  Clear filter
                </Link>
              )}
              {!loading && (
                <span style={{ color: 'var(--color-ink-3)', fontSize: '0.875rem' }}>
                  {visibleItems.length} item{visibleItems.length === 1 ? '' : 's'}
                </span>
              )}
            </div>
          </div>

          {loading && <ProductGridSkeleton count={8} />}

          {!loading && error && (
            <ErrorState message={error} onRetry={() => dispatch(fetchProducts())} />
          )}

          {!loading && !error && visibleItems.length === 0 && !label && (
            <EmptyState
              icon={
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <path d="M16 10a4 4 0 0 1-8 0" />
                </svg>
              }
              title="No products yet"
              description="We're curating our catalog. Check back soon for the latest arrivals."
            />
          )}

          {!loading && !error && visibleItems.length === 0 && label && (
            <EmptyState
              icon={
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="7" />
                  <line x1="20" y1="20" x2="16.65" y2="16.65" />
                </svg>
              }
              title={`No matches for "${label}"`}
              description="Try a different filter, or browse the full collection."
              actionLabel="Show all products"
              actionTo="/"
            />
          )}

          {!loading && !error && visibleItems.length > 0 && (
            <div className="product-grid">
              {visibleItems.map(product => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  )
}
