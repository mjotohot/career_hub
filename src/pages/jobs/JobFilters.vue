<script setup lang="ts">
import { PhMagnifyingGlass } from '@phosphor-icons/vue'
import { useJobsStore } from '@/stores/useJobsStore'

const jobsStore = useJobsStore()
</script>

<template>
  <label class="input input-lg w-full">
    <PhMagnifyingGlass :size="22" />
    <input
      v-model="jobsStore.searchQuery"
      type="search"
      placeholder="Search position..."
      class="w-full"
    />
  </label>

  <div class="mt-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
    <select v-model="jobsStore.jobType" class="select select-md w-full">
      <option value="">All Types</option>
      <option value="Full-Time">Full-time</option>
      <option value="Contract of Service">COS</option>
    </select>

    <select v-model="jobsStore.campus" class="select select-md w-full">
      <option value="">All Locations</option>
      <option value="CSU">CSU-MAIN</option>
      <option value="CSUCC">CSUCC</option>
    </select>

    <select v-model="jobsStore.timePosted" class="select select-md w-full">
      <option value="">Any Time</option>
      <option value="24h">Last 24 hours</option>
      <option value="7d">Last 7 days</option>
      <option value="30d">Last 30 days</option>
    </select>
  </div>
</template>
