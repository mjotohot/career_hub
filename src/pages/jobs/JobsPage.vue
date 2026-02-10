<script setup lang="ts">
import bgImage from '@/assets/images/csu1.jpg'
import NavigationBar from '@/components/navigations/NavigationBar.vue'
import JobFilters from './JobFilters.vue'
import JobCard from './JobCard.vue'
import { onMounted } from 'vue'
import { useJobsStore } from '@/stores/useJobsStore'

const jobsStore = useJobsStore()

onMounted(() => {
  jobsStore.fetchJobs()
})
</script>

<template>
  <NavigationBar />
  <section
    :style="{
      backgroundImage: `url(${bgImage})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    }"
    class="py-12 px-4 relative"
  >
    <div class="absolute inset-0 bg-[#003300]/75 pointer-events-none"></div>
    <div class="flex justify-center">
      <div>
        <h1 class="text-4xl text-center text-white font-bold mb-4 relative z-10">Open Positions</h1>
        <p class="text-center text-white mb-6 z-10 relative">
          Find and apply for a desired job opportunities
        </p>
        <JobFilters />
      </div>
    </div>
  </section>
  <JobCard />
</template>
