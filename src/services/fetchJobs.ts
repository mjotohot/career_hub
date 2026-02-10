import { supabase } from './supabase'
import type { Job } from '@/types/jobs'
import type { JobFilters } from '@/types/jobFilters'

export const fetchJobsService = async (
  filters: JobFilters,
): Promise<{ data: Job[]; total: number }> => {
  const { page, pageSize, searchQuery, jobType, campus, timePosted } = filters
  const from = (page - 1) * pageSize
  const to = from + pageSize - 1

  let query = supabase.from('jobs').select('*', { count: 'exact' })

  if (searchQuery) query = query.ilike('open_position', `%${searchQuery}%`)
  if (jobType) query = query.eq('position_type', jobType)
  if (campus) query = query.eq('campus', campus)

  if (timePosted) {
    const days = timePosted === '24h' ? 1 : timePosted === '7d' ? 7 : 30
    const dateLimit = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString()
    query = query.gte('created_at', dateLimit)
  }

  const { data, error, count } = await query
    .order('created_at', { ascending: false })
    .range(from, to)

  if (error) {
    console.error('Error fetching jobs:', error)
    return { data: [], total: 0 }
  }

  console.log('Fetched jobs:', data)
  return { data: data ?? [], total: count ?? 0 }
}
