import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '@/pages/landing/HomePage.vue'
import JobsPage from '@/pages/jobs/JobsPage.vue'
import DashboardPage from '@/pages/hr/DashboardPage.vue'
import JobApplications from '@/pages/hr/JobApplications.vue'
import AllApplications from '@/pages/hr/AllApplications.vue'
import TrackApplications from '@/pages/landing/TrackApplications.vue'
import { useAuthStore, waitForAuthInit } from '@/stores/useAuthStore'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomePage,
    },
    {
      path: '/admin/dashboard',
      name: 'dashboard',
      component: DashboardPage,
      meta: { requiresAdmin: true },
    },
    {
      path: '/admin/jobs',
      name: 'applications',
      component: JobApplications,
      meta: { requiresAdmin: true },
    },
    {
      path: '/admin/applications',
      name: 'all-applications',
      component: AllApplications,
      meta: { requiresAdmin: true },
    },
    {
      path: '/jobs',
      name: 'jobs',
      component: JobsPage,
    },
    {
      path: '/track',
      name: 'track',
      component: TrackApplications,
    },
  ],
})

// Route guard
router.beforeEach(async (to, _from, next) => {
  // Wait for auth to initialize before checking protected routes
  await waitForAuthInit()

  const authStore = useAuthStore()

  if (to.meta.requiresAdmin) {
    if (authStore.isAdmin) {
      next()
    } else {
      next('/')
    }
  } else {
    next()
  }
})

export default router
