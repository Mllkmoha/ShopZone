import { useEffect, useRef, useState } from 'react'
import { isDeadImageHost, buildPlaceholderSVG } from '../utils/placeholder'

/**
 * SafeImage — never renders a broken image.
 *
 * Strategy:
 * 1. If `src` is missing OR points to a known-dead host (via.placeholder.com
 *    etc.), we render a generated inline-SVG placeholder immediately. No
 *    network round-trip, no broken-image icon.
 * 2. Otherwise we render the real <img>. If it still fails (404, CORS,
 *    offline), we fall back to the generated placeholder.
 *
 * Props:
 *   src: image URL (string or null/undefined)
 *   alt: alt text
 *   name: used to seed the placeholder letter + gradient
 *   category: used to pick a category emoji in the placeholder
 *   rounded: 'none' | 'sm' | 'md' | 'lg' | 'full' (default 'none')
 *   className: extra classes for the <img>
 *   eager: skip the opacity fade (used by modals / PDP)
 */
export default function SafeImage({
  src,
  alt = '',
  name = '',
  category = '',
  className = '',
  rounded = 'none',
  eager = false,
  ...rest
}) {
  const [failed, setFailed] = useState(false)
  const [loaded, setLoaded] = useState(false)
  const imgRef = useRef(null)

  // Pre-resolve: if the incoming URL is dead/missing, short-circuit so we
  // don't even attempt to load it.
  const srcLooksDead = !src || typeof src !== 'string' || src.trim() === '' || isDeadImageHost(src)

  const showFallback = srcLooksDead || failed

  const fallbackSvg = buildPlaceholderSVG({ name, category })

  // Reset state when src changes so the same component can swap images safely.
  useEffect(() => {
    setFailed(false)
    setLoaded(false)
  }, [src])

  // If image was cached and already complete before our onLoad fires,
  // mark as loaded immediately so we don't show a flash of empty space.
  useEffect(() => {
    const el = imgRef.current
    if (el && el.complete && el.naturalWidth > 0) {
      setLoaded(true)
    }
  }, [src])

  const radiusStyle = (() => {
    switch (rounded) {
      case 'sm':   return { borderRadius: 'var(--radius-sm)' }
      case 'md':   return { borderRadius: 'var(--radius-md)' }
      case 'lg':   return { borderRadius: 'var(--radius-lg)' }
      case 'full': return { borderRadius: 'var(--radius-full)' }
      default:     return {}
    }
  })()

  if (showFallback) {
    return (
      <div
        className={`safe-image-fallback ${className}`}
        style={{ width: '100%', height: '100%', overflow: 'hidden', ...radiusStyle }}
        role="img"
        aria-label={alt || name || 'Product image'}
      >
        <img
          src={fallbackSvg}
          alt=""
          aria-hidden="true"
          style={{
            width: '100%',
            height: '100%',
            display: 'block',
            objectFit: 'cover',
          }}
        />
      </div>
    )
  }

  return (
    <img
      ref={imgRef}
      src={src}
      alt={alt}
      className={`safe-image ${loaded || eager ? 'is-loaded' : ''} ${className}`.trim()}
      onLoad={() => setLoaded(true)}
      onError={() => setFailed(true)}
      style={{
        opacity: loaded || eager ? 1 : 0,
        transition: eager ? 'none' : 'opacity 280ms var(--ease-out)',
        ...radiusStyle,
      }}
      {...rest}
    />
  )
}