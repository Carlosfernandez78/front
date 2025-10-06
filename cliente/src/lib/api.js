export const API_BASE_URL = (import.meta.env && import.meta.env.VITE_API_URL) || '/api'

function getAuthToken() {
  try {
    return localStorage.getItem('authToken') || ''
  } catch {
    return ''
  }
}

async function apiFetch(path, options = {}) {
  const url = path.startsWith('http') ? path : `${API_BASE_URL}${path}`
  const headers = new Headers(options.headers || {})
  if (!headers.has('Content-Type') && options.body && typeof options.body === 'object' && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json')
  }
  const token = getAuthToken()
  if (token && !headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${token}`)
  }
  const response = await fetch(url, {
    ...options,
    headers,
    body: options.body && headers.get('Content-Type') === 'application/json' ? JSON.stringify(options.body) : options.body,
  })
  const isJson = (response.headers.get('content-type') || '').includes('application/json')
  const data = isJson ? await response.json().catch(() => null) : await response.text().catch(() => null)
  if (!response.ok) {
    let message = response.statusText
    if (data && typeof data === 'object') {
      message = data.message || data.mensaje || message
    }
    const error = new Error(message || 'Error de red')
    error.status = response.status
    error.data = data
    if (response.status === 401) {
      try {
        localStorage.removeItem('authToken')
        localStorage.removeItem('authRole')
        window.dispatchEvent(new Event('authChanged'))
      } catch {}
    }
    throw error
  }
  return data
}

export function get(path, options = {}) {
  return apiFetch(path, { ...options, method: 'GET' })
}

export function post(path, body, options = {}) {
  return apiFetch(path, { ...options, method: 'POST', body })
}

export function put(path, body, options = {}) {
  return apiFetch(path, { ...options, method: 'PUT', body })
}

export function del(path, options = {}) {
  return apiFetch(path, { ...options, method: 'DELETE' })
}
