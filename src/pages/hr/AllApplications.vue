<script lang="ts" setup>
import AdminLayout from '@/components/navigations/AdminLayout.vue'
import { getAllApplications } from '@/services/applicant'
import { ref, onMounted, computed } from 'vue'
import { PhCheckCircle, PhXCircle, PhClock, PhMagnifyingGlass } from '@phosphor-icons/vue'

interface Application {
  application_id: string
  applied_at: string
  pds_file: string
  wes_file: string
  match_status: string
  job_id: string
  applicants: {
    applicant_id: string
    full_name: string
    email: string
  }
  jobs: {
    job_id: string
    open_position: string
    campus: string
    department_unit: string
  }
}

// STATE
const applications = ref<Application[]>([])
const statusFilter = ref<'all' | 'pass' | 'fail'>('all')
const searchQuery = ref('')
const isLoading = ref(false)

// COMPUTED
const filteredApplications = computed(() => applications.value)

const stats = computed(() => {
  const total = applications.value.length
  const passed = applications.value.filter((app) => app.match_status === 'pass').length
  const failed = applications.value.filter((app) => app.match_status === 'fail').length
  return { total, passed, failed }
})

// FETCH DATA
onMounted(async () => {
  await fetchApplications()
})

const fetchApplications = async (query?: string, status?: string) => {
  isLoading.value = true
  try {
    const data = await getAllApplications(
      (status || statusFilter.value) as 'all' | 'pass' | 'fail',
      query || searchQuery.value,
    )
    applications.value = Array.isArray(data) ? data : []
  } catch (error) {
    console.error('Error fetching applications:', error)
    applications.value = []
  } finally {
    isLoading.value = false
  }
}

// Debounced search
let searchTimeout: ReturnType<typeof setTimeout>
const handleSearch = (query: string) => {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    fetchApplications(query, statusFilter.value)
  }, 500)
}

// Handle status filter change
const handleStatusChange = (status: 'all' | 'pass' | 'fail') => {
  statusFilter.value = status
  fetchApplications(searchQuery.value, status)
}

// HELPERS
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
    bg: 'bg-gray-100',
    text: 'text-gray-600',
    label: 'Pending',
    icon: PhClock,
  }
}
</script>

<template>
  <AdminLayout>
    <div class="min-h-screen">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900 tracking-tight leading-none">
          All Applications
        </h1>
        <p class="mt-1.5 text-xs text-gray-400 tracking-wide">
          {{ stats.total }} total applications
        </p>
      </div>

      <!-- Stats -->
      <div class="mb-6 grid grid-cols-3 gap-4">
        <div class="bg-white rounded-lg border border-stone-200 p-4">
          <div class="text-xs text-gray-400 uppercase tracking-widest">Total Applications</div>
          <div class="text-2xl font-bold text-gray-900 mt-1">{{ stats.total }}</div>
        </div>
        <div class="bg-white rounded-lg border border-stone-200 p-4">
          <div class="text-xs text-gray-400 uppercase tracking-widest">Passed</div>
          <div class="text-2xl font-bold text-emerald-600 mt-1">{{ stats.passed }}</div>
        </div>
        <div class="bg-white rounded-lg border border-stone-200 p-4">
          <div class="text-xs text-gray-400 uppercase tracking-widest">Failed</div>
          <div class="text-2xl font-bold text-red-600 mt-1">{{ stats.failed }}</div>
        </div>
      </div>

      <!-- Search Bar -->
      <div class="mb-6 relative">
        <PhMagnifyingGlass
          :size="18"
          weight="bold"
          class="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
        />
        <input
          :value="searchQuery"
          @input="
            (e) => {
              searchQuery = (e.target as HTMLInputElement).value
              handleSearch(searchQuery)
            }
          "
          :disabled="isLoading"
          type="text"
          placeholder="Search by applicant name, email, position, or campus..."
          class="w-full pl-10 pr-4 py-2.5 border border-stone-200 rounded-lg bg-white text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:opacity-50"
        />
        <div v-if="isLoading" class="absolute right-3.5 top-1/2 -translate-y-1/2">
          <div
            class="animate-spin w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full"
          />
        </div>
      </div>

      <!-- Status Filter -->
      <div class="mb-6 flex gap-2">
        <button
          @click="handleStatusChange('all')"
          :class="[
            'px-4 py-2 rounded-lg text-sm font-medium transition-all border',
            statusFilter === 'all'
              ? 'bg-blue-600 text-white border-blue-600'
              : 'bg-white text-gray-700 border-stone-200 hover:border-stone-300',
          ]"
          :disabled="isLoading"
        >
          All
        </button>
        <button
          @click="handleStatusChange('pass')"
          :class="[
            'px-4 py-2 rounded-lg text-sm font-medium transition-all border',
            statusFilter === 'pass'
              ? 'bg-emerald-600 text-white border-emerald-600'
              : 'bg-white text-gray-700 border-stone-200 hover:border-stone-300',
          ]"
          :disabled="isLoading"
        >
          Passed
        </button>
        <button
          @click="handleStatusChange('fail')"
          :class="[
            'px-4 py-2 rounded-lg text-sm font-medium transition-all border',
            statusFilter === 'fail'
              ? 'bg-red-600 text-white border-red-600'
              : 'bg-white text-gray-700 border-stone-200 hover:border-stone-300',
          ]"
          :disabled="isLoading"
        >
          Failed
        </button>
      </div>

      <!-- Table -->
      <div class="bg-white rounded-lg border border-stone-200 overflow-hidden">
        <!-- Loading state -->
        <div v-if="isLoading" class="flex items-center justify-center py-12">
          <div class="flex items-center gap-3 text-gray-500">
            <div
              class="animate-spin w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full"
            />
            <span class="text-sm">Loading applications...</span>
          </div>
        </div>

        <!-- Empty state -->
        <div
          v-else-if="filteredApplications.length === 0"
          class="flex items-center justify-center py-12"
        >
          <div class="text-center text-gray-400">
            <p class="text-sm font-medium text-gray-600">No applications found</p>
            <p class="text-xs mt-1">Try a different filter</p>
          </div>
        </div>

        <!-- Table -->
        <table v-else class="w-full">
          <thead>
            <tr class="border-b border-stone-100 bg-stone-50">
              <th
                class="px-6 py-3 text-left text-[10px] uppercase tracking-widest font-semibold text-gray-400"
              >
                Applicant
              </th>
              <th
                class="px-6 py-3 text-left text-[10px] uppercase tracking-widest font-semibold text-gray-400"
              >
                Email
              </th>
              <th
                class="px-6 py-3 text-left text-[10px] uppercase tracking-widest font-semibold text-gray-400"
              >
                Position
              </th>
              <th
                class="px-6 py-3 text-left text-[10px] uppercase tracking-widest font-semibold text-gray-400"
              >
                Campus & Department
              </th>
              <th
                class="px-6 py-3 text-left text-[10px] uppercase tracking-widest font-semibold text-gray-400"
              >
                Applied Date
              </th>
              <th
                class="px-6 py-3 text-left text-[10px] uppercase tracking-widest font-semibold text-gray-400"
              >
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="app in filteredApplications"
              :key="app.application_id"
              class="border-b border-stone-100 hover:bg-stone-50 transition-colors"
            >
              <td class="px-6 py-4 text-sm font-medium text-gray-900">
                {{ app.applicants?.full_name }}
              </td>
              <td class="px-6 py-4 text-sm text-gray-600">
                {{ app.applicants?.email }}
              </td>
              <td class="px-6 py-4 text-sm text-gray-900 font-medium">
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
    </div>
  </AdminLayout>
</template>
