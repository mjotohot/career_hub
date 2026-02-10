<script setup lang="ts">
const steps = [
  {
    step: '1',
    title: 'Browse Positions',
    description: 'Explore open faculty and staff positions across all departments.',
  },
  {
    step: '2',
    title: 'Submit Application',
    description: 'Apply with your resume and cover letter. No account required.',
  },
  {
    step: '3',
    title: 'Track Your Status',
    description: 'Receive email updates with your application status and next steps.',
  },
]
</script>

<template>
  <section id="apply" class="py-40 px-4 sm:px-6 lg:px-8 bg-base-300">
    <div class="max-w-7xl mx-auto">
      <div class="text-center mb-16">
        <h2 class="text-3xl sm:text-4xl font-bold text-foreground mb-4">How to Apply</h2>
        <p class="text-lg text-muted-foreground max-w-2xl mx-auto">
          A streamlined application process designed for you
        </p>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div
          v-for="(item, idx) in steps"
          :key="idx"
          class="p-8 rounded-xl text-white bg-[#003300] border-b-5 border-[#ff9900] shadow hover:shadow-md transition-shadow"
        >
          <div
            class="w-12 h-12 bg-[#ff9900] rounded-full flex items-center justify-center font-bold text-lg mb-4"
          >
            {{ item.step }}
          </div>
          <h3 class="text-xl font-semibold mb-2">
            {{ item.title }}
          </h3>
          <p class="text-muted-foreground leading-relaxed">
            {{ item.description }}
          </p>
        </div>
      </div>
    </div>
  </section>
</template>
