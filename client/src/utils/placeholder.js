// Generates a self-contained SVG data URL that can stand in for any product
// image. We use it as a *primary* placeholder (so broken hosts like
// via.placeholder.com never break the UI) and also as a fallback when an
// image fails to load.
//
// The SVG is purely inline — no network needed — and uses the product name
// to seed a soft gradient so each card looks distinct.

const PALETTES = [
  ['#1f1f1f', '#3d3a36'],
  ['#2a5b3e', '#ecf3ee'],
  ['#b85c38', '#e8d5c4'],
  ['#1e3a5f', '#cfd8e3'],
  ['#6b3e8e', '#e6dcf0'],
  ['#d4a574', '#f0e4d0'],
  ['#0a0a0a', '#9a958c'],
  ['#3d3a36', '#d8d4ca'],
]

// Hosts we know don't return real product photos. Anything matching these
// will be skipped in favor of our generated placeholder.
const DEAD_HOSTS = [
  'via.placeholder.com',
  'placeholder.com',
  'placehold.it',
  'dummyimage.com',
  'placeimg.com',
  'fakeimg.pl',
  'placehold.co',
]

export function isDeadImageHost(url) {
  if (!url || typeof url !== 'string') return true
  try {
    const host = new URL(url).hostname.toLowerCase()
    return DEAD_HOSTS.some(h => host === h || host.endsWith(`.${h}`))
  } catch {
    return true
  }
}

function hashString(s = '') {
  let h = 0
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0
  return h
}

function pickPalette(seed) {
  return PALETTES[hashString(seed) % PALETTES.length]
}

function pickEmoji(category = '') {
  const c = category.toLowerCase()
  if (c.includes('shoe') || c.includes('sneaker') || c.includes('footwear')) return '👟'
  if (c.includes('cloth') || c.includes('shirt') || c.includes('hoodie') || c.includes('apparel')) return '👕'
  if (c.includes('headphone') || c.includes('audio') || c.includes('speaker')) return '🎧'
  if (c.includes('watch')) return '⌚'
  if (c.includes('bag') || c.includes('backpack')) return '👜'
  if (c.includes('book')) return '📚'
  if (c.includes('phone') || c.includes('mobile')) return '📱'
  if (c.includes('laptop') || c.includes('computer')) return '💻'
  if (c.includes('camera')) return '📷'
  if (c.includes('beauty') || c.includes('cosmetic')) return '💄'
  if (c.includes('home') || c.includes('decor')) return '🏠'
  if (c.includes('kitchen') || c.includes('cook')) return '🍳'
  if (c.includes('food') || c.includes('grocery')) return '🍎'
  if (c.includes('toy') || c.includes('game')) return '🎮'
  if (c.includes('sport') || c.includes('fitness')) return '🏃'
  return '✦'
}

/**
 * Build an SVG placeholder for a product.
 * Returns a data: URL safe to use as <img src=…>.
 */
export function buildPlaceholderSVG({ name = '', category = '', width = 600, height = 750 } = {}) {
  const [a, b] = pickPalette(name + category)
  const initial = (name || category || 'S').trim().charAt(0).toUpperCase() || 'S'
  const emoji = pickEmoji(category)
  const fontSize = Math.round(Math.min(width, height) * 0.22)
  const subFontSize = Math.round(fontSize * 0.32)

  // SVG with two-stop gradient + soft noise pattern. Fully self-contained.
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${a}"/>
      <stop offset="100%" stop-color="${b}"/>
    </linearGradient>
    <radialGradient id="hl" cx="30%" cy="20%" r="60%">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0.18"/>
      <stop offset="100%" stop-color="#ffffff" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="100%" height="100%" fill="url(#g)"/>
  <rect width="100%" height="100%" fill="url(#hl)"/>
  <g font-family="Inter, system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif" text-anchor="middle">
    <text x="50%" y="46%" font-size="${fontSize * 2.4}" font-weight="800" fill="#ffffff" fill-opacity="0.18" letter-spacing="-0.05em">${escapeXml(initial)}</text>
    <text x="50%" y="62%" font-size="${fontSize}" font-weight="600" fill="#ffffff" fill-opacity="0.92">${escapeXml(emoji)}</text>
    <text x="50%" y="80%" font-size="${subFontSize}" font-weight="600" fill="#ffffff" fill-opacity="0.7" letter-spacing="0.18em">SHOPZONE</text>
  </g>
</svg>`

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`
}

function escapeXml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

/**
 * Resolve the best image URL for a product.
 * - Skips known-dead hosts (via.placeholder.com etc.) entirely.
 * - Returns the original src if it looks trustworthy.
 * - Returns a generated data: SVG if the original is missing/dead.
 */
export function resolveImageSrc(product) {
  if (!product) return buildPlaceholderSVG({ name: '', category: '' })
  const raw = typeof product.image === 'string' ? product.image.trim() : ''
  if (!raw || isDeadImageHost(raw)) {
    return buildPlaceholderSVG({ name: product.name, category: product.category })
  }
  return raw
}