<script lang="ts" setup>
import { ref, watch } from 'vue'
import { getApplicationsByEmail } from '@/services/applicant'
import {
  PhCheckCircle,
  PhXCircle,
  PhClock,
  PhMagnifyingGlass,
  PhArrowLeft,
  PhEnvelope,
  PhBriefcase,
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
    const normalized = (data || []).map((item: any) => {
      const applicant = Array.isArray(item.applicants) ? item.applicants[0] : item.applicants
      const job = Array.isArray(item.jobs) ? item.jobs[0] : item.jobs
      return { ...item, applicants: applicant, jobs: job }
    })
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
  if (e.key === 'Enter') handleSearch()
}

const formatDate = (d: string) =>
  new Date(d).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })

const getStatusConfig = (status: string) => {
  if (status === 'pass')
    return {
      wrapClass: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
      label: 'Passed',
      icon: PhCheckCircle,
    }
  if (status === 'fail')
    return {
      wrapClass: 'bg-rose-50 text-rose-600 border border-rose-200',
      label: 'Not Selected',
      icon: PhXCircle,
    }
  return {
    wrapClass: 'bg-amber-50 text-amber-600 border border-amber-200',
    label: 'Under Review',
    icon: PhClock,
  }
}
</script>

<template>
  <div class="min-h-screen bg-stone-50 relative overflow-x-hidden">
    <!-- Decorative background blobs -->
    <div class="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <div
        class="absolute -top-32 -right-24 w-96 h-96 rounded-full bg-blue-100 opacity-60 blur-3xl"
      />
      <div
        class="absolute bottom-0 -left-24 w-80 h-80 rounded-full bg-violet-100 opacity-40 blur-3xl"
      />
    </div>

    <!-- Nav -->
    <nav class="relative z-10 px-8 pt-6 pb-2">
      <button
        @click="router.back()"
        class="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-900 hover:bg-stone-100 transition-all rounded-lg px-3 py-2"
      >
        <PhArrowLeft :size="15" weight="bold" />
        Back
      </button>
    </nav>

    <!-- Main -->
    <main class="relative z-10 max-w-3xl mx-auto px-4 pb-24 pt-4">
      <!-- Header -->
      <div class="text-center mb-10">
        <div
          class="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gray-900 text-white mb-5 shadow-lg"
        >
          <PhBriefcase :size="26" weight="duotone" />
        </div>
        <h1 class="text-4xl font-bold tracking-tight text-gray-900 mb-2">Application Status</h1>
        <p class="text-gray-400 text-base font-light">
          Enter your email to track your job applications
        </p>
      </div>

      <!-- Search card -->
      <div class="bg-white rounded-2xl border border-stone-200 shadow-sm p-6 mb-5">
        <label
          class="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3"
        >
          <PhEnvelope :size="13" weight="bold" />
          Email Address
        </label>
        <div class="flex gap-2.5 mb-3">
          <input
            v-model="email"
            @keydown="handleKeydown"
            type="email"
            placeholder="you@example.com"
            class="flex-1 px-4 py-3 rounded-xl border border-stone-200 bg-stone-50 text-sm text-gray-900 placeholder-stone-300 outline-none focus:border-gray-900 focus:bg-white focus:ring-2 focus:ring-gray-900/5 transition-all"
          />
          <button
            @click="handleSearch"
            :disabled="!email.trim() || isLoading"
            class="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gray-900 text-white text-sm font-semibold shadow-md hover:bg-gray-700 hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0 disabled:bg-stone-300 disabled:shadow-none disabled:cursor-not-allowed transition-all duration-150 whitespace-nowrap"
          >
            <template v-if="!isLoading">
              <PhMagnifyingGlass :size="15" weight="bold" />
              Search
            </template>
            <template v-else>
              <div
                class="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin"
              />
              Searching…
            </template>
          </button>
        </div>
        <p class="text-xs text-stone-300 font-light">
          Use the email address you provided when applying
        </p>
      </div>

      <!-- Results panel -->
      <div class="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden min-h-52">
        <!-- Loading -->
        <div v-if="isLoading" class="flex flex-col items-center justify-center py-16 gap-4">
          <div
            class="w-9 h-9 rounded-full border-2 border-stone-200 border-t-gray-900 animate-spin"
          />
          <p class="text-sm text-gray-400 font-light">Searching your applications…</p>
        </div>

        <!-- Prompt state -->
        <div v-else-if="!hasSearched" class="flex flex-col items-center justify-center py-16 gap-3">
          <div
            class="w-16 h-16 rounded-2xl bg-stone-100 flex items-center justify-center text-stone-400"
          >
            <PhMagnifyingGlass :size="30" weight="duotone" />
          </div>
          <p class="text-sm font-semibold text-gray-700">Ready to search</p>
          <p class="text-sm text-gray-400 font-light text-center max-w-xs leading-relaxed">
            Enter your email above and we'll pull up all your applications.
          </p>
        </div>

        <!-- No results -->
        <div
          v-else-if="applications.length === 0"
          class="flex flex-col items-center justify-center py-16 gap-3"
        >
          <div
            class="w-16 h-16 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-400"
          >
            <PhEnvelope :size="30" weight="duotone" />
          </div>
          <p class="text-sm font-semibold text-gray-700">No applications found</p>
          <p class="text-sm text-gray-400 font-light text-center max-w-xs leading-relaxed">
            Try a different email, or apply for a position to get started.
          </p>
        </div>

        <!-- Table -->
        <template v-else>
          <div
            class="px-6 pt-5 pb-1 text-xs font-semibold uppercase tracking-widest text-stone-300"
          >
            {{ applications.length }} application{{ applications.length !== 1 ? 's' : '' }} found
          </div>
          <table class="w-full">
            <thead>
              <tr class="border-b border-stone-100">
                <th
                  class="px-6 py-3 text-left text-xs font-semibold uppercase tracking-widest text-stone-300"
                >
                  Position
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-semibold uppercase tracking-widest text-stone-300 hidden sm:table-cell"
                >
                  Campus & Dept.
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-semibold uppercase tracking-widest text-stone-300"
                >
                  Applied
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-semibold uppercase tracking-widest text-stone-300"
                >
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="app in applications"
                :key="app.application_id"
                class="border-b border-stone-50 last:border-none hover:bg-stone-50 transition-colors"
              >
                <td class="px-6 py-4 text-sm font-semibold text-gray-900 max-w-xs truncate">
                  {{ app.jobs?.open_position }}
                </td>
                <td class="px-6 py-4 hidden sm:table-cell">
                  <p class="text-sm text-gray-600">{{ app.jobs?.campus }}</p>
                  <p class="text-xs text-stone-400 font-light mt-0.5">
                    {{ app.jobs?.department_unit }}
                  </p>
                </td>
                <td class="px-6 py-4 text-sm text-stone-400 font-light whitespace-nowrap">
                  {{ formatDate(app.applied_at) }}
                </td>
                <td class="px-6 py-4">
                  <span
                    class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold"
                    :class="getStatusConfig(app.match_status).wrapClass"
                  >
                    <component
                      :is="getStatusConfig(app.match_status).icon"
                      :size="12"
                      weight="bold"
                    />
                    {{ getStatusConfig(app.match_status).label }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </template>
      </div>

      <!-- Legend -->
      <div
        class="mt-5 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-stone-400 font-light"
      >
        <span class="flex items-center gap-1.5">
          <span class="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
          Passed — cleared initial screening
        </span>
        <span class="flex items-center gap-1.5">
          <span class="w-2 h-2 rounded-full bg-amber-400 inline-block" />
          Under Review — awaiting decision
        </span>
        <span class="flex items-center gap-1.5">
          <span class="w-2 h-2 rounded-full bg-rose-400 inline-block" />
          Not Selected — not moving forward
        </span>
      </div>
    </main>
  </div>
</template>
