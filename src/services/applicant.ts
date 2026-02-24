import { supabase } from '@/services/supabase'

export async function getApplicationsByStatus(match_status: 'pass' | 'fail') {
  const { data, error } = await supabase
    .from('applications')
    .select(
      `
      application_id,
      applied_at,
      pds_file,
      wes_file,
      job_id,
      applicants (
        applicant_id,
        full_name,
        email
      )
    `,
    )
    .eq('match_status', match_status)

  if (error) throw error
  return data
}

export async function getAllApplications(status?: 'pass' | 'fail' | 'all', searchQuery?: string) {
  let query = supabase.from('applications').select(
    `
      application_id,
      applied_at,
      pds_file,
      wes_file,
      match_status,
      job_id,
      applicants (
        applicant_id,
        full_name,
        email
      ),
      jobs (
        job_id,
        open_position,
        campus,
        department_unit
      )
    `,
  )

  if (status && status !== 'all') {
    query = query.eq('match_status', status)
  }

  if (searchQuery && searchQuery.trim()) {
    query = query.or(
      `applicants.full_name.ilike.%${searchQuery}%,applicants.email.ilike.%${searchQuery}%,jobs.open_position.ilike.%${searchQuery}%,jobs.campus.ilike.%${searchQuery}%`,
    )
  }

  const { data, error } = await query.order('applied_at', { ascending: false })

  if (error) throw error
  return data
}

export async function getApplicationsByEmail(email: string) {
  const { data, error } = await supabase
    .from('applications')
    .select(
      `
      application_id,
      applied_at,
      pds_file,
      wes_file,
      match_status,
      applicants (
        applicant_id,
        full_name,
        email
      ),
      jobs (
        job_id,
        open_position,
        campus,
        department_unit
      )
    `,
    )
    // use case-insensitive match to avoid missing results due to casing
    .ilike('applicants.email', `${email}`)
    .order('applied_at', { ascending: false })

  if (error) throw error
  return data
}
