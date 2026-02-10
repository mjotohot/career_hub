import { defineStore } from 'pinia'
import type { Job } from '@/types/jobs'
import { fetchJobsService } from '@/services/fetchJobs'

export const useJobsStore = defineStore('jobs', {
  state: () => ({
    jobs: [] as Job[],
    page: 1,
    pageSize: 5,
    total: 0,
    searchQuery: '' as string,
    jobType: '' as '' | 'Full-Time' | 'Contract of Service',
    timePosted: '' as '' | '24h' | '7d' | '30d',
    campus: '' as string,
    isLoading: false,
  }),

  actions: {
    async fetchJobs() {
      this.isLoading = true
      const { data, total } = await fetchJobsService({
        page: this.page,
        pageSize: this.pageSize,
        searchQuery: this.searchQuery,
        jobType: this.jobType,
        campus: this.campus,
        timePosted: this.timePosted,
      })

      this.jobs = data
      this.total = total
      this.isLoading = false
    },

    async resetAndFetch() {
      this.page = 1
      await this.fetchJobs()
    },

    async nextPage() {
      if (this.page * this.pageSize < this.total) {
        this.page++
        await this.fetchJobs()
      }
    },

    async previousPage() {
      if (this.page > 1) {
        this.page--
        await this.fetchJobs()
      }
    },
  },
})
