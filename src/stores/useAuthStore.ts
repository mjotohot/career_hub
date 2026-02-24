import { defineStore } from 'pinia'
import { signInWithEmail, signOutUser, getCurrentUser, onAuthStateChanged } from '@/services/auth'
import type { AppUser } from '@/services/auth'

interface AuthState {
  user: AppUser | null
  loading: boolean
  error: string | null
  initialized: boolean
}

let initPromise: Promise<void> | null = null

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: null,
    loading: false,
    error: null,
    initialized: false,
  }),

  getters: {
    isAuthenticated: (state) => !!state.user,
    userEmail: (state) => state.user?.email ?? null,
    isAdmin: (state) => state.user?.is_admin ?? false,
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
      if (!initPromise) {
        initPromise = (async () => {
          this.user = await getCurrentUser()
          onAuthStateChanged((user) => {
            this.user = user
          })
          this.initialized = true
        })()
      }
      return initPromise
    },
  },
})

export async function waitForAuthInit() {
  const authStore = useAuthStore()
  if (!authStore.initialized) {
    await initPromise
  }
}
