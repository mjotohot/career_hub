import { defineStore } from 'pinia'
import { signInWithEmail, signOutUser, getCurrentUser, onAuthStateChanged } from '@/services/auth'
import type { User } from '@supabase/supabase-js'

interface AuthState {
  user: User | null
  loading: boolean
  error: string | null
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: null,
    loading: false,
    error: null,
  }),

  getters: {
    isAuthenticated: (state) => !!state.user,
    userEmail: (state) => state.user?.email ?? null,
  },

  actions: {
    async signIn(email: string, password: string) {
      this.loading = true
      this.error = null
      const { user, error } = await signInWithEmail(email, password)
      if (error) {
        this.error = error
        this.user = null
      } else {
        this.user = user
      }
      this.loading = false
      return !error
    },

    async signOut() {
      this.loading = true
      this.error = null
      const error = await signOutUser()
      if (error) {
        this.error = error
      } else {
        this.user = null
      }
      this.loading = false
    },

    async initialize() {
      this.user = await getCurrentUser()
      onAuthStateChanged((user) => {
        this.user = user
      })
    },
  },
})
