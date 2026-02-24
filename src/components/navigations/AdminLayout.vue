<script setup lang="ts">
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/useAuthStore'
import AppConfirmModal from '@/components/modals/AppConfirmModal.vue'
import csuLogo from '@/assets/images/logo.png'
import navImage from '@/assets/images/navbar.svg'
import { PhList, PhX, PhSquaresFour, PhBriefcase, PhFileText, PhSignOut } from '@phosphor-icons/vue'

const sidebarOpen = ref(true)
const showLogoutConfirm = ref(false)
const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const navigationItems = [
  { name: 'Dashboard', href: '/admin/dashboard', icon: PhSquaresFour },
  { name: 'Jobs & Applicants', href: '/admin/jobs', icon: PhBriefcase },
  { name: 'Applications', href: '/admin/applications', icon: PhFileText },
]

function isActive(href: string): boolean {
  return href === '/admin' ? route.path === '/admin' : route.path.startsWith(href)
}

const time = ref(new Date().toLocaleTimeString())
setInterval(() => {
  time.value = new Date().toLocaleTimeString()
}, 1000)

const formatDate = (d: string) =>
  new Date(d).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })

const handleLogout = () => {
  authStore.signOut()
  router.push('/')
  showLogoutConfirm.value = false
}
</script>

<template>
  <div class="flex h-screen bg-gray-50">
    <aside
      :class="[
        'fixed left-0 top-0 z-40 flex h-screen flex-col border-r border-white/10 bg-[#003300] text-white transition-all duration-300',
        sidebarOpen ? 'w-64' : 'w-20',
      ]"
    >
      <div
        class="relative flex min-h-18 items-center justify-between border-b-2 border-[#ff9900] px-6"
        :style="{
          backgroundImage: `url(${navImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }"
      >
        <div class="absolute inset-0 z-0 bg-[#003300]/80 pointer-events-none"></div>

        <div v-if="sidebarOpen" class="relative z-10 flex items-center">
          <div class="flex h-full items-center rounded-sm bg-white px-4">
            <img :src="csuLogo" class="h-12 w-auto" />
          </div>
        </div>

        <button
          @click="sidebarOpen = !sidebarOpen"
          class="relative z-10 flex h-8 w-8 items-center justify-center rounded-lg transition hover:bg-white/15"
        >
          <PhX v-if="sidebarOpen" class="h-5 w-5" />
          <PhList v-else class="h-5 w-5" />
        </button>
      </div>

      <nav class="z-10 flex flex-1 flex-col gap-2 overflow-hidden p-4">
        <router-link
          v-for="item in navigationItems"
          :key="item.href"
          :to="item.href"
          :class="[
            'flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-white/70 transition',
            'hover:bg-white/10 hover:text-white',
            isActive(item.href) && 'bg-white/20 text-white',
          ]"
        >
          <component :is="item.icon" class="h-5 w-5 shrink-0" />
          <span v-if="sidebarOpen" class="truncate">
            {{ item.name }}
          </span>
        </router-link>
      </nav>

      <div class="border-t-2 border-[#ff9900] p-4">
        <button
          @click="showLogoutConfirm = true"
          class="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-white/70 transition hover:bg-white/10 hover:text-white w-full"
        >
          <PhSignOut class="h-5 w-5 shrink-0" />
          <span v-if="sidebarOpen">Logout</span>
        </button>
      </div>
    </aside>

    <main
      :class="[
        'flex flex-1 flex-col overflow-auto transition-all duration-300',
        sidebarOpen ? 'ml-64' : 'ml-20',
      ]"
    >
      <div
        class="sticky top-0 z-30 flex items-center justify-between border-b border-gray-300 bg-white px-8 py-4"
      >
        <h1 class="text-md font-bold">{{ formatDate(new Date().toISOString()) }} | {{ time }}</h1>

        <div class="flex items-center gap-4">
          <div
            class="flex h-10 w-10 items-center justify-center rounded-full bg-[#ff9900] text-sm font-semibold text-white"
          >
            HR
          </div>
          <span class="text-sm">Admin</span>
        </div>
      </div>

      <div class="bg-base-200 p-8">
        <slot></slot>
      </div>
    </main>

    <AppConfirmModal
      :isOpen="showLogoutConfirm"
      title="Logout Confirmation"
      message="Are you sure you want to logout? You will be redirected to the home page."
      confirmLabel="Logout"
      cancelLabel="Cancel"
      @confirm="handleLogout"
      @cancel="showLogoutConfirm = false"
    />
  </div>
</template>
