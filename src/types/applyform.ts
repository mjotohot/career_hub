export interface ApplicationFormData {
  fullName: string
  email: string
  birthdate: string
  mobileNumber: string
  gender: string
  region: string
  province: string
  city: string
  skills: string
  education: string
  experience: string
  training: string
  eligiblity: string
  pdsFile: File | null
  wesFile: File | null
}

export interface ApplicationPayload extends ApplicationFormData {
  jobId: string
}
