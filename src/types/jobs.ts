export interface Job {
  job_id: string
  campus: string
  department_unit: string
  open_position: string
  job_desc: string
  number_of_slots: number
  position_type: 'Full-Time' | 'COS'
  salary_grade: number
  salary_rate: string
  education_desired: string
  experience_desired: string
  eligibility_desired: string
  trainings_desired: string
  other_qualifications: string
  created_at: string
  status: 'open' | 'closed'
  // date_of_request: string
  // expected_term_of_service: string
  // request_id: number
  // fund_source: string
  // gov_exam_passed: 'Yes' | 'No'
  // form_type: string
  // requisition_type: string
  // item_no: string
}
