import { defineStore } from 'pinia'
import type { Job } from '@/types/jobs'
import type { JobFilters } from '@/types/jobFilters'
import { fetchJobsService } from '@/services/fetchJobs'

export const useJobsStore = defineStore('jobs', {
  state: () => ({
    jobs: [] as Job[],
    filters: {
      page: 1,
      pageSize: 5,
      searchQuery: '',
      jobType: '',
      campus: '',
      timePosted: '',
    } as JobFilters,
    total: 0,
    isLoading: false,
  }),

  actions: {
    async fetchJobs() {
      this.isLoading = true
      const { data, total } = await fetchJobsService(this.filters)
      this.jobs = data
      this.total = total
      this.isLoading = false
    },

    async resetAndFetch() {
      this.filters.page = 1
      await this.fetchJobs()
    },

    async nextPage() {
      if (this.filters.page * this.filters.pageSize < this.total) {
        this.filters.page++
        await this.fetchJobs()
      }
    },

    async previousPage() {
      if (this.filters.page > 1) {
        this.filters.page--
        await this.fetchJobs()
      }
    },
  },
})
