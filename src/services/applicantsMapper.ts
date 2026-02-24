import type { Applicant } from '@/types/applicant'

export function mapApplicationsByJob(rows: any[]): Record<string, Applicant[]> {
  const result: Record<string, Applicant[]> = {}

  for (const row of rows) {
    const jobId = row.job_id

    if (!result[jobId]) result[jobId] = []

    result[jobId].push({
      id: row.id,
      name: `${row.applicants.full_name}`,
      email: row.applicants.email,
      appliedDate: row.applied_at,
      personalDataSheet: row.pds_file,
      workExperience: row.wes_file,
    })
  }

  return result
}
