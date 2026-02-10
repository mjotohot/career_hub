import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { useThemeStore } from './stores/usethemeStore'

import App from './App.vue'
import router from './router'
import './assets/css/main.css'
import '@fontsource/roboto'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/700.css'
import '@fontsource/roboto/400-italic.css'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)

const themeStore = useThemeStore()
themeStore.init()

app.mount('#app')
