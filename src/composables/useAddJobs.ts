import { ref, reactive, computed } from 'vue'
import type { Job } from '@/types/jobs'
import { createJob } from '@/services/addJobsService'

export type JobFormData = Omit<Job, 'job_id' | 'created_at'>

type JobFormErrors = Partial<Record<keyof JobFormData, string>>

const initialFormData: JobFormData = {
  campus: '',
  department_unit: '',
  open_position: '',
  job_desc: '',
  number_of_slots: 1,
  position_type: 'Full-Time',
  salary_grade: 0,
  salary_rate: '',
  education_desired: '',
  experience_desired: '',
  eligibility_desired: '',
  trainings_desired: '',
  other_qualifications: '',
  status: 'open',
}

const stepRequirements: Record<number, (keyof JobFormData)[]> = {
  1: ['open_position', 'campus', 'department_unit', 'position_type'],
  2: ['job_desc'],
  3: [],
}

export function useAddJob() {
  const formData = reactive<JobFormData>({ ...initialFormData })
  const currentStep = ref(1)
  const isLoading = ref(false)
  const isPosted = ref(false)
  const errors = ref<JobFormErrors>({})

  const steps = [
    { id: 1, label: 'Position' },
    { id: 2, label: 'Job Details' },
    { id: 3, label: 'Qualifications' },
  ]

  function validateStep(step: number): JobFormErrors {
    const e: JobFormErrors = {}
    const required = stepRequirements[step] ?? []

    for (const key of required) {
      const value = formData[key]
      const isEmpty =
        value === '' ||
        value === null ||
        value === undefined ||
        (typeof value === 'number' && value <= 0)
      if (isEmpty) e[key] = 'This field is required.'
    }

    return e
  }

  const isCurrentStepValid = computed(() => {
    return Object.keys(validateStep(currentStep.value)).length === 0
  })

  const canSubmit = computed(() => currentStep.value === steps.length && isCurrentStepValid.value)

  function nextStep() {
    const stepErrors = validateStep(currentStep.value)
    errors.value = stepErrors
    if (Object.keys(stepErrors).length === 0 && currentStep.value < steps.length) {
      currentStep.value++
    }
  }

  function prevStep() {
    if (currentStep.value > 1) {
      errors.value = {}
      currentStep.value--
    }
  }

  function goToStep(step: number) {
    if (step < currentStep.value) {
      errors.value = {}
      currentStep.value = step
    }
  }

  function resetForm() {
    Object.assign(formData, initialFormData)
    currentStep.value = 1
    errors.value = {}
    isPosted.value = false
  }

  async function submitJob(toast?: any) {
    const stepErrors = validateStep(currentStep.value)
    errors.value = stepErrors

    if (!canSubmit.value || isLoading.value) {
      toast?.add('warning', 'Please complete all required fields.')
      return
    }

    try {
      isLoading.value = true

      const result = await createJob({ ...formData })

      if (!result.success) {
        toast?.add('error', 'Failed to post job. Please try again.')
        return
      }

      isPosted.value = true
      toast?.add('success', 'Job posted successfully.')
    } catch (err) {
      console.error('Job creation error:', err)
      toast?.add('error', 'An unexpected error occurred. Please try again.')
    } finally {
      isLoading.value = false
    }
  }

  return {
    formData,
    currentStep,
    isLoading,
    isPosted,
    errors,
    steps,
    isCurrentStepValid,
    canSubmit,
    nextStep,
    prevStep,
    goToStep,
    resetForm,
    submitJob,
  }
}
