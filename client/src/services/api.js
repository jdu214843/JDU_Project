import axios from 'axios'
import useAuthStore from '../store/auth'
import useAppStore from '../store/app'

const apiBase = import.meta.env.VITE_API_BASE || 'http://localhost:4000'

export const api = axios.create({
  baseURL: `${apiBase}/api`,
})

// Attach token from Zustand store
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (res) => res,
  (error) => {
    const pushError = useAppStore.getState().pushError
    if (!error.response) {
      pushError('Cannot connect to the server. Please try again.')
    } else if (error.response?.data?.error) {
      // Surface server-provided error in a friendly snackbar
      pushError(error.response.data.error)
    }
    return Promise.reject(error)
  }
)

// Auth
export async function registerUser({ fullName, email, password }) {
  const { data } = await api.post('/auth/register', { fullName, email, password })
  return data
}

export async function loginUser({ email, password }) {
  const { data } = await api.post('/auth/login', { email, password })
  return data
}

export async function getMe() {
  const { data } = await api.get('/users/me')
  return data
}

export async function updateMe(payload) {
  const { data } = await api.put('/users/me', payload)
  return data
}

export async function updateSettings(settings) {
  const { data } = await api.put('/users/me/settings', { settings })
  return data
}

export async function downloadMyData() {
  const res = await api.post('/users/me/download-data', {}, { responseType: 'blob' })
  return res.data
}

export async function deleteMe() {
  const { data } = await api.delete('/users/me')
  return data
}

// Analyses
export async function submitAnalysis(formData) {
  const { data } = await api.post('/analyses', formData, { headers: { 'Content-Type': 'multipart/form-data' } })
  return data
}

export async function listAnalyses() {
  const { data } = await api.get('/analyses')
  return data
}

export async function getAnalysis(id) {
  const { data } = await api.get(`/analyses/${id}`)
  return data
}

export async function getShareInfo(id) {
  const { data } = await api.get(`/analyses/${id}/share`)
  return data
}

export async function setShareEnabled(id, enable) {
  const { data } = await api.post(`/analyses/${id}/share`, { enable })
  return data
}

export async function downloadAnalysisPdf(id) {
  const res = await api.get(`/analyses/${id}/report.pdf`, { responseType: 'blob' })
  return res.data
}

// Public share
export async function getPublicAnalysis(id, token) {
  const { data } = await api.get(`/public/analyses/${id}`, { params: { token } })
  return data
}

// Orders
export async function createOrder(payload) {
  const { data } = await api.post('/orders', payload)
  return data
}

export async function getAnalysisHistory(id) {
  const { data } = await api.get(`/analyses/${id}/history`)
  return data
}

export function openProgressSSE(id) {
  const token = useAuthStore.getState().token
  const base = import.meta.env.VITE_API_BASE || 'http://localhost:4000'
  const url = `${base}/api/analyses/${id}/progress?token=${encodeURIComponent(token || '')}`
  return new EventSource(url)
}
