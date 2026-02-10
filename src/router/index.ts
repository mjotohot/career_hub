import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '@/pages/landing/HomePage.vue'
import JobsPage from '@/pages/jobs/JobsPage.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomePage,
    },
    {
      path: '/jobs',
      name: 'jobs',
      component: JobsPage,
    },
  ],
})

export default router
