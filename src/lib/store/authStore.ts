// ✅ Import persist middleware
import { create } from 'zustand'
import { persist } from 'zustand/middleware' // 🟨 NEW
import axios from 'axios'

interface User {
  id: number
  name: string
  email: string
  role: {
    id: number
    name: string
  }
}

interface AuthState {
  user: User | null
  token: string | null
  error: string | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string, role: string) => Promise<void>
  logout: () => void
  fetchUser: () => Promise<void>
}

// ✅ Wrap your store in `persist`
export const useAuthStore = create<AuthState>()(
  persist( // 🟨 NEW
    (set, get) => ({
      user: null,
      token: null,
      error: null,
      loading: false,

      register: async (name, email, password, role) => {
        set({ loading: true, error: null })
        try {
          const res = await axios.post('http://localhost:8000/api/register', {
            name,
            email,
            password,
            password_confirmation: password,
            role,
          })
          const { token, user } = res.data
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
          set({ token, user, loading: false })
        } catch {
          set({ error: 'Registration failed', loading: false })
        }
      },

      login: async (email, password) => {
        set({ loading: true, error: null })
        try {
          const res = await axios.post('http://localhost:8000/api/login', { email, password })
          const { token, user } = res.data
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
          set({ token, user, loading: false })
        } catch {
          set({ error: 'Invalid credentials', loading: false })
        }
      },

      logout: () => {
        delete axios.defaults.headers.common['Authorization']
        set({ user: null, token: null })
      },

      fetchUser: async () => {
        try {
          const res = await axios.get('http://localhost:8000/api/user')
          set({ user: res.data })
        } catch {
          set({ user: null })
        }
      },
    }),

    // ✅ persist config options
    {
      name: 'auth-storage', // 🟨 NEW: localStorage key name
      partialize: (state) => ({ // 🟨 NEW: Only persist token and user
        token: state.token,
        user: state.user,
      }),
      onRehydrateStorage: () => (state) => { // 🟨 NEW: Restore Authorization header
        const token = state?.token
        if (token) {
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
        }
      },
    }
  )
)
