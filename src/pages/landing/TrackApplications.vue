<script lang="ts" setup>
import { ref, watch } from 'vue'
import { getApplicationsByEmail } from '@/services/applicant'
import {
  PhCheckCircle,
  PhXCircle,
  PhClock,
  PhMagnifyingGlass,
  PhArrowLeft,
} from '@phosphor-icons/vue'
import { useRouter } from 'vue-router'
import type { ApplicationResult } from '@/types/applicationResult'

const router = useRouter()

const email = ref('')
const applications = ref<ApplicationResult[]>([])
const isLoading = ref(false)
const hasSearched = ref(false)

const handleSearch = async () => {
  if (!email.value.trim()) return
  isLoading.value = true
  hasSearched.value = true
  try {
    const data = await getApplicationsByEmail(email.value.trim())

    // Normalize relationships to single objects
    const normalized = (data || []).map((item: any) => {
      const applicant = Array.isArray(item.applicants) ? item.applicants[0] : item.applicants
      const job = Array.isArray(item.jobs) ? item.jobs[0] : item.jobs
      return { ...item, applicants: applicant, jobs: job }
    })

    // Exact-email filter
    const lower = email.value.trim().toLowerCase()
    applications.value = normalized.filter((item: any) => {
      const a = item.applicants?.email
      return (a || '').toLowerCase() === lower
    })
  } catch (error) {
    console.error('Error fetching applications:', error)
    applications.value = []
  } finally {
    isLoading.value = false
  }
}

watch(email, (val) => {
  if (!val || !val.trim()) {
    applications.value = []
    hasSearched.value = false
  }
})

const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Enter') {
    handleSearch()
  }
}

const formatDate = (d: string) =>
  new Date(d).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })

const getStatusBadge = (status: string) => {
  if (status === 'pass')
    return {
      bg: 'bg-emerald-100',
      text: 'text-emerald-600',
      label: 'Passed',
      icon: PhCheckCircle,
    }
  if (status === 'fail')
    return {
      bg: 'bg-red-100',
      text: 'text-red-600',
      label: 'Failed',
      icon: PhXCircle,
    }
  return {
    bg: 'bg-amber-100',
    text: 'text-amber-600',
    label: 'Pending',
    icon: PhClock,
  }
}
</script>

<template>
  <div class="min-h-screen bg-linear-to-br from-blue-50 to-indigo-50">
    <div class="p-4 px-8">
      <button
        @click="router.back()"
        class="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
      >
        <PhArrowLeft :size="18" weight="bold" />
        Back
      </button>
    </div>

    <div class="max-w-4xl mx-auto px-4">
      <div class="text-center mb-12">
        <h1 class="text-4xl font-bold text-gray-900 tracking-tight mb-2">Track Your Application</h1>
        <p class="text-gray-500 text-lg">
          Enter your email to check the status of your job applications
        </p>
      </div>
      <div class="bg-white rounded-2xl border border-stone-200 p-8 mb-8 shadow-sm">
        <div class="flex gap-3 mb-4">
          <div class="flex-1 relative">
            <PhMagnifyingGlass
              :size="20"
              weight="bold"
              class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
            />
            <input
              v-model="email"
              @keydown="handleKeydown"
              type="email"
              placeholder="Enter your email address..."
              class="w-full pl-12 pr-4 py-3 border border-stone-200 rounded-lg bg-white text-base text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>
          <button
            @click="handleSearch"
            :disabled="!email.trim() || isLoading"
            class="px-8 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white font-medium rounded-lg transition-colors duration-200"
          >
            <span v-if="!isLoading">Search</span>
            <span v-else class="flex items-center gap-2">
              <div
                class="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"
              />
              Searching...
            </span>
          </button>
        </div>
        <p class="text-xs text-gray-500">Use the email address you provided when applying</p>
      </div>

      <div class="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-sm">
        <div v-if="isLoading" class="flex items-center justify-center py-16">
          <div class="flex flex-col items-center gap-4">
            <div
              class="animate-spin w-8 h-8 border-3 border-blue-500 border-t-transparent rounded-full"
            ></div>
            <p class="text-gray-500">Searching for your applications...</p>
          </div>
        </div>
        <div v-else-if="!hasSearched" class="flex items-center justify-center py-16">
          <div class="text-center text-gray-400">
            <PhMagnifyingGlass :size="48" weight="thin" class="mx-auto mb-4 text-gray-300" />
            <p class="text-lg font-medium text-gray-600">Enter your email to get started</p>
            <p class="text-sm mt-2">
              We'll show you all your applications and their current status
            </p>
          </div>
        </div>
        <div v-else-if="applications.length === 0" class="flex items-center justify-center py-16">
          <div class="text-center text-gray-400">
            <p class="text-lg font-medium text-gray-600">No applications found</p>
            <p class="text-sm mt-2">
              Try a different email address or apply for a job to get started
            </p>
          </div>
        </div>

        <table v-else class="w-full">
          <thead>
            <tr class="border-b border-stone-100 bg-stone-50">
              <th
                class="px-6 py-4 text-left text-[10px] uppercase tracking-widest font-semibold text-gray-400"
              >
                Position
              </th>
              <th
                class="px-6 py-4 text-left text-[10px] uppercase tracking-widest font-semibold text-gray-400"
              >
                Campus & Department
              </th>
              <th
                class="px-6 py-4 text-left text-[10px] uppercase tracking-widest font-semibold text-gray-400"
              >
                Applied Date
              </th>
              <th
                class="px-6 py-4 text-left text-[10px] uppercase tracking-widest font-semibold text-gray-400"
              >
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="app in applications"
              :key="app.application_id"
              class="border-b border-stone-100 hover:bg-stone-50 transition-colors"
            >
              <td class="px-6 py-4 text-sm font-medium text-gray-900">
                {{ app.jobs?.open_position }}
              </td>
              <td class="px-6 py-4 text-sm text-gray-600">
                <div>{{ app.jobs?.campus }}</div>
                <div class="text-xs text-gray-400">{{ app.jobs?.department_unit }}</div>
              </td>
              <td class="px-6 py-4 text-sm text-gray-500">
                {{ formatDate(app.applied_at) }}
              </td>
              <td class="px-6 py-4">
                <div
                  class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium"
                  :class="[
                    getStatusBadge(app.match_status).bg,
                    getStatusBadge(app.match_status).text,
                  ]"
                >
                  <component :is="getStatusBadge(app.match_status).icon" :size="14" weight="bold" />
                  {{ getStatusBadge(app.match_status).label }}
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p class="text-sm text-blue-900">
          <span class="font-semibold">Status Guide:</span> Passed = You've passed initial screening,
          Failed = Not selected at this stage
        </p>
      </div>
    </div>
  </div>
</template>
