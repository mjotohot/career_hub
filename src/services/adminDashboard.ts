import { supabase } from '@/services/supabase'
import type { Job } from '@/types/jobs'
import type { Application } from '@/types/application'

export async function fetchJobs(): Promise<Job[]> {
  const { data, error } = await supabase.from('jobs').select('*')
  if (error) {
    console.error('Error fetching jobs:', error)
    return []
  }
  return data as Job[]
}

export async function fetchApplications(): Promise<Application[]> {
  const { data, error } = await supabase.from('applications').select('job_id, applicant_id')
  if (error) {
    console.error('Error fetching applications:', error)
    return []
  }
  return data as Application[]
}

export async function fetchApplicantsCount(): Promise<number> {
  const { count, error } = await supabase
    .from('applicants')
    .select('applicant_id', { count: 'exact' })
  if (error) {
    console.error('Error fetching applicants:', error)
    return 0
  }
  return count ?? 0
}

export async function fetchDashboardStats() {
  const jobs = await fetchJobs()
  const applications = await fetchApplications()
  const totalApplicants = await fetchApplicantsCount()

  // Active and inactive jobs based on number_of_slots > 0
  const activeJobs = jobs.filter((job) => job.number_of_slots > 0 && job.status === 'open')
  const inactiveJobs = jobs.filter((job) => job.number_of_slots === 0 || job.status === 'closed')

  // Applications per active job
  const applicationsPerJob: Record<string, number> = {}
  applications.forEach((app) => {
    if (!applicationsPerJob[app.job_id]) applicationsPerJob[app.job_id] = 0
    applicationsPerJob[app.job_id]++
  })

  const averageApplicants =
    activeJobs.length > 0
      ? activeJobs.reduce((sum, job) => sum + (applicationsPerJob[job.job_id] || 0), 0) /
        activeJobs.length
      : 0

  return {
    activeJobs,
    inactiveJobs,
    totalApplicants,
    averageApplicants,
  }
}
