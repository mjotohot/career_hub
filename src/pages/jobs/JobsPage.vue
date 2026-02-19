<script setup lang="ts">
import bgImage from '@/assets/images/csu1.jpg'
import NavigationBar from '@/components/navigations/NavigationBar.vue'
import JobFilters from './JobFilters.vue'
import JobListing from './JobListing.vue'
import { PhArrowLeft } from '@phosphor-icons/vue'
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
    <router-link to="/">
      <button class="btn btn-sm btn-ghost absolute top-4 left-4 text-white hover:text-black z-10">
        <PhArrowLeft :size="16" />Back
      </button>
    </router-link>
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
  <JobListing />
</template>
