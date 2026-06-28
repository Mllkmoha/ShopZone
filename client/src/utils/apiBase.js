// Utility to resolve the API base URL safely.
// In development we proxy via `/api`. In production we require VITE_API_URL
// to be set to a public, secure host to avoid browser local-network blocks.
export function getApiBase() {
  const env = import.meta.env
  // Require explicit API base always. Do NOT fallback to /api or localhost.
  if (env.VITE_API_URL && typeof env.VITE_API_URL === 'string' && env.VITE_API_URL.trim() !== '') {
    return env.VITE_API_URL.trim()
  }

  // Fail fast with an exact, searchable message required by the build safety policy.
  const msg = 'Missing VITE_API_URL'
  console.error(msg)
  throw new Error(msg)
}
