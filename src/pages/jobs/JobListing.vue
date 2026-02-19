<script setup lang="ts">
import { useJobsStore } from '@/stores/useJobsStore'
import type { Job } from '@/types/jobs'
import { onMounted, watch, ref } from 'vue'
import JobsCard from './JobsCard.vue'
import JobDetails from './JobDetails.vue'
import JobApply from './JobApply.vue'

const jobsStore = useJobsStore()
const selectedJob = ref<Job | null>(null)
const isDrawerOpen = ref(false)
const isModalOpen = ref(false)

const openJobDetails = (job: Job) => {
  selectedJob.value = job
  isDrawerOpen.value = true
}

const openApplicationModal = (job: Job) => {
  selectedJob.value = job
  isDrawerOpen.value = false
  isModalOpen.value = true
}

onMounted(() => {
  jobsStore.fetchJobs()
})

watch(
  () => [
    jobsStore.filters.searchQuery,
    jobsStore.filters.jobType,
    jobsStore.filters.campus,
    jobsStore.filters.timePosted,
  ],
  () => {
    jobsStore.filters.page = 1
    jobsStore.fetchJobs()
  },
)
</script>

<template>
  <div v-if="jobsStore.isLoading" class="flex justify-center mt-20">
    <span class="loading loading-bars loading-lg"></span>
  </div>

  <div v-else class="max-w-5xl mx-auto mt-10">
    <div class="flex justify-between items-center mb-6 px-2">
      <h2 class="text-sm font-bold uppercase tracking-widest opacity-50">Available Openings</h2>
      <span class="text-xs opacity-50">{{ jobsStore.jobs.length }} Positions Found</span>
    </div>

    <div class="space-y-3">
      <JobsCard
        v-for="job in jobsStore.jobs"
        :key="job.job_id"
        :job="job"
        @view-details="openJobDetails"
      />
    </div>

    <div class="flex justify-center mt-12 mb-20">
      <div class="join bg-base-100 border border-base-200 rounded-lg">
        <button
          :disabled="jobsStore.filters.page === 1"
          @click="jobsStore.previousPage()"
          class="join-item btn btn-md hover:bg-primary hover:text-primary-content transition-colors"
        >
          «
        </button>
        <button class="join-item btn btn-md btn-active">
          Page {{ jobsStore.filters.page }} of
          {{ Math.ceil(jobsStore.total / jobsStore.filters.pageSize) }}
        </button>
        <button
          :disabled="jobsStore.filters.page * jobsStore.filters.pageSize >= jobsStore.total"
          @click="jobsStore.nextPage()"
          class="join-item btn btn-md hover:bg-primary hover:text-primary-content transition-colors"
        >
          »
        </button>
      </div>
    </div>

    <JobDetails
      v-if="selectedJob"
      :job="selectedJob"
      :is-open="isDrawerOpen"
      @close="isDrawerOpen = false"
      @apply="openApplicationModal"
    />

    <JobApply
      v-if="selectedJob"
      :job="selectedJob"
      :is-open="isModalOpen"
      @close="isModalOpen = false"
    />
  </div>
</template>
