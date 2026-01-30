<script setup lang="ts">
import bgImage from '@/assets/images/hero.jpg'
import { PhArrowRight } from '@phosphor-icons/vue'
</script>

<template>
  <section
    id="home"
    class="hero relative min-h-screen"
    :style="{
      backgroundImage: `url(${bgImage})`,
    }"
  >
    <div class="absolute inset-0 bg-black/40 pointer-events-none"></div>
    <div class="text-center mb-12 z-10 relative">
      <h1 class="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
        Join Our Academic Community
      </h1>
      <p class="text-lg sm:text-xl text-white max-w-2xl mx-auto mb-8 leading-relaxed">
        Explore faculty and staff opportunities at the university. No account required—simply browse
        positions, submit your application, and we'll keep you updated via email.
      </p>
      <div class="flex flex-col sm:flex-row gap-4 justify-center">
        <button class="btn bg-[#003300] text-white rounded-md">
          Browse Open Positions
          <PhArrowRight :size="20" weight="bold" />
        </button>
        <button class="btn btn-outline hover:bg-[#ff9900] text-white hover:border-none rounded-md">
          HR Staff Portal
        </button>
      </div>
    </div>
  </section>
</template>
