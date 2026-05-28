import axios from 'axios'
import type { ContactRequest } from '@/types'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

// Public API
export const fetchHomepage = () =>
  api.get('/homepage')

export const fetchPrograms = (language?: string) =>
  api.get('/programs', { params: { language } })

export const fetchProgram = (slug: string) =>
  api.get(`/programs/${slug}`)

export const fetchArticles = (language?: string, category?: string) =>
  api.get('/articles', { params: { language, category } })

export const fetchArticle = (slug: string) =>
  api.get(`/articles/${slug}`)

export const fetchResources = (language?: string, type?: string) =>
  api.get('/resources', { params: { language, type } })

export const fetchPartners = () =>
  api.get('/partners')

export const fetchContactInfo = () =>
  api.get('/contact-info')

export const submitContactForm = (data: ContactRequest) =>
  api.post('/contact', data)

export const fetchTranslations = (language: string) =>
  api.get('/translations', { params: { language } })

export default api
