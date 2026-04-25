import axios from 'axios'

const BASE_URL = 'http://172.16.9.23:8080/'

const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// ── Request interceptor ──────────────────────────────────────────────────────
// Attach the Bearer token from localStorage on every request
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('pc_auth_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// ── Response interceptor ─────────────────────────────────────────────────────
// Normalize errors and handle 401 (token expired / invalid) globally
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const { status } = error.response

      // Token is missing or invalid — clear session and redirect to login
      if (status === 401) {
        localStorage.removeItem('pc_auth_token')
        localStorage.removeItem('pc_auth_user')
        // Avoid redirect loops when already on /login
        if (window.location.pathname !== '/login') {
          window.location.href = '/login'
        }
      }

      // Attach a human-readable message so callers don't have to dig into
      // error.response.data themselves
      const serverMessage =
        error.response.data?.message ||
        error.response.data?.error ||
        error.response.data?.detail ||
        `Request failed with status ${status}`
      error.message = serverMessage
    } else if (error.request) {
      // Request was made but no response received (network issue / server down)
      error.message = 'Unable to reach the server. Check your network connection.'
    }

    return Promise.reject(error)
  }
)

export default apiClient
