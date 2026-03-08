import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Program, Article, Partner, Statistic, Resource } from '@/types'
import { fetchPrograms, fetchArticles, fetchPartners, fetchResources } from '@/api'
import axios from 'axios'

export const useAppStore = defineStore('app', () => {
  const programs = ref<Program[]>([])
  const articles = ref<Article[]>([])
  const stats = ref<Statistic[]>([])
  const partners = ref<Partner[]>([])
  const resources = ref<Resource[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Load programs from API
  const loadPrograms = async (language?: string) => {
    loading.value = true
    error.value = null
    try {
      const response = await fetchPrograms(language)
      programs.value = response.data
    } catch (err: any) {
      error.value = err.message || 'Failed to load programs'
      console.error('Error loading programs:', err)
    } finally {
      loading.value = false
    }
  }

  // Load articles from API
  const loadArticles = async (language?: string, category?: string) => {
    loading.value = true
    error.value = null
    try {
      const response = await fetchArticles(language, category)
      articles.value = response.data
    } catch (err: any) {
      error.value = err.message || 'Failed to load articles'
      console.error('Error loading articles:', err)
    } finally {
      loading.value = false
    }
  }

  // Load partners from API
  const loadPartners = async () => {
    loading.value = true
    error.value = null
    try {
      const response = await fetchPartners()
      partners.value = response.data
    } catch (err: any) {
      error.value = err.message || 'Failed to load partners'
      console.error('Error loading partners:', err)
    } finally {
      loading.value = false
    }
  }

  // Load resources from API
  const loadResources = async (language?: string, type?: string) => {
    loading.value = true
    error.value = null
    try {
      const response = await fetchResources(language, type)
      resources.value = response.data
    } catch (err: any) {
      error.value = err.message || 'Failed to load resources'
      console.error('Error loading resources:', err)
    } finally {
      loading.value = false
    }
  }

  // Load stats from API
  const loadStats = async () => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || '/api'
      console.log('Loading stats from:', `${apiUrl}/settings/stats`)
      const response = await axios.get(`${apiUrl}/settings/stats`)
      const data = response.data
      console.log('Stats data received:', data)

      // Map stats with proper labels and icons
      const statConfig: Record<string, { label: string; icon: string }> = {
        people_helped: { label: 'People Helped', icon: 'users' },
        programs_launched: { label: 'Programs Launched', icon: 'clipboard' },
        volunteers: { label: 'Volunteers', icon: 'heart' },
        partners: { label: 'Partners', icon: 'map' },
      }

      const updatedStats: Statistic[] = []
      let order = 1

      for (const [key, value] of Object.entries(data)) {
        const config = statConfig[key]
        if (config && typeof value === 'number') {
          updatedStats.push({
            id: order,
            key,
            value,
            label: config.label,
            icon: config.icon,
            order: order++,
          })
        }
      }

      console.log('Updated stats:', updatedStats)
      if (updatedStats.length > 0) {
        stats.value = updatedStats
      }
    } catch (err: any) {
      console.error('Error loading stats:', err)
      // Keep default stats if API fails
    }
  }

  // Initialize all data
  const initializeData = async () => {
    await Promise.all([
      loadPrograms(),
      loadArticles(),
      loadPartners(),
      loadResources(),
      loadStats(),
    ])
  }

  const featuredPrograms = () => programs.value.filter(p => p.published).slice(0, 3)
  const latestArticles = () => articles.value.slice(0, 3)

  return {
    programs,
    articles,
    stats,
    partners,
    resources,
    loading,
    error,
    loadPrograms,
    loadArticles,
    loadPartners,
    loadResources,
    loadStats,
    initializeData,
    featuredPrograms,
    latestArticles,
  }
})
