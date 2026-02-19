<script setup lang="ts">
import { computed } from 'vue'
import type { Job } from '@/types/jobs'
import { PhInfo, PhX } from '@phosphor-icons/vue'

const props = defineProps<{
  job: Job
  isOpen: boolean
}>()

const emit = defineEmits<{
  close: []
  apply: [job: Job]
}>()

// Generate unique ID for drawer toggle
const drawerId = computed(() => `job-drawer-${props.job.job_id}`)

const DOCUMENT_REQUIREMENTS = [
  'Application/Cover Letter addressed to the CSU President Dr. Rolyn C. Daguil',
  'One (1) copy of duly accomplished and Notarized Personal Data Sheet (Indicating education, experience and no. of hours of training/seminars)',
  'Authenticated Copy Transcript of Records',
  'Certificates of Relevant Trainings and Seminars attended',
  'Certificates of Eligibility',
  'Certificates of Employment',
  'Work Experience Sheet',
  'Performance rating in the last rating period (if applicable)',
  'SSS/PHILHEALTH/PAG-IBIG/GSIS AND TAX IDENTIFICATION NUMBER',
]

const NAMING_CONVENTION_NOTE = `
Folder name: (Family Name)_(Hiring Office)-(the position your applying)
File name: (Family Name)_(Hiring Office)-(the position your applying)_(file to upload)
`.trim()
</script>

<template>
  <div class="drawer drawer-end z-50">
    <input :id="drawerId" type="checkbox" class="drawer-toggle" :checked="isOpen" />
    <div class="drawer-side">
      <label :for="drawerId" aria-label="close sidebar" class="drawer-overlay"></label>

      <div class="min-h-full w-full max-w-xl bg-base-100 shadow-2xl flex flex-col">
        <div
          class="sticky top-0 z-10 bg-base-100/80 backdrop-blur-md p-6 border-b border-gray-200 flex justify-between items-center"
        >
          <div class="flex items-center gap-2 text-[#003300]/80 font-bold">
            <PhInfo :size="20" weight="fill" />
            <span>Position Details</span>
          </div>
          <button @click="emit('close')" class="btn btn-sm btn-circle btn-ghost">
            <PhX :size="20" />
          </button>
        </div>

        <div class="p-10 flex-1 overflow-y-auto">
          <div class="mb-10">
            <h1 class="text-4xl font-black tracking-tighter mb-4">{{ job.open_position }}</h1>
            <div class="flex flex-wrap gap-3">
              <div class="badge badge-lg badge-primary px-4">
                Hiring Unit: {{ job.department_unit }}
              </div>
              <div class="badge badge-lg badge-primary px-4">Salary: {{ job.salary_rate }}</div>
            </div>
          </div>

          <div class="space-y-8">
            <section>
              <h4 class="text-xs font-bold uppercase tracking-[0.2em] text-[#003300]/80 mb-4">
                Job Description
              </h4>
              <p class="text-lg leading-relaxed text-base-content/80 whitespace-pre-line">
                {{ job.job_desc }}
              </p>
            </section>
            <section class="p-6 bg-base-200/50 rounded-2xl border border-base-300/50">
              <h4 class="text-xs font-bold uppercase mb-4 opacity-50">Requirements Preview</h4>
              <ul class="list-disc list-inside text-sm space-y-2 opacity-70">
                <li>{{ job.experience_desired }} in {{ job.department_unit }}</li>
                <li>{{ job.education_desired }}</li>
                <li>
                  Training:
                  <span class="font-semibold italic">{{ job.trainings_desired }}</span>
                </li>
                <li>
                  Eligibility:
                  <span class="font-semibold italic">{{ job.eligibility_desired }}</span>
                </li>
                <li>Other qualifications: {{ job.other_qualifications }}</li>
              </ul>
            </section>
          </div>

          <div class="space-y-8 py-4">
            <section class="p-6 bg-base-200/50 rounded-2xl border border-base-300/50">
              <h4 class="text-xs font-bold uppercase mb-2 opacity-50">
                For the document screening, Kindly create your own Google Drive folder with the
                following naming convention and share the access with anyone with the link:
              </h4>
              <h6 class="text-xs mb-4 opacity-50">
                Note: Please follow the naming convention below<br />
                {{ NAMING_CONVENTION_NOTE }}
              </h6>
              <ol class="list-disc list-inside text-sm space-y-2 opacity-70">
                <li v-for="(req, index) in DOCUMENT_REQUIREMENTS" :key="index">
                  {{ req }}
                </li>
              </ol>
            </section>
          </div>
        </div>

        <div class="p-6 bg-base-200/30 border-t border-gray-200 flex gap-3">
          <button @click="emit('close')" class="btn btn-ghost flex-1">Back to List</button>
          <button
            @click="emit('apply', job)"
            class="btn btn-primary flex-1 shadow-lg shadow-primary/20"
          >
            Apply Now
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
