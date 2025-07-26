// ✅ Import persist middleware
import { create } from "zustand";
import { persist } from "zustand/middleware"; // 🟨 NEW
import axios from "axios";
import api from "@/lib/axios";

interface User {
  id: number;
  name: string;
  email: string;
  role: {
    id: number;
    name: string;
  };
}

interface AuthState {
  user: User | null;
  token: string | null;
  error: string | null;
  fieldErrors: Record<string, string[]>;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (
    name: string,
    email: string,
    password: string,
    role: string
  ) => Promise<void>;
  logout: () => void;
  fetchUser: () => Promise<void>;
}

// ✅ Wrap your store in `persist`
export const useAuthStore = create<AuthState>()(
  persist(
    // 🟨 NEW
    (set, get) => ({
      user: null,
      token: null,
      error: null,
      fieldErrors: {},
      loading: false,

      register: async (name, email, password, role) => {
        set({ loading: true, error: null });
        try {
          const res = await api.post("/register", {
            name,
            email,
            password,
            password_confirmation: password,
            role,
          });
          const { token, user } = res.data;
          axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
          set({ token, user, loading: false });
        } catch {
          set({ error: "Registration failed", loading: false });
        }
      },

      login: async (email, password) => {
        set({ loading: true, error: null, fieldErrors: {} });
        console.log(process.env.NEXT_PUBLIC_API_BASE_URL);
        try {
          const res = await api.post("/login", {
            email,
            password,
          });
          const { token, user } = res.data;
          axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
          set({ token, user, loading: false });
        } catch (error: any) {
          const data = error.response.data;

          if (data.errors) {
            set({ fieldErrors: data.errors, loading: false });
          }
          if (data.message) {
            set({ error: data.message, loading: false });
          }
        }
      },

      logout: () => {
        delete axios.defaults.headers.common["Authorization"];
        set({ user: null, token: null });
      },

      fetchUser: async () => {
        try {
          const res = await api.get("/user");
          set({ user: res.data });
        } catch {
          set({ user: null });
        }
      },
    }),

    // ✅ persist config options
    {
      name: "auth-storage", // 🟨 NEW: localStorage key name
      partialize: (state) => ({
        // 🟨 NEW: Only persist token and user
        token: state.token,
        user: state.user,
      }),
      onRehydrateStorage: () => (state) => {
        // 🟨 NEW: Restore Authorization header
        const token = state?.token;
        if (token) {
          axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        }
      },
    }
  )
);
