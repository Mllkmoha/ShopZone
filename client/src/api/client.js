import { getApiBase } from '../utils/apiBase'

const env = typeof import.meta !== 'undefined' ? import.meta.env : { DEV: false }
// In dev use the Vite dev proxy at `/api`. In production require VITE_API_URL.
const base = env && env.DEV ? '/api' : getApiBase()

function buildUrl(path) {
  const trimmedBase = base.replace(/\/$/, '')
  const p = path == null ? '' : String(path)
  return p.startsWith('/') ? `${trimmedBase}${p}` : `${trimmedBase}/${p}`
}

async function request(method, path, opts = {}) {
  const { signal, params, body, headers } = opts
  let url = buildUrl(path)
  if (params && typeof params === 'object') {
    const usp = new URLSearchParams()
    Object.keys(params).forEach(k => {
      const v = params[k]
      if (v !== undefined && v !== null) usp.append(k, String(v))
    })
    const qs = usp.toString()
    if (qs) url += `?${qs}`
  }

  const init = {
    method,
    headers: { Accept: 'application/json', ...(headers || {}) },
    signal,
  }

  if (body !== undefined) {
    init.headers['Content-Type'] = 'application/json'
    init.body = JSON.stringify(body)
  }

  const res = await fetch(url, init)
  const ct = res.headers.get('content-type') || ''
  let data = null
  if (ct.includes('application/json')) {
    data = await res.json()
  } else {
    data = await res.text()
  }

  if (!res.ok) {
    const err = new Error('Request failed')
    err.status = res.status
    err.data = data
    throw err
  }

  return { data, status: res.status, headers: res.headers, raw: res }
}

const apiClient = {
  get: (path, opts) => request('GET', path, opts),
  post: (path, body, opts) => request('POST', path, { ...(opts || {}), body }),
  put: (path, body, opts) => request('PUT', path, { ...(opts || {}), body }),
  delete: (path, opts) => request('DELETE', path, opts),
  patch: (path, body, opts) => request('PATCH', path, { ...(opts || {}), body }),
}

export { getApiBase }
export default apiClient
