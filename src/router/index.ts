import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '@/pages/landing/HomePage.vue'
import JobsPage from '@/pages/jobs/JobsPage.vue'
import DashboardPage from '@/pages/hr/DashboardPage.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomePage,
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: DashboardPage,
    },
    {
      path: '/jobs',
      name: 'jobs',
      component: JobsPage,
    },
  ],
})

export default router
