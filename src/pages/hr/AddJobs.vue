<script setup lang="ts">
import { computed } from 'vue'
import AdminLayout from '@/components/navigations/AdminLayout.vue'
import AppFormField from '@/components/inputs/AppFormField.vue'
import { useAddJob } from '@/composables/useAddJobs'
import { PhCheck, PhCheckCircle, PhArrowLeft, PhArrowRight, PhSpinner } from '@phosphor-icons/vue'

const CAMPUSES = [
  { label: 'CSU-MAIN', value: 'CSU-MAIN' },
  { label: 'CSUCC', value: 'CSUCC' },
]
const STATUS_OPTIONS = [
  { label: 'Open', value: 'open' },
  { label: 'Closed', value: 'closed' },
]
const POSITION_TYPES = ['Full-Time', 'Contract of Service'] as const

const {
  formData,
  currentStep,
  isLoading,
  isPosted,
  errors,
  steps,
  isCurrentStepValid,
  nextStep,
  prevStep,
  goToStep,
  resetForm,
  submitJob,
} = useAddJob()

const salaryPreview = computed(() => {
  const { salary_grade, salary_rate } = formData
  if (salary_rate) return `SG ${salary_grade} — ${salary_rate}`
  if (salary_grade) return `Salary Grade ${salary_grade}`
  return '—'
})
</script>

