<script setup lang="ts">
import { ref } from 'vue'
import type { Job } from '@/types/jobs'
import { useJobApplication } from '@/composables/useJobApplication'
import AppFormField from '@/components/inputs/AppFormField.vue'
import AppConfirmModal from '@/components/modals/AppConfirmModal.vue'
import AppJobMatchModal from '@/components/modals/JobMatchModal.vue'
import AppToast from '@/components/toasts/AppToast.vue'
import { PhInfo, PhX } from '@phosphor-icons/vue'

const props = defineProps<{ job: Job; isOpen: boolean }>()
const emit = defineEmits<{ close: [] }>()

const toast = ref<InstanceType<typeof AppToast>>()

const {
  formData,
  currentStep,
  isLoading,
  jobMatchModalOpen,
  jobMatchStatus,
  steps,
  isCurrentStepValid,
  canSubmit,
  nextStep,
  prevStep,
  resetForm,
  submitApplication,
} = useJobApplication(props.job)

const showCloseConfirm = ref(false)

const handleClose = () => {
  showCloseConfirm.value = true
}
const confirmClose = () => {
  showCloseConfirm.value = false
  resetForm()
  emit('close')
}
const handleMatchModalClose = () => {
  jobMatchModalOpen.value = false
  emit('close')
}
</script>

