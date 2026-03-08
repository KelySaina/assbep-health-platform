import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Program, Article, Partner, Statistic } from '@/types'
import { fetchPrograms, fetchArticles, fetchPartners } from '@/api'

export const useAppStore = defineStore('app', () => {
  const programs = ref<Program[]>([])
  const articles = ref<Article[]>([])
  const stats = ref<Statistic[]>([
    { id: 1, key: 'people_helped', value: 25000, label: 'People Helped', icon: 'users', order: 1 },
    { id: 2, key: 'programs_launched', value: 48, label: 'Programs Launched', icon: 'clipboard', order: 2 },
    { id: 3, key: 'volunteers', value: 350, label: 'Volunteers', icon: 'heart', order: 3 },
    { id: 4, key: 'regions_covered', value: 12, label: 'Regions Covered', icon: 'map', order: 4 },
  ])
  const partners = ref<Partner[]>([])
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

  // Initialize all data
  const initializeData = async () => {
    await Promise.all([
      loadPrograms(),
      loadArticles(),
      loadPartners()
    ])
  }

  const featuredPrograms = () => programs.value.filter(p => p.published).slice(0, 3)
  const latestArticles = () => articles.value.slice(0, 3)

  return {
    programs,
    articles,
    stats,
    partners,
    loading,
    error,
    loadPrograms,
    loadArticles,
    loadPartners,
    initializeData,
    featuredPrograms,
    latestArticles,
  }
})
