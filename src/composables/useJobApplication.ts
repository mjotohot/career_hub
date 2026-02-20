import { ref, reactive, computed } from 'vue'
import type { Job } from '@/types/jobs'
import type { ApplicationFormData, ApplicationPayload } from '@/types/applyform'
import { jobApplicationService } from '@/services/jobApplication'
import { assessJobMatch } from '@/services/geminiJobMatcher'
import { saveGeminiMatchResult } from '@/services/jobMatchService'

export function useJobApplication(job: Job) {
  const initialFormData: ApplicationFormData = {
    fullName: '',
    email: '',
    birthdate: '',
    mobileNumber: '',
    gender: '',
    region: '',
    province: '',
    city: '',
    skills: '',
    education: '',
    experience: '',
    training: '',
    eligiblity: '',
    pdsFile: null,
    wesFile: null,
  }

  const formData = reactive<ApplicationFormData>({ ...initialFormData })
  const currentStep = ref(1)
  const isLoading = ref(false)
  const jobMatchModalOpen = ref(false)
  const jobMatchStatus = ref<'loading' | 'pass' | 'fail' | null>(null)

  const steps = [
    { id: 1, label: 'Personal' },
    { id: 2, label: 'Documents' },
    { id: 3, label: 'Confirm' },
  ]

  const stepRequirements: Record<number, (keyof ApplicationFormData)[]> = {
    1: ['fullName', 'email', 'birthdate', 'mobileNumber', 'gender', 'region', 'province', 'city'],
    2: ['skills', 'education', 'experience', 'training', 'eligiblity'],
    3: ['pdsFile', 'wesFile'],
  }

  const isCurrentStepValid = computed(
    () => stepRequirements[currentStep.value]?.every((key) => Boolean(formData[key])) ?? false,
  )

  const canSubmit = computed(() => currentStep.value === 3 && isCurrentStepValid.value)

  const resetForm = () => {
    currentStep.value = 1
    Object.assign(formData, initialFormData)
  }

  const nextStep = () => {
    if (isCurrentStepValid.value && currentStep.value < steps.length) currentStep.value++
  }

  const prevStep = () => {
    if (currentStep.value > 1) currentStep.value--
  }

  const submitApplication = async (toast: any) => {
    if (!canSubmit.value || isLoading.value) {
      toast?.add('warning', 'Please complete all required documents.')
      return
    }

    try {
      isLoading.value = true
      const result = await jobApplicationService({
        ...formData,
        jobId: job.job_id,
      } satisfies ApplicationPayload)

      if (!result.success) {
        toast?.add('error', 'Failed to submit application. Please try again.')
        return
      }

      const applicantSnapshot = { ...formData }
      resetForm()

      jobMatchStatus.value = 'loading'
      jobMatchModalOpen.value = true

      const matchResult = await assessJobMatch(
        job,
        applicantSnapshot,
        import.meta.env.VITE_GEMINI_API_KEY,
      )

      jobMatchStatus.value = matchResult.status === 'pass' ? 'pass' : 'fail'
      await saveGeminiMatchResult(result.applicationId, matchResult)
    } catch (error) {
      toast?.add('error', 'An unexpected error occurred. Please try again.')
      console.error('Application submission error:', error)
      jobMatchModalOpen.value = false
      jobMatchStatus.value = null
    } finally {
      isLoading.value = false
    }
  }

  return {
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
  }
}
