import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useAppStore = create(
  persist(
    (set) => ({
      isOnline: typeof navigator !== 'undefined' ? navigator.onLine : true,
      errors: [],
      pushError: (msg) => set((s) => ({ errors: [...s.errors, msg] })),
      popError: () => set((s) => ({ errors: s.errors.slice(1) })),
      setOnline: (flag) => set({ isOnline: flag }),
    }),
    { name: 'ecosoil-app' }
  )
)

export default useAppStore

