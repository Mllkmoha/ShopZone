export function ProductCardSkeleton() {
  return (
    <div className="skeleton-card" aria-hidden="true">
      <div className="skeleton skeleton-card-media" />
      <div className="skeleton-card-body">
        <div className="skeleton" style={{ height: 12, width: '40%' }} />
        <div className="skeleton" style={{ height: 18, width: '85%' }} />
        <div className="skeleton" style={{ height: 14, width: '100%' }} />
        <div className="skeleton" style={{ height: 14, width: '70%' }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 12 }}>
          <div className="skeleton" style={{ height: 22, width: 60 }} />
          {/* .skeleton already has the right border-radius via CSS — no inline override needed */}
          <div className="skeleton" style={{ height: 36, width: 110 }} />
        </div>
      </div>
    </div>
  )
}

export function ProductGridSkeleton({ count = 8 }) {
  return (
    <div className="product-grid" role="status" aria-label="Loading products">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  )
}

export function ProductDetailSkeleton() {
  return (
    <div className="pdp" aria-hidden="true">
      <div className="skeleton" style={{ aspectRatio: '1 / 1', borderRadius: 'var(--radius-2xl)' }} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div className="skeleton" style={{ height: 14, width: 120 }} />
        <div className="skeleton" style={{ height: 40, width: '80%' }} />
        <div className="skeleton" style={{ height: 32, width: 140, marginTop: 12 }} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 16 }}>
          <div className="skeleton" style={{ height: 14, width: '100%' }} />
          <div className="skeleton" style={{ height: 14, width: '95%' }} />
          <div className="skeleton" style={{ height: 14, width: '85%' }} />
        </div>
        <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
          <div className="skeleton" style={{ height: 52, width: 180, borderRadius: 'var(--radius-lg)' }} />
          <div className="skeleton" style={{ height: 52, width: 120, borderRadius: 'var(--radius-lg)' }} />
        </div>
      </div>
    </div>
  )
}