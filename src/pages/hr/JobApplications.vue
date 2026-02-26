<script lang="ts" setup>
import AdminLayout from '@/components/navigations/AdminLayout.vue'
import { getJobs } from '@/services/fetchJobs'
import { getApplicationsByStatus } from '@/services/applicant'
import { mapApplicationsByJob } from '@/services/applicantsMapper'
import { getApplicationsForExport, exportApplicantsPDF } from '@/services/appExportPDF'
import { supabase } from '@/services/supabase'
import type { Job } from '@/types/jobs'
import type { Applicant } from '@/types/applicant'
import { ref, onMounted, computed } from 'vue'
import {
  PhBriefcase,
  PhUsers,
  PhFilePdf,
  PhX,
  PhArrowsOutSimple,
  PhCaretDown,
  PhCaretUp,
  PhSealCheck,
  PhLockKey,
  PhMagnifyingGlass,
} from '@phosphor-icons/vue'

// STATE (what the template reads)
const jobs = ref<Job[]>([])
const applicantsByJob = ref<Record<string, Applicant[]>>({})
const searchQuery = ref('')
const selectedCampus = ref('')
const isSearching = ref(false)

// DERIVED
const totalApplicants = computed(() =>
  Object.values(applicantsByJob.value).reduce((s, a) => s + a.length, 0),
)

// FETCH ONCE
onMounted(async () => {
  await fetchJobs()
})

// Server-side search and filter function
const fetchJobs = async (query?: string, campus?: string) => {
  isSearching.value = true
  try {
    const [jobsData, applicationRows] = await Promise.all([
      getJobs(query, campus),
      getApplicationsByStatus('pass'),
    ])

    // Debug: log raw results to help trace missing data
    console.log('fetchJobs: jobsData', jobsData)
    console.log('fetchJobs: applicationRows', applicationRows)
    console.log('fetchJobs: mapped', mapApplicationsByJob(applicationRows))

    jobs.value = jobsData
    applicantsByJob.value = mapApplicationsByJob(applicationRows)

    // Collapse all jobs by default
    collapsed.value = new Set(jobsData.map((job) => job.job_id))
  } finally {
    isSearching.value = false
  }
}

// Debounced search
let searchTimeout: ReturnType<typeof setTimeout>
const handleSearch = (query: string) => {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    fetchJobs(query, selectedCampus.value)
  }, 500) // Wait 500ms after user stops typing
}

const handleExport = async (job_id: string) => {
  const data = await getApplicationsForExport(job_id, 'pass')
  exportApplicantsPDF(data)
}

// Handle campus filter change
const handleCampusChange = (campus: string) => {
  selectedCampus.value = campus
  fetchJobs(searchQuery.value, campus)
}

// UI STATE (unchanged)
const collapsed = ref<Set<string>>(new Set())
const toggleCollapse = (jobId: string) => {
  const next = new Set(collapsed.value)
  next.has(jobId) ? next.delete(jobId) : next.add(jobId)
  collapsed.value = next
}

// Drawer state
const drawerApplicant = ref<Applicant | null>(null)
const drawerDoc = ref<'pds' | 'we'>('pds')
const drawerUrl = ref('')

// Convert Supabase Storage path to full public URL
const getStorageUrl = (path: string) => {
  if (!path) return ''
  if (path.startsWith('http')) return path
  const { data } = supabase.storage.from('applications').getPublicUrl(path)
  return data.publicUrl
}

const openDrawer = (applicant: Applicant, doc: 'pds' | 'we') => {
  drawerApplicant.value = applicant
  drawerDoc.value = doc
  const path = doc === 'pds' ? applicant.personalDataSheet : applicant.workExperience
  drawerUrl.value = getStorageUrl(path)
}

const switchDoc = (doc: 'pds' | 'we') => {
  if (!drawerApplicant.value) return
  drawerDoc.value = doc
  const path =
    doc === 'pds' ? drawerApplicant.value.personalDataSheet : drawerApplicant.value.workExperience
  drawerUrl.value = getStorageUrl(path)
}

const closeDrawer = () => {
  drawerApplicant.value = null
  drawerUrl.value = ''
}

// Helpers
const initials = (name: string) =>
  name
    .replace(/^(Dr\.|Prof\.)\s*/i, '')
    .split(' ')
    .slice(0, 2)
    .map((n) => n[0])
    .join('')
    .toUpperCase()

const formatDate = (d: string) =>
  new Date(d).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
</script>

