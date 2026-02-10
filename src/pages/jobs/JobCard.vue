<script setup lang="ts">
import { useJobsStore } from '@/stores/useJobsStore'
import { formatJobDate } from '@/utils/formatJobDate'
import { onMounted, watch } from 'vue'
import {
  PhBriefcase,
  PhCurrencyCircleDollar,
  PhClock,
  PhCaretRight,
  PhX,
  PhInfo,
} from '@phosphor-icons/vue'

const jobsStore = useJobsStore()

onMounted(() => {
  jobsStore.fetchJobs()
})

// When any filter changes, reset to page 1 and fetch new results from the backend.
watch(
  () => [jobsStore.searchQuery, jobsStore.jobType, jobsStore.campus, jobsStore.timePosted],
  () => {
    jobsStore.page = 1
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
      <div
        v-for="job in jobsStore.jobs"
        :key="job.job_id"
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
            <span class="bg-gray-200 rounded-full px-2"># of slots: {{ job.slots }}</span>
          </div>
          <div class="flex items-center justify-end">
            <label
              :for="'job-drawer-' + job.job_id"
              class="btn btn-circle btn-ghost group-hover:bg-primary group-hover:text-primary-content transition-all duration-300"
            >
              <PhCaretRight :size="20" weight="bold" />
            </label>
          </div>
        </div>
        <div class="drawer drawer-end z-50">
          <input :id="'job-drawer-' + job.job_id" type="checkbox" class="drawer-toggle" />
          <div class="drawer-side">
            <label
              :for="'job-drawer-' + job.job_id"
              aria-label="close sidebar"
              class="drawer-overlay"
            ></label>
            <div class="min-h-full w-full max-w-xl bg-base-100 shadow-2xl flex flex-col">
              <div
                class="sticky top-0 z-10 bg-base-100/80 backdrop-blur-md p-6 border-b border-gray-200 flex justify-between items-center"
              >
                <div class="flex items-center gap-2 text-[#003300]/80 font-bold">
                  <PhInfo :size="20" weight="fill" />
                  <span>Position Details</span>
                </div>
                <label :for="'job-drawer-' + job.job_id" class="btn btn-sm btn-circle btn-ghost">
                  <PhX :size="20" />
                </label>
              </div>
              <div class="p-10 flex-1 overflow-y-auto">
                <div class="mb-10">
                  <h1 class="text-4xl font-black tracking-tighter mb-4">{{ job.open_position }}</h1>
                  <div class="flex flex-wrap gap-3">
                    <div class="badge badge-lg badge-primary px-4">
                      Hiring Unit: {{ job.department_unit }}
                    </div>
                    <div class="badge badge-lg badge-primary px-4">
                      Salary: {{ job.salary_rate }}
                    </div>
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
                    <h4 class="text-xs font-bold uppercase mb-4 opacity-50">
                      Requirements Preview
                    </h4>
                    <ul class="list-disc list-inside text-sm space-y-2 opacity-70">
                      <li>Proven experience in {{ job.department_unit }}</li>
                      <li>Relevant educational background</li>
                      <li>Strong communication skills</li>
                      <li>
                        Training:
                        <span class="font-semibold italic">{{ job.trainings_desired }}</span>
                      </li>
                      <li>
                        Eligibility:
                        <span class="font-semibold italic">{{ job.eligibility_desired }}</span>
                      </li>
                    </ul>
                  </section>
                </div>
                <div class="space-y-8 py-4">
                  <section class="p-6 bg-base-200/50 rounded-2xl border border-base-300/50">
                    <h4 class="text-xs font-bold uppercase mb-2 opacity-50">
                      For the document screening, Kindly create your own Google Drive folder with
                      the following naming convention and share the access with anyone with the
                      link:
                    </h4>
                    <h6 class="text-xs mb-4 opacity-50">
                      Note: Please follow the naming convention below <br />
                      Folder name: (Family Name)_(Hiring Office)-(the position your applying) <br />
                      File name: (Family Name)_(Hiring Office)-(the position your applying)_(file to
                      upload)
                    </h6>
                    <ol class="list-disc list-inside text-sm space-y-2 opacity-70">
                      <li>
                        Application/Cover Letter addressed to the CSU President Dr. Rolyn C. Daguil
                      </li>
                      <li>
                        One (1) copy of duly accomplished and Notarized Personal Data Sheet
                        (Indicating education, experience and no. of hours of training/seminars)
                      </li>
                      <li>Authenticated Copy Transcript of Records</li>
                      <li>Certificates of Relevant Trainings and Seminars attended</li>
                      <li>Certificates of Eligibility</li>
                      <li>Certificates of Employment</li>
                      <li>Work Experience Sheet</li>
                      <li>Performance rating in the last rating period (if applicable)</li>
                      <li>SSS/PHILHEALTH/[AG-IBIG/GSIS AND TAX IDENTIFICATION NUMBER</li>
                    </ol>
                  </section>
                </div>
              </div>
              <div class="p-6 bg-base-200/30 border-t border-gray-200 flex gap-3">
                <label :for="'job-drawer-' + job.job_id" class="btn btn-ghost flex-1"
                  >Back to List</label
                >
                <button class="btn btn-primary flex-1 shadow-lg shadow-primary/20">
                  Apply Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="flex justify-center mt-12 mb-20">
      <div class="join bg-base-100 border border-base-200 rounded-lg">
        <button
          :disabled="jobsStore.page === 1"
          @click="jobsStore.previousPage()"
          class="join-item btn btn-md hover:bg-primary hover:text-primary-content transition-colors"
        >
          «
        </button>
        <button class="join-item btn btn-md btn-active">
          Page {{ jobsStore.page }} of {{ Math.ceil(jobsStore.total / jobsStore.pageSize) }}
        </button>
        <button
          :disabled="jobsStore.page * jobsStore.pageSize >= jobsStore.total"
          @click="jobsStore.nextPage()"
          class="join-item btn btn-md hover:bg-primary hover:text-primary-content transition-colors"
        >
          »
        </button>
      </div>
    </div>
  </div>
</template>
