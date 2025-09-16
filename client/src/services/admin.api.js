import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE || 'http://localhost:4000'

const adminApi = axios.create({
  baseURL: `${API_BASE_URL}/api/admin`,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Add auth token to requests
adminApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('adminToken')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Handle auth errors
adminApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('adminToken')
      window.location.href = '/admin/login'
    }
    return Promise.reject(error)
  }
)

// Auth API
const authApi = axios.create({
  baseURL: `${API_BASE_URL}/api/auth`,
  headers: {
    'Content-Type': 'application/json'
  }
})

export const adminApiService = {
  // Authentication
  login: async (credentials) => {
    const { data } = await authApi.post('/login', credentials)
    return data
  },

  // Orders
  getOrders: async (params = {}) => {
    const { data } = await adminApi.get('/orders', { params })
    return data
  },

  updateOrderStatus: async (orderId, statusData) => {
    const { data } = await adminApi.put(`/orders/${orderId}/status`, statusData)
    return data
  },

  getOrderStats: async () => {
    const { data } = await adminApi.get('/orders/stats')
    return data
  },

  // Users (future)
  getUsers: async () => {
    const { data } = await adminApi.get('/users')
    return data
  }
}

export { adminApi }