<template>
  <AdminLayout>
    <div class="min-h-screen">
      <div class="flex items-end justify-between mb-8">
        <div>
          <h1 class="text-3xl font-bold text-gray-900 tracking-tight leading-none">
            Job Applicants
          </h1>
          <p class="mt-1.5 text-xs text-gray-400 tracking-wide">
            {{ jobs.length }} open positions · {{ totalApplicants }} total applicants
          </p>
        </div>
        <div
          class="flex items-center gap-1.5 text-xs font-medium text-blue-600 bg-blue-50 border border-blue-200 px-3 py-1.5 rounded-full"
        >
          <PhBriefcase :size="14" weight="bold" />
          AY 2025
        </div>
      </div>

      <!-- Search Bar and Filters -->
      <div class="mb-6 flex gap-3">
        <!-- Search input -->
        <div class="flex-1 relative">
          <PhMagnifyingGlass
            :size="18"
            weight="bold"
            class="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
          />
          <input
            :value="searchQuery"
            @input="
              (e) => {
                searchQuery = (e.target as HTMLInputElement).value
                handleSearch(searchQuery)
              }
            "
            :disabled="isSearching"
            type="text"
            placeholder="Search by job title..."
            class="w-full pl-10 pr-4 py-2.5 border border-stone-200 rounded-lg bg-white text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:opacity-50"
          />
          <div v-if="isSearching" class="absolute right-3.5 top-1/2 -translate-y-1/2">
            <div
              class="animate-spin w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full"
            />
          </div>
        </div>

        <!-- Campus filter -->
        <select
          :value="selectedCampus"
          @change="(e) => handleCampusChange((e.target as HTMLSelectElement).value)"
          :disabled="isSearching"
          class="px-4 py-2.5 border border-stone-200 rounded-lg bg-white text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:opacity-50 cursor-pointer"
        >
          <option value="">All Locations</option>
          <option value="CSU">CSU-MAIN</option>
          <option value="CSUCC">CSUCC</option>
        </select>
      </div>

      <div class="flex flex-col gap-5">
        <section
          v-for="job in jobs"
          :key="job.job_id"
          class="bg-white border-[1.5px] rounded-2xl overflow-hidden transition-colors"
          :class="job.status === 'closed' ? 'border-stone-200 opacity-75' : 'border-stone-200'"
        >
          <button
            @click="toggleCollapse(job.job_id)"
            class="w-full flex items-start justify-between px-6 py-5 hover:bg-stone-50 transition-colors cursor-pointer bg-transparent border-0 text-left gap-6"
          >
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2 mb-1">
                <span class="text-[10px] uppercase tracking-widest text-gray-400">
                  {{ job.campus }} · {{ job.department_unit }}
                </span>
                <!-- Status badge -->
                <span
                  class="flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full"
                  :class="
                    job.status === 'open'
                      ? 'bg-emerald-100 text-emerald-600'
                      : 'bg-stone-100 text-stone-400'
                  "
                >
                  <PhSealCheck v-if="job.status === 'open'" :size="10" weight="fill" />
                  <PhLockKey v-else :size="10" weight="fill" />
                  {{ job.status === 'open' ? 'Open' : 'Closed' }}
                </span>
              </div>
              <h2 class="text-base font-bold text-gray-900 tracking-tight">
                {{ job.open_position }}
              </h2>
              <p class="text-xs text-gray-400 mt-0.5 line-clamp-1">{{ job.job_desc }}</p>
            </div>

            <!-- Right: Meta chips + toggle -->
            <div class="flex items-center gap-2 shrink-0 flex-wrap justify-end">
              <span class="text-[11px] text-gray-500 bg-stone-100 px-2.5 py-1 rounded-full">
                SG {{ job.salary_grade }} · {{ job.salary_rate }}
              </span>
              <span
                class="text-[11px] font-medium px-2.5 py-1 rounded-full"
                :class="
                  job.position_type === 'Full-Time'
                    ? 'bg-blue-50 text-blue-600'
                    : 'bg-amber-50 text-amber-600'
                "
              >
                {{ job.position_type }}
              </span>
              <span
                class="flex items-center gap-1 text-[11px] text-gray-500 bg-stone-100 px-2.5 py-1 rounded-full"
              >
                <PhUsers :size="11" weight="bold" />
                {{ applicantsByJob[job.job_id]?.length ?? 0 }} applicants
              </span>
              <button
                class="btn btn-xs text-white rounded-md transition-all"
                :class="
                  (applicantsByJob[job.job_id]?.length ?? 0) > 0
                    ? 'btn-error cursor-pointer'
                    : 'bg-stone-200 text-stone-400 cursor-not-allowed'
                "
                :disabled="(applicantsByJob[job.job_id]?.length ?? 0) === 0"
                @click="handleExport(job.job_id)"
              >
                Export PDF
              </button>
              <PhCaretUp
                v-if="!collapsed.has(job.job_id)"
                :size="14"
                weight="bold"
                class="text-gray-400 ml-1"
              />
              <PhCaretDown v-else :size="14" weight="bold" class="text-gray-400 ml-1" />
            </div>
          </button>

          <!-- Expanded Content -->
          <div v-if="!collapsed.has(job.job_id)" class="border-t border-stone-100">
            <!-- Qualification strip -->
            <div
              class="grid grid-cols-2 gap-x-8 gap-y-3 px-6 py-4 bg-stone-50/60 border-b border-stone-100 text-xs"
            >
              <div class="flex flex-col gap-0.5">
                <span class="text-[10px] uppercase tracking-widest text-gray-400">Education</span>
                <span class="text-gray-700">{{ job.education_desired }}</span>
              </div>
              <div class="flex flex-col gap-0.5">
                <span class="text-[10px] uppercase tracking-widest text-gray-400">Experience</span>
                <span class="text-gray-700">{{ job.experience_desired }}</span>
              </div>
              <div class="flex flex-col gap-0.5">
                <span class="text-[10px] uppercase tracking-widest text-gray-400">Eligibility</span>
                <span class="text-gray-700">{{ job.eligibility_desired }}</span>
              </div>
              <div class="flex flex-col gap-0.5">
                <span class="text-[10px] uppercase tracking-widest text-gray-400">Trainings</span>
                <span class="text-gray-700">{{ job.trainings_desired }}</span>
              </div>
              <div v-if="job.other_qualifications" class="col-span-2 flex flex-col gap-0.5">
                <span class="text-[10px] uppercase tracking-widest text-gray-400"
                  >Other Qualifications</span
                >
                <span class="text-gray-700">{{ job.other_qualifications }}</span>
              </div>
            </div>

            <!-- Applicant Table -->
            <div v-if="applicantsByJob[job.job_id]?.length">
              <!-- Table Head -->
              <div
                class="grid items-center px-6 py-2.5 bg-stone-50 border-b border-stone-100"
                style="grid-template-columns: 2.5rem 1fr 10rem 12rem"
              >
                <span class="text-[10px] uppercase tracking-widest text-gray-400">#</span>
                <span class="text-[10px] uppercase tracking-widest text-gray-400">Applicant</span>
                <span class="text-[10px] uppercase tracking-widest text-gray-400"
                  >Date Applied</span
                >
                <span class="text-[10px] uppercase tracking-widest text-gray-400">Documents</span>
              </div>

              <!-- Rows -->
              <div
                v-for="(applicant, index) in applicantsByJob[job.job_id]"
                :key="applicant.id"
                class="grid items-center px-6 py-3.5 border-b border-stone-100 last:border-0 transition-colors"
                :class="
                  drawerApplicant?.id === applicant.id ? 'bg-blue-50' : 'hover:bg-stone-50/70'
                "
                style="grid-template-columns: 2.5rem 1fr 10rem 12rem"
              >
                <span class="text-xs text-gray-300 select-none">
                  {{ String(index + 1).padStart(2, '0') }}
                </span>

                <div class="flex items-center gap-3 min-w-0">
                  <div
                    class="w-8 h-8 rounded-lg font-semibold text-[11px] flex items-center justify-center shrink-0 transition-colors"
                    :class="
                      drawerApplicant?.id === applicant.id
                        ? 'bg-blue-600 text-white'
                        : 'bg-stone-100 text-gray-500'
                    "
                  >
                    {{ initials(applicant.name) }}
                  </div>
                  <div class="min-w-0">
                    <p class="text-sm font-semibold text-gray-900 leading-tight">
                      {{ applicant.name }}
                    </p>
                    <p class="text-xs text-gray-400 truncate">{{ applicant.email }}</p>
                  </div>
                </div>

                <span class="text-xs font-mono text-gray-400">{{
                  formatDate(applicant.appliedDate)
                }}</span>

                <div class="flex items-center gap-2">
                  <button
                    @click="openDrawer(applicant, 'pds')"
                    class="flex items-center gap-1.5 text-[11px] font-medium px-3 py-1.5 rounded-lg border cursor-pointer transition-all"
                    :class="
                      drawerApplicant?.id === applicant.id && drawerDoc === 'pds'
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'text-gray-500 bg-stone-50 border-stone-200 hover:bg-stone-100 hover:text-gray-800'
                    "
                  >
                    <PhFilePdf :size="12" weight="bold" />
                    PDS
                  </button>
                  <button
                    @click="openDrawer(applicant, 'we')"
                    class="flex items-center gap-1.5 text-[11px] font-medium px-3 py-1.5 rounded-lg border cursor-pointer transition-all"
                    :class="
                      drawerApplicant?.id === applicant.id && drawerDoc === 'we'
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'text-gray-500 bg-stone-50 border-stone-200 hover:bg-stone-100 hover:text-gray-800'
                    "
                  >
                    <PhFilePdf :size="12" weight="bold" />
                    WE
                  </button>
                </div>
              </div>
            </div>

            <!-- No applicants yet -->
            <div v-else class="flex items-center justify-center py-10 gap-2 text-gray-400">
              <PhUsers :size="18" weight="thin" />
              <span class="text-sm">No applicants yet for this position</span>
            </div>
          </div>
        </section>

        <!-- No jobs found -->
        <div
          v-if="jobs.length === 0"
          class="flex flex-col items-center justify-center py-16 gap-3 text-gray-400"
        >
          <PhMagnifyingGlass :size="40" weight="thin" />
          <div class="text-center">
            <p class="text-sm font-medium text-gray-600">No jobs found</p>
            <p class="text-xs mt-1" v-if="searchQuery">Try adjusting your search terms</p>
            <p class="text-xs mt-1" v-else>Start by creating some job postings</p>
          </div>
        </div>
      </div>

      <!-- PDF Slide-over Drawer -->
      <Teleport to="body">
        <Transition name="drawer">
          <div v-if="drawerApplicant" class="fixed inset-0 z-50 flex justify-end">
            <!-- Scrim -->
            <div class="absolute inset-0 bg-black/30 backdrop-blur-[2px]" @click="closeDrawer" />

            <!-- Drawer Panel -->
            <div class="relative flex flex-col bg-white shadow-2xl w-195 max-w-[90vw] h-full">
              <!-- Drawer Header -->
              <div class="flex items-center gap-4 px-5 py-4 border-b border-stone-200 shrink-0">
                <div
                  class="w-9 h-9 rounded-xl bg-blue-600 text-white font-mono font-bold text-xs flex items-center justify-center shrink-0"
                >
                  {{ initials(drawerApplicant.name) }}
                </div>
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-bold text-gray-900 leading-tight">
                    {{ drawerApplicant.name }}
                  </p>
                  <p class="text-xs text-gray-400 truncate">{{ drawerApplicant.email }}</p>
                </div>

                <!-- Doc Tabs -->
                <div class="flex items-center gap-1 bg-stone-100 p-1 rounded-lg">
                  <button
                    @click="switchDoc('pds')"
                    class="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-md border-0 cursor-pointer transition-all"
                    :class="
                      drawerDoc === 'pds'
                        ? 'bg-white text-gray-900 shadow-sm'
                        : 'bg-transparent text-gray-500 hover:text-gray-700'
                    "
                  >
                    <PhFilePdf :size="13" weight="bold" />
                    Personal Data Sheet
                  </button>
                  <button
                    @click="switchDoc('we')"
                    class="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-md border-0 cursor-pointer transition-all"
                    :class="
                      drawerDoc === 'we'
                        ? 'bg-white text-gray-900 shadow-sm'
                        : 'bg-transparent text-gray-500 hover:text-gray-700'
                    "
                  >
                    <PhFilePdf :size="13" weight="bold" />
                    Work Experience
                  </button>
                </div>

                <!-- Actions -->
                <div class="flex items-center gap-1 shrink-0">
                  <a
                    :href="drawerUrl"
                    target="_blank"
                    rel="noopener"
                    title="Open in new tab"
                    class="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-700 hover:bg-stone-100 transition-colors no-underline"
                  >
                    <PhArrowsOutSimple :size="15" weight="bold" />
                  </a>
                  <button
                    @click="closeDrawer"
                    class="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-700 hover:bg-stone-100 border-0 bg-transparent cursor-pointer transition-colors"
                  >
                    <PhX :size="15" weight="bold" />
                  </button>
                </div>
              </div>

              <!-- PDF Viewer -->
              <iframe
                :key="drawerUrl"
                :src="drawerUrl"
                class="flex-1 w-full border-0"
                type="application/pdf"
              />
            </div>
          </div>
        </Transition>
      </Teleport>
    </div>
  </AdminLayout>
</template>

<style scoped>
.drawer-enter-active,
.drawer-leave-active {
  transition: opacity 0.2s ease;
}
.drawer-enter-from,
.drawer-leave-to {
  opacity: 0;
}
.drawer-enter-active .relative,
.drawer-leave-active .relative {
  transition: transform 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}
.drawer-enter-from .relative,
.drawer-leave-to .relative {
  transform: translateX(100%);
}
</style>
