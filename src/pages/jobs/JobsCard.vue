<script setup lang="ts">
import { formatJobDate } from '@/utils/formatJobDate'
import type { Job } from '@/types/jobs'
import { PhBriefcase, PhCurrencyCircleDollar, PhClock, PhCaretRight } from '@phosphor-icons/vue'

defineProps<{
  job: Job
}>()

const emit = defineEmits<{
  viewDetails: [job: Job]
}>()
</script>

<template>
  <div
    v-if="job"
    class="group relative bg-base-100 border border-base-200 hover:border-primary/30 transition-all duration-200 rounded-xl hover:shadow-lg hover:shadow-primary/5"
  >
    <div class="flex flex-col md:flex-row md:items-center p-5 gap-6">
      <div
        class="absolute left-0 top-1/4 bottom-1/4 w-1 bg-primary rounded-r-full scale-y-0 group-hover:scale-y-100 transition-transform duration-300"
      ></div>

      <div class="flex-1">
        <div class="flex items-center gap-3 mb-2">
          <span
            class="text-[10px] font-black uppercase tracking-tighter text-success bg-success/20 px-2 py-0.5 rounded"
          >
            {{ job.campus }}
          </span>
          <span
            class="text-[10px] font-black uppercase tracking-tighter text-primary bg-primary/10 px-2 py-0.5 rounded"
          >
            Hiring Unit: {{ job.department_unit }}
          </span>
          <div class="flex items-center gap-1 text-[11px] font-medium opacity-40">
            <PhClock :size="14" />
            <span>{{ formatJobDate(job.created_at) }}</span>
          </div>
        </div>
        <h2 class="text-xl font-bold text-base-content tracking-tight">
          {{ job.open_position }}
        </h2>
        <p class="text-sm italic font-bold">
          Preferred Competency: <span class="font-normal">{{ job.education_desired }}</span>
        </p>
      </div>

      <div class="hidden lg:flex items-center gap-8 text-sm font-medium opacity-70">
        <div class="flex items-center gap-2">
          <PhBriefcase :size="18" weight="duotone" class="text-primary" />
          <span>{{ job.position_type }}</span>
        </div>
        <div class="flex items-center gap-2">
          <PhCurrencyCircleDollar :size="18" weight="duotone" class="text-success" />
          <span>SG {{ job.salary_grade }}</span>
        </div>
        <span class="bg-gray-200 rounded-full px-2"># of slots: {{ job.number_of_slots }}</span>
      </div>

      <div class="flex items-center justify-end">
        <button
          @click="emit('viewDetails', job)"
          class="btn btn-circle btn-ghost group-hover:bg-primary group-hover:text-primary-content transition-all duration-300"
          aria-label="View job details"
        >
          <PhCaretRight :size="20" weight="bold" />
        </button>
      </div>
    </div>
  </div>
</template>
