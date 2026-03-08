// Types for ASSBEP Health Platform

export interface Translation {
  id: number
  key: string
  language: 'en' | 'fr'
  value: string
  group?: string
}

export interface HeroData {
  title: string
  subtitle: string
  cta_text: string
  cta_link: string
  background_image: string
}

export interface Program {
  id: number
  title: string
  description: string
  image: string
  category: string
  slug: string
  language: 'en' | 'fr'
  order: number
  published: boolean
}

export interface Article {
  id: number
  title: string
  slug: string
  excerpt: string
  content: string
  author: string
  featured_image: string
  language: 'en' | 'fr'
  category: string
  published_at: string
}

export interface Resource {
  id: number
  title: string
  description: string
  file: string
  type: 'guide' | 'video' | 'document'
  language: 'en' | 'fr'
  category: string
}

export interface Partner {
  id: number
  name: string
  logo: string
  website: string
  description?: string
  order: number
}

export interface ContactInfo {
  address: string
  phone: string
  email: string
  map: string
  office_hours: string
}

export interface ContactRequest {
  name: string
  email: string
  subject: string
  message: string
}

export interface Statistic {
  id: number
  key: string
  value: number
  label: string
  icon: string
  order: number
}

export interface MediaItem {
  id: number
  url: string
  type: 'image' | 'document' | 'logo' | 'video'
  alt_text: string
  uploaded_at: string
}

export interface HomepageData {
  hero: HeroData
  mission: {
    title: string
    description: string
    image: string
  }
  programs: Program[]
  stats: Statistic[]
  articles: Article[]
  partners: Partner[]
}

export interface User {
  id: number
  name: string
  email: string
  role: 'super_admin' | 'editor' | 'translator'
  avatar?: string
}

export interface AuthResponse {
  user: User
  token: string
}

export interface SEOMeta {
  meta_title: string
  meta_description: string
  og_image: string
  slug: string
}
