export type ScreeningStatus = 'passed' | 'partial' | 'failed'

export interface EmailParams {
  full_name: string
  email: string
  open_position: string
  match_status: ScreeningStatus
}

export interface EmailServiceResponse {
  success: boolean
  message?: string
  error?: any
}
