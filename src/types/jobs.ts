export interface Job {
  request_id: number
  job_id: string
  campus: string
  department_unit: string
  open_position: string
  job_desc: string
  item_no: string
  number_of_slots: number
  position_type: 'Full-Time' | 'COS'
  form_type: string
  requisition_type: string
  salary_grade: number
  salary_rate: string
  fund_source: string
  education_desired: string
  experience_desired: string
  eligibility_desired: string
  gov_exam_passed: 'Yes' | 'No'
  trainings_desired: string
  other_qualifications: string
  date_of_request: string
  expected_term_of_service: string
  status: 'open' | 'closed'
  created_at: string
}