<template>
  <AdminLayout>
    <div class="flex justify-center">
      <div class="w-full max-w-5xl">
        <!-- Step Bar -->
        <div class="mb-6">
          <div class="flex items-center">
            <template v-for="(s, i) in steps" :key="s.id">
              <button
                @click="goToStep(s.id)"
                class="flex items-center gap-2 text-xs transition-colors"
                :class="
                  s.id === currentStep
                    ? 'text-[#003300]'
                    : s.id < currentStep
                      ? 'text-violet-400 cursor-pointer'
                      : 'text-slate-600 cursor-default'
                "
              >
                <span
                  class="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-semibold border transition-all"
                  :class="
                    s.id < currentStep
                      ? 'bg-[#003300] border-[#003300] text-white'
                      : s.id === currentStep
                        ? 'border-violet-400 text-violet-400'
                        : 'border-slate-700 text-slate-600'
                  "
                >
                  <PhCheck v-if="s.id < currentStep" class="w-2.5 h-2.5" weight="bold" />
                  <template v-else>{{ s.id }}</template>
                </span>
                {{ s.label }}
              </button>
              <div
                v-if="i < steps.length - 1"
                class="flex-1 h-px mx-3 transition-colors"
                :class="currentStep > s.id ? 'bg-violet-500/50' : 'bg-slate-800'"
              />
            </template>
          </div>
        </div>

        <!-- Card -->
        <div class="border border-gray-200 rounded-2xl overflow-hidden shadow-2xl shadow-black/40">
          <!-- SUCCESS STATE -->
          <div v-if="isPosted" class="px-8 py-14 flex flex-col items-center text-center">
            <div
              class="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mb-5"
            >
              <PhCheckCircle class="w-8 h-8 text-emerald-400" weight="light" />
            </div>
            <h3
              class="text-xl text-white font-light mb-1"
              style="font-family: 'DM Serif Display', serif"
            >
              Job Posted!
            </h3>
            <p class="text-slate-400 text-sm mb-6">
              Your listing is now live and visible to candidates.
            </p>
            <div
              class="bg-slate-800/60 border border-slate-700 rounded-xl px-6 py-4 mb-8 text-left w-full max-w-sm space-y-1"
            >
              <p class="text-white font-medium">{{ formData.open_position }}</p>
              <p class="text-slate-400 text-sm">
                {{ formData.department_unit }} · {{ formData.campus }}
              </p>
              <div class="flex items-center gap-2 pt-1 flex-wrap">
                <span
                  class="inline-flex items-center bg-violet-500/10 border border-violet-500/20 text-violet-400 text-xs px-2.5 py-0.5 rounded-full"
                >
                  {{ formData.position_type }}
                </span>
                <span
                  class="inline-flex items-center bg-slate-700/60 border border-slate-600/40 text-slate-400 text-xs px-2.5 py-0.5 rounded-full"
                >
                  {{ formData.number_of_slots }} slot{{ formData.number_of_slots !== 1 ? 's' : '' }}
                </span>
                <span
                  class="inline-flex items-center text-xs px-2.5 py-0.5 rounded-full border"
                  :class="
                    formData.status === 'open'
                      ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                      : 'bg-slate-700/60 border-slate-600/40 text-slate-400'
                  "
                >
                  {{ formData.status === 'open' ? 'Open' : 'Closed' }}
                </span>
              </div>
            </div>
            <button
              @click="resetForm"
              class="bg-violet-600 hover:bg-violet-500 text-white text-sm px-6 py-2.5 rounded-lg transition-colors"
            >
              Post Another Job
            </button>
          </div>

          <!-- FORM -->
          <template v-else>
            <div class="px-8 pt-8 pb-6">
              <Transition name="slide" mode="out-in">
                <!-- STEP 1: Position Details -->
                <div v-if="currentStep === 1" key="1" class="space-y-5">
                  <div class="mb-6">
                    <h2
                      class="text-xl text-white font-light"
                      style="font-family: 'DM Serif Display', serif"
                    >
                      Position Details
                    </h2>
                    <p class="text-slate-500 text-sm mt-1">
                      Define the position and where it belongs.
                    </p>
                  </div>

                  <AppFormField
                    v-model="formData.open_position"
                    label="Open Position"
                    placeholder="e.g. Administrative Aide III"
                    :required="true"
                    :error="errors.open_position"
                  />

                  <div class="grid grid-cols-2 gap-4">
                    <AppFormField
                      v-model="formData.campus"
                      label="Campus"
                      type="select"
                      :options="CAMPUSES"
                      :required="true"
                      :error="errors.campus"
                    />
                    <AppFormField
                      v-model="formData.department_unit"
                      label="Department / Unit"
                      placeholder="e.g. Office of the Registrar"
                      :required="true"
                      :error="errors.department_unit"
                    />
                  </div>

                  <div>
                    <label
                      class="block text-[11px] font-semibold tracking-widest uppercase text-slate-500 mb-2"
                    >
                      Position Type <span class="text-violet-400">*</span>
                    </label>
                    <div class="flex gap-3">
                      <button
                        v-for="t in POSITION_TYPES"
                        :key="t"
                        type="button"
                        @click="formData.position_type = t"
                        class="flex-1 py-3 rounded-xl border text-sm font-medium transition-all"
                        :class="
                          formData.position_type === t
                            ? 'bg-violet-600/10 border-violet-500 text-violet-300'
                            : ' border-slate-700 text-slate-500 hover:border-slate-600 hover:text-slate-400'
                        "
                      >
                        {{ t }}
                      </button>
                    </div>
                    <p v-if="errors.position_type" class="text-red-400 text-[11px] mt-1.5">
                      {{ errors.position_type }}
                    </p>
                  </div>

                  <div class="grid grid-cols-2 gap-4">
                    <AppFormField
                      v-model="formData.number_of_slots as any"
                      label="Number of Slots"
                      placeholder="e.g. 2"
                    />
                    <AppFormField
                      v-model="formData.status"
                      label="Status"
                      type="select"
                      :options="STATUS_OPTIONS"
                    />
                  </div>
                </div>

                <!-- STEP 2: Job Details -->
                <div v-else-if="currentStep === 2" key="2" class="space-y-5">
                  <div class="mb-6">
                    <h2 class="text-xl text-white font-light">Job Details</h2>
                    <p class="text-slate-500 text-sm mt-1">
                      Describe the role and its compensation.
                    </p>
                  </div>

                  <AppFormField
                    v-model="formData.job_desc"
                    label="Job Description"
                    type="textarea"
                    placeholder="Describe the duties, responsibilities, and scope of the position..."
                    :rows="7"
                    :required="true"
                    :error="errors.job_desc"
                  />

                  <div class="grid grid-cols-2 gap-4">
                    <AppFormField
                      v-model="formData.salary_grade as any"
                      label="Salary Grade"
                      placeholder="e.g. 11"
                    />
                    <AppFormField
                      v-model="formData.salary_rate"
                      label="Salary Rate"
                      placeholder="e.g. ₱22,190/month"
                    />
                  </div>
                </div>

                <!-- STEP 3: Qualifications -->
                <div v-else-if="currentStep === 3" key="3" class="space-y-5">
                  <div class="mb-6">
                    <h2
                      class="text-xl text-white font-light"
                      style="font-family: 'DM Serif Display', serif"
                    >
                      Qualifications
                    </h2>
                    <p class="text-slate-500 text-sm mt-1">
                      Specify the desired candidate qualifications.
                    </p>
                  </div>

                  <div class="grid grid-cols-2 gap-4">
                    <AppFormField
                      v-model="formData.education_desired"
                      label="Education"
                      type="textarea"
                      placeholder="e.g. Bachelor's degree relevant to the job"
                      :rows="3"
                      :optional="true"
                    />
                    <AppFormField
                      v-model="formData.experience_desired"
                      label="Experience"
                      type="textarea"
                      placeholder="e.g. 1 year of relevant work experience"
                      :rows="3"
                      :optional="true"
                    />
                    <AppFormField
                      v-model="formData.eligibility_desired"
                      label="Eligibility"
                      type="textarea"
                      placeholder="e.g. Career Service Professional / 2nd Level Eligibility"
                      :rows="3"
                      :optional="true"
                    />
                    <AppFormField
                      v-model="formData.trainings_desired"
                      label="Trainings"
                      type="textarea"
                      placeholder="e.g. 4 hours of relevant training"
                      :rows="3"
                      :optional="true"
                    />
                  </div>

                  <AppFormField
                    v-model="formData.other_qualifications"
                    label="Other Qualifications"
                    type="textarea"
                    placeholder="Any other skills, traits, or requirements..."
                    :rows="3"
                    :optional="true"
                  />

                  <!-- Summary Preview -->
                  <div class="bg-slate-800/50 border border-slate-700/60 rounded-xl p-4">
                    <p
                      class="text-[10px] font-semibold tracking-widest uppercase text-slate-500 mb-3"
                    >
                      Summary Preview
                    </p>
                    <div class="grid grid-cols-3 gap-3">
                      <div
                        v-for="item in [
                          { label: 'Position', value: formData.open_position || '—' },
                          { label: 'Campus', value: formData.campus || '—' },
                          { label: 'Department', value: formData.department_unit || '—' },
                          { label: 'Type', value: formData.position_type || '—' },
                          {
                            label: 'Slots',
                            value: formData.number_of_slots
                              ? String(formData.number_of_slots)
                              : '—',
                          },
                          { label: 'Salary', value: salaryPreview },
                        ]"
                        :key="item.label"
                      >
                        <p class="text-[10px] text-slate-600 uppercase tracking-wider mb-0.5">
                          {{ item.label }}
                        </p>
                        <p class="text-xs text-slate-300 font-medium truncate">{{ item.value }}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </Transition>
            </div>

            <!-- Footer -->
            <div class="px-8 py-5 border-t border-gray-300 flex items-center justify-between">
              <button
                v-if="currentStep > 1"
                @click="prevStep"
                class="flex items-center gap-1.5 text-slate-400 hover:text-white text-sm transition-colors px-3 py-2 rounded-lg hover:bg-slate-800"
              >
                <PhArrowLeft class="w-4 h-4" />
                Back
              </button>
              <span v-else />

              <div class="flex items-center gap-3">
                <span class="text-xs text-slate-600">{{ currentStep }} / {{ steps.length }}</span>

                <button
                  v-if="currentStep < steps.length"
                  @click="nextStep"
                  class="flex items-center gap-2 text-white text-sm px-5 py-2.5 rounded-lg transition-all font-medium"
                  :class="
                    isCurrentStepValid
                      ? 'bg-violet-600 hover:bg-violet-500'
                      : 'bg-slate-700 cursor-not-allowed opacity-60'
                  "
                >
                  Continue
                  <PhArrowRight class="w-4 h-4" />
                </button>

                <button
                  v-else
                  @click="submitJob()"
                  :disabled="isLoading"
                  class="flex items-center gap-2 text-white text-sm px-5 py-2.5 rounded-lg transition-all font-semibold"
                  :class="
                    isLoading
                      ? 'bg-violet-700 opacity-70 cursor-not-allowed'
                      : 'bg-violet-600 hover:bg-violet-500'
                  "
                >
                  <PhSpinner v-if="isLoading" class="w-4 h-4 animate-spin" />
                  <PhCheck v-else class="w-4 h-4" weight="bold" />
                  {{ isLoading ? 'Posting…' : 'Post Job' }}
                </button>
              </div>
            </div>
          </template>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>

<style scoped>
.slide-enter-active,
.slide-leave-active {
  transition:
    opacity 0.18s ease,
    transform 0.18s ease;
}
.slide-enter-from {
  opacity: 0;
  transform: translateX(14px);
}
.slide-leave-to {
  opacity: 0;
  transform: translateX(-14px);
}

select option {
  background: #1e293b;
}
</style>
