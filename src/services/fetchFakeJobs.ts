import type { Job } from '@/types/jobs'

export async function fetchJobsService(): Promise<Job[]> {
  const response = await fetch('https://jsonfakery.com/jobs')
  if (!response.ok) {
    throw new Error('Failed to fetch jobs')
  }
  return response.json()
}
