export interface Applicant {
  id: number
  name: string
  email: string
  status: 'pass' | 'partial' | 'fail'
  appliedDate: string
  personalDataSheet: string
  workExperience: string
  bachelorsDiploma: string
  eligibilityCertificate: string
}