<template>
  <AppToast ref="toast" />

  <AppConfirmModal
    :is-open="showCloseConfirm"
    title="Discard application?"
    message="Your progress will be lost and cannot be recovered."
    confirm-label="Yes, discard"
    cancel-label="Keep editing"
    variant="error"
    @confirm="confirmClose"
    @cancel="showCloseConfirm = false"
  />

  <AppJobMatchModal
    :is-open="jobMatchModalOpen"
    :status="jobMatchStatus"
    :job-title="job.open_position"
    @close="handleMatchModalClose"
  />

  <dialog class="modal modal-bottom sm:modal-middle" :class="{ 'modal-open': isOpen }">
    <div class="modal-box max-w-4xl bg-base-100 p-0 overflow-hidden">
      <div class="p-6 border-b border-base-200 bg-base-200/30">
        <div class="flex justify-between items-center mb-6">
          <h3 class="font-bold text-lg">Apply for {{ job.open_position }}</h3>
          <button @click="handleClose" class="btn btn-sm btn-circle btn-ghost">
            <PhX :size="20" />
          </button>
        </div>
        <ul class="steps w-full mt-2">
          <li
            v-for="step in steps"
            :key="step.id"
            class="step text-[10px] uppercase font-bold tracking-tighter"
            :class="{ 'step-primary': currentStep >= step.id }"
          >
            {{ step.label }}
          </li>
        </ul>
      </div>

      <div class="p-8 min-h-75 max-h-[50vh] overflow-y-auto">
        <!-- Step 1 -->
        <div v-show="currentStep === 1" class="space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <AppFormField
              v-model="formData.fullName"
              label="Full Name"
              placeholder="Dela Cruz, Juan M."
              required
            />
            <AppFormField
              v-model="formData.email"
              label="Email Address"
              type="email"
              placeholder="juan@example.com"
              required
            />
            <div class="col-span-2 grid grid-cols-3 gap-4">
              <AppFormField v-model="formData.birthdate" label="Birthdate" type="date" required />
              <AppFormField
                v-model="formData.mobileNumber"
                label="Mobile Number"
                type="tel"
                placeholder="09123456789"
                required
              />
              <AppFormField
                v-model="formData.gender"
                label="Gender"
                type="select"
                :options="[
                  { label: 'Male', value: 'Male' },
                  { label: 'Female', value: 'Female' },
                ]"
                required
              />
            </div>
            <AppFormField
              v-model="formData.region"
              label="Region"
              type="select"
              :options="[
                { label: 'Region 1', value: 'Region 1' },
                { label: 'Region 2', value: 'Region 2' },
              ]"
              required
            />
            <AppFormField
              v-model="formData.province"
              label="Province"
              type="select"
              :options="[
                { label: 'Province 1', value: 'Province 1' },
                { label: 'Province 2', value: 'Province 2' },
              ]"
              required
            />
          </div>
          <AppFormField
            v-model="formData.city"
            label="City/Municipality"
            placeholder="ex. Butuan City"
            required
          />
        </div>

        <!-- Step 2 -->
        <div v-show="currentStep === 2" class="space-y-5">
          <p class="text-sm text-base-content/60 font-semibold -mt-1">
            Provide your professional background to help us evaluate your application.
          </p>
          <div class="grid grid-cols-2 gap-4">
            <AppFormField
              class="col-span-2"
              v-model="formData.skills"
              label="Skills"
              type="textarea"
              :rows="3"
              placeholder="e.g. Microsoft Office, Data Analysis, Project Management..."
              hint="List your key skills separated by commas"
              required
            />
            <AppFormField
              class="col-span-2"
              v-model="formData.education"
              label="Educational Background"
              type="textarea"
              :rows="3"
              placeholder="e.g. Bachelor of Science in Computer Science, UP, 2018..."
              hint="Include degree, school, and year graduated"
              required
            />
            <AppFormField
              class="col-span-2"
              v-model="formData.eligiblity"
              label="Eligibility"
              type="textarea"
              :rows="3"
              placeholder="e.g. Civil Service Professional, PRC Licensed Teacher, or Career Service Sub-Professional..."
              hint="Specify the type of eligibility, rating (if applicable), and date of conferment"
              required
            />
            <AppFormField
              v-model="formData.experience"
              label="Work Experience"
              type="textarea"
              :rows="5"
              placeholder="e.g. Administrative Officer II, DSWD, 2020-2023..."
              hint="List positions held, employer, and duration"
              :optional="true"
            />
            <AppFormField
              v-model="formData.training"
              label="Relevant Trainings / Seminars"
              type="textarea"
              :rows="5"
              placeholder="e.g. Leadership and Management Training, CSC, 2022..."
              hint="Include training title, organizer, and year"
              :optional="true"
            />
          </div>
        </div>

        <!-- Step 3 -->
        <div v-show="currentStep === 3" class="space-y-4">
          <h4 class="font-bold text-sm mb-2">Final Confirmation</h4>
          <div class="alert alert-info shadow-sm text-xs py-2 px-3 text-white">
            <PhInfo :size="16" />
            <span
              >Follow the naming convention: <strong>(Family Name)_(Hiring Office)</strong></span
            >
          </div>

          <fieldset class="fieldset">
            <AppFormField
              v-model="formData.pdsFile"
              label="Personal Data Sheet (PDS)"
              type="file"
              accept=".pdf,.doc,.docx"
              required
            >
              <template #file-confirmation>
                <p v-if="formData.pdsFile" class="text-xs text-success mt-1">
                  ✓ {{ (formData.pdsFile as File).name }}
                </p>
              </template>
            </AppFormField>
          </fieldset>

          <fieldset class="fieldset">
            <AppFormField
              v-model="formData.wesFile"
              label="Work Experience Sheet (WES)"
              type="file"
              accept=".pdf,.doc,.docx"
              required
            >
              <template #file-confirmation>
                <p v-if="formData.wesFile" class="text-xs text-success mt-1">
                  ✓ {{ (formData.wesFile as File).name }}
                </p>
              </template>
            </AppFormField>
          </fieldset>
        </div>
      </div>

      <div class="modal-action p-6 border-t border-base-200 bg-base-200/10">
        <button v-if="currentStep > 1" @click="prevStep" class="btn btn-ghost">Back</button>
        <div class="flex-1"></div>
        <button
          v-if="currentStep < 3"
          @click="nextStep"
          class="btn btn-primary px-8"
          :disabled="!isCurrentStepValid"
        >
          Next Step
        </button>
        <button
          v-else
          @click="submitApplication(toast)"
          class="btn btn-success text-white px-8"
          :disabled="!canSubmit || isLoading"
        >
          <span v-if="isLoading" class="loading loading-spinner mr-2" />
          {{ isLoading ? 'Submitting...' : 'Submit Application' }}
        </button>
      </div>
    </div>
  </dialog>
</template>
