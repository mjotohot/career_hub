<script lang="ts" setup>
import { ref, onMounted, shallowRef, markRaw } from 'vue'
import AdminLayout from '@/components/navigations/AdminLayout.vue'
import { fetchDashboardStats } from '@/services/adminDashboard'
import type { Job } from '@/types/jobs'
import { PhFiles, PhUsers, PhClockCountdown, PhMagnifyingGlass } from '@phosphor-icons/vue'

const stats = shallowRef([
  {
    label: 'Active Jobs',
    value: '0',
    icon: markRaw(PhFiles),
    colorClass: 'bg-blue-100 text-blue-600',
  },
  {
    label: 'Total Applicants',
    value: '0',
    icon: markRaw(PhUsers),
    colorClass: 'bg-purple-100 text-purple-600',
  },
  {
    label: 'Average Applicants',
    value: '0',
    icon: markRaw(PhClockCountdown),
    colorClass: 'bg-amber-100 text-amber-600',
  },
  {
    label: 'Inactive Jobs',
    value: '0',
    icon: markRaw(PhMagnifyingGlass),
    colorClass: 'bg-green-100 text-green-700',
  },
])

const activeJobs = shallowRef<Job[]>([])
const loading = ref(true)

onMounted(async () => {
  loading.value = true
  const data = await fetchDashboardStats()
  stats.value = [
    { ...stats.value[0], value: data.activeJobs.length.toString() },
    { ...stats.value[1], value: data.totalApplicants.toString() },
    { ...stats.value[2], value: data.averageApplicants.toFixed(1) },
    { ...stats.value[3], value: data.inactiveJobs.length.toString() },
  ]
  activeJobs.value = data.activeJobs
  loading.value = false
})
</script>

<template>
  <AdminLayout>
    <div class="space-y-10">
      <div>
        <h2 class="text-3xl font-bold text-gray-900">Recruitment Dashboard</h2>
        <p class="mt-1 text-gray-500">Overview of active job postings and applicant stats</p>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <template v-if="loading">
          <div
            v-for="i in 4"
            :key="i"
            class="h-28 rounded-xl border border-gray-200 bg-gray-200 animate-pulse"
          ></div>
        </template>
        <div
          v-else
          v-for="(stat, idx) in stats"
          :key="idx"
          class="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-xl shadow-md transition-shadow"
        >
          <div class="flex items-start justify-between">
            <div>
              <p class="text-gray-500 text-sm font-medium mb-1">{{ stat.label }}</p>
              <p class="text-3xl font-bold text-gray-900">{{ stat.value }}</p>
            </div>
            <div :class="['p-3 rounded-lg', stat.colorClass]">
              <component :is="stat.icon" size="24" weight="duotone" />
            </div>
          </div>
        </div>
      </div>
      <section>
        <div class="mb-4 flex items-center justify-between">
          <h3 class="text-xl font-bold text-gray-900">Active Job Postings</h3>
          <router-link
            to="/admin/jobs"
            class="text-sm font-medium text-blue-600 hover:text-blue-800"
          >
            View all jobs →
          </router-link>
        </div>
        <div
          class="bg-white rounded-xl border border-gray-200 shadow-xs overflow-hidden px-6 py-3.5"
          style="grid-template-columns: 2.5rem 1fr 10rem 12rem"
        >
          <table class="w-full shadow-xs">
            <thead class="bg-gray-50 border-b border-gray-200">
              <tr>
                <th class="px-6 py-4 text-left text-sm font-semibold">#</th>
                <th class="px-6 py-4 text-left text-sm font-semibold">Position</th>
                <th class="px-6 py-4 text-left text-sm font-semibold">Slots</th>
                <th class="px-6 py-4 text-left text-sm font-semibold">Department</th>
                <th class="px-6 py-4 text-left text-sm font-semibold">Status</th>
              </tr>
            </thead>
            <tbody v-if="loading">
              <tr v-for="i in 5" :key="i" class="animate-pulse">
                <td class="px-6 py-4">
                  <div class="h-4 bg-gray-200 rounded w-3/4"></div>
                </td>
                <td class="px-6 py-4">
                  <div class="h-4 bg-gray-200 rounded w-12"></div>
                </td>
                <td class="px-6 py-4">
                  <div class="h-4 bg-gray-200 rounded w-1/2"></div>
                </td>
                <td class="px-6 py-4">
                  <div class="h-4 bg-gray-200 rounded w-1/2"></div>
                </td>
                <td class="px-6 py-4">
                  <div class="h-4 bg-gray-200 rounded w-1/2"></div>
                </td>
              </tr>
            </tbody>
            <tbody v-else>
              <tr
                v-for="(job, index) in activeJobs"
                :key="job.job_id"
                class="border-b border-gray-200 last:border-b-0 hover:bg-gray-50"
              >
                <td class="text-gray-400 select-none text-sm px-6">
                  {{ String(index + 1).padStart(2, '0') }}
                </td>
                <td class="font-medium text-sm">{{ job.open_position }}</td>
                <td class="px-6 py-4 text-sm">{{ job.number_of_slots }}</td>
                <td class="px-6 py-4 text-sm">{{ job.department_unit }}</td>
                <td class="px-6 py-4 text-sm">
                  <span
                    class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"
                  >
                    {{ job.status === 'open' ? 'Open' : 'Closed' }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  </AdminLayout>
</template>
