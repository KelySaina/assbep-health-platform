import axios from 'axios'
import type { Program, Article, Resource, Partner, HomepageData, ContactRequest, ContactInfo } from '@/types'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

// Public API
export const fetchHomepage = () =>
  api.get<HomepageData>('/homepage')

export const fetchPrograms = (language?: string) =>
  api.get<Program[]>('/programs', { params: { language } })

export const fetchProgram = (slug: string) =>
  api.get<Program>(`/programs/${slug}`)

export const fetchArticles = (language?: string, category?: string) =>
  api.get<Article[]>('/articles', { params: { language, category } })

export const fetchArticle = (slug: string) =>
  api.get<Article>(`/articles/${slug}`)

export const fetchResources = (language?: string, type?: string) =>
  api.get<Resource[]>('/resources', { params: { language, type } })

export const fetchPartners = () =>
  api.get<Partner[]>('/partners')

export const fetchContactInfo = () =>
  api.get<ContactInfo>('/contact-info')

export const submitContactForm = (data: ContactRequest) =>
  api.post('/contact', data)

export const fetchTranslations = (language: string) =>
  api.get('/translations', { params: { language } })

export default api
