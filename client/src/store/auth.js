import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { getMe, loginUser, registerUser } from '../services/api'

const useAuthStore = create(
  persist(
    (set, get) => ({
      token: null,
      user: null,
      loading: false,
      error: null,
      setToken: (token) => set({ token }),
      setUser: (user) => set({ user }),
      logout: () => set({ token: null, user: null }),
      loadMe: async () => {
        const token = get().token
        if (!token) return
        try {
          const me = await getMe()
          set({ user: me })
        } catch (e) {
          set({ token: null, user: null })
        }
      },
      login: async (payload) => {
        set({ loading: true, error: null })
        try {
          const res = await loginUser(payload)
          set({ token: res.token, user: res.user, loading: false })
          return res
        } catch (e) {
          console.error('Login error in store:', e)
          const errorMessage = e.response?.data?.error || e.message || 'Login failed'
          set({ loading: false, error: errorMessage })
          throw e
        }
      },
      register: async (payload) => {
        set({ loading: true, error: null })
        try {
          const res = await registerUser(payload)
          set({ token: res.token, user: res.user, loading: false })
          return res
        } catch (e) {
          console.error('Register error in store:', e)
          const errorMessage = e.response?.data?.error || e.message || 'Registration failed'
          set({ loading: false, error: errorMessage })
          throw e
        }
      },
    }),
    { name: 'ecosoil-auth' }
  )
)

export default useAuthStore

