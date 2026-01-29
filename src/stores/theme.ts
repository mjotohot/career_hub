import { defineStore } from 'pinia'

export const useThemeStore = defineStore('theme', {
  state: () => ({
    theme: 'light',
  }),

  actions: {
    setTheme(name) {
      this.theme = name
      document.documentElement.setAttribute('data-theme', name)
      localStorage.setItem('theme', name)
    },

    init() {
      const saved = localStorage.getItem('theme')
      if (saved) {
        this.theme = saved
        document.documentElement.setAttribute('data-theme', saved)
      }
    },
  },
})
