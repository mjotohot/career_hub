import { supabase } from '@/services/supabase'

export const baseJobsQuery = () =>
  supabase.from('jobs').select(`
    job_id,
    campus,
    department_unit,
    open_position,
    job_desc,
    number_of_slots,
    position_type,
    salary_grade,
    salary_rate,
    education_desired,
    experience_desired,
    eligibility_desired,
    trainings_desired,
    other_qualifications,
    created_at,
    status
  `)
