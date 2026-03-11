import { supabase } from './supabase'
import type { Job } from '@/types/jobs'
import type { JobFormData } from '@/composables/useAddJobs'

export async function createJob(payload: JobFormData) {
  try {
    const { data, error } = await supabase.from('jobs').insert([payload]).select().single()

    if (error) throw error
    return { success: true, job: data as Job }
  } catch (err) {
    console.error('Error creating job:', err)
    return { success: false, error: err }
  }
}

export async function fetchJobs() {
  try {
    const { data, error } = await supabase
      .from('jobs')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    return { success: true, jobs: data as Job[] }
  } catch (err) {
    console.error('Error fetching jobs:', err)
    return { success: false, error: err }
  }
}

export async function fetchJobById(jobId: string) {
  try {
    const { data, error } = await supabase.from('jobs').select('*').eq('job_id', jobId).single()

    if (error) throw error
    return { success: true, job: data as Job }
  } catch (err) {
    console.error('Error fetching job:', err)
    return { success: false, error: err }
  }
}

export async function updateJob(jobId: string, payload: Partial<JobFormData>) {
  try {
    const { data, error } = await supabase
      .from('jobs')
      .update(payload)
      .eq('job_id', jobId)
      .select()
      .single()

    if (error) throw error
    return { success: true, job: data as Job }
  } catch (err) {
    console.error('Error updating job:', err)
    return { success: false, error: err }
  }
}

export async function updateJobStatus(jobId: string, status: Job['status']) {
  return updateJob(jobId, { status })
}

export async function deleteJob(jobId: string) {
  try {
    const { error } = await supabase.from('jobs').delete().eq('job_id', jobId)

    if (error) throw error
    return { success: true }
  } catch (err) {
    console.error('Error deleting job:', err)
    return { success: false, error: err }
  }
}
