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
import bgImage from '@/assets/images/csu1.jpg'
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
      label: 'Failed',
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
    <div
      class="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      :style="{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }"
    >
      <div class="absolute inset-0 bg-[#003300]/75 pointer-events-none"></div>
    </div>
    <nav class="relative z-10 px-8 pt-6">
      <button
        @click="router.back()"
        class="inline-flex items-center gap-2 text-sm font-medium text-white hover:text-gray-900 hover:bg-stone-100 transition-all rounded-lg px-3 py-2"
      >
        <PhArrowLeft :size="15" weight="bold" />
        Back
      </button>
    </nav>
    <main class="relative z-10 max-w-3xl mx-auto px-4 pb-24">
      <div class="text-center mb-10">
        <div
          class="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#ff9900] text-white mb-5 shadow-lg"
        >
          <PhBriefcase :size="26" weight="duotone" />
        </div>
        <h1 class="text-4xl font-bold tracking-tight text-white mb-2">Application Status</h1>
        <p class="text-gray-300 text-base font-light">
          Enter your email to track your job applications
        </p>
      </div>
      <div class="bg-base-300 rounded-2xl border border-stone-200 shadow-sm p-6 mb-5">
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
            class="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#003300] text-white text-sm font-semibold shadow-md hover:bg-gray-700 hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0 disabled:bg-stone-300 disabled:shadow-none disabled:cursor-not-allowed transition-all duration-150 whitespace-nowrap"
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
        <p class="text-xs text-gray-400 font-light italic">
          *Use the email address you provided when applying
        </p>
      </div>
      <div
        class="bg-gray-200 rounded-2xl border border-stone-200 shadow-sm overflow-hidden min-h-52"
      >
        <div v-if="isLoading" class="flex flex-col items-center justify-center py-16 gap-4">
          <div
            class="w-9 h-9 rounded-full border-2 border-stone-200 border-t-gray-900 animate-spin"
          ></div>
          <p class="text-sm text-gray-400 font-light">Searching your applications…</p>
        </div>
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
        <template v-else>
          <div class="px-6 pt-5 pb-3 text-xs font-semibold uppercase tracking-widest text-gray-500">
            {{ applications.length }} application{{ applications.length !== 1 ? 's' : '' }} found
          </div>
          <table class="w-full">
            <thead>
              <tr class="border-b border-stone-100">
                <th
                  class="px-6 py-3 text-left text-xs font-semibold uppercase tracking-widest italic text-gray-400"
                >
                  Position
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-semibold uppercase tracking-widest italic text-gray-400 hidden sm:table-cell"
                >
                  Campus & Dept.
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-semibold uppercase tracking-widest italic text-gray-400"
                >
                  Applied
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-semibold uppercase tracking-widest italic text-gray-400"
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
      <div
        class="mt-5 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm italic text-gray-300 font-light"
      >
        <span class="flex items-center gap-1.5">
          <span class="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
          Passed — cleared initial screening
        </span>
        <span class="flex items-center gap-1.5">
          <span class="w-2 h-2 rounded-full bg-rose-400 inline-block" />
          Failed — partial match or did not meet requirements
        </span>
      </div>
    </main>
  </div>
</template>
