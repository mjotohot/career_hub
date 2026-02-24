export interface ApplicationResult {
  application_id: string
  applied_at: string
  pds_file: string
  wes_file: string
  match_status: string
  applicants: {
    applicant_id: string
    full_name: string
    email: string
  }
  jobs: {
    job_id: string
    open_position: string
    campus: string
    department_unit: string
  }
}
