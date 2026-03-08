import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Program, Article, Partner, Statistic, HomepageData } from '@/types'

// Mock data for development — will be replaced by API calls
const mockPrograms: Program[] = [
  {
    id: 1,
    title: 'Maternal Health Program',
    description: 'Comprehensive maternal health care including prenatal and postnatal support, education, and medical outreach for expectant mothers in underserved communities.',
    image: 'https://images.unsplash.com/photo-1584515933487-779824d29309?w=600',
    category: 'maternal',
    slug: 'maternal-health-program',
    language: 'en',
    order: 1,
    published: true,
  },
  {
    id: 2,
    title: 'Community Vaccination',
    description: 'Organizing and facilitating vaccination drives to protect communities from preventable diseases, with a focus on children and vulnerable populations.',
    image: 'https://images.unsplash.com/photo-1632053001332-2f6735363d10?w=600',
    category: 'vaccination',
    slug: 'community-vaccination',
    language: 'en',
    order: 2,
    published: true,
  },
  {
    id: 3,
    title: 'Nutrition Awareness',
    description: 'Educating communities about balanced nutrition, healthy eating habits, and addressing malnutrition through workshops and food distribution programs.',
    image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=600',
    category: 'nutrition',
    slug: 'nutrition-awareness',
    language: 'en',
    order: 3,
    published: true,
  },
  {
    id: 4,
    title: 'Public Health Awareness',
    description: 'Raising awareness about public health issues including hygiene, disease prevention, and healthy lifestyle choices through community campaigns.',
    image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=600',
    category: 'outreach',
    slug: 'public-health-awareness',
    language: 'en',
    order: 4,
    published: true,
  },
  {
    id: 5,
    title: 'Medical Outreach',
    description: 'Bringing healthcare services directly to remote and underserved communities through mobile clinics and medical volunteer teams.',
    image: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=600',
    category: 'outreach',
    slug: 'medical-outreach',
    language: 'en',
    order: 5,
    published: true,
  },
  {
    id: 6,
    title: 'Community Wellness',
    description: 'Holistic wellness programs promoting mental health, physical fitness, and overall well-being within communities through group activities and counseling.',
    image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=600',
    category: 'wellness',
    slug: 'community-wellness',
    language: 'en',
    order: 6,
    published: true,
  },
]

const mockArticles: Article[] = [
  {
    id: 1,
    title: 'Improving Maternal Health in Rural Communities',
    slug: 'improving-maternal-health-rural-communities',
    excerpt: 'Our recent outreach program has reached over 500 expectant mothers in rural areas, providing essential prenatal care and education.',
    content: '<p>Full article content here...</p>',
    author: 'Dr. Marie Dupont',
    featured_image: 'https://images.unsplash.com/photo-1584515933487-779824d29309?w=600',
    language: 'en',
    category: 'community_news',
    published_at: '2026-03-01',
  },
  {
    id: 2,
    title: 'Vaccination Drive Reaches New Milestone',
    slug: 'vaccination-drive-new-milestone',
    excerpt: 'ASSBEP\'s community vaccination program has successfully vaccinated 10,000 children against preventable diseases.',
    content: '<p>Full article content here...</p>',
    author: 'Jean-Pierre Kamga',
    featured_image: 'https://images.unsplash.com/photo-1632053001332-2f6735363d10?w=600',
    language: 'en',
    category: 'community_news',
    published_at: '2026-02-20',
  },
  {
    id: 3,
    title: '5 Tips for Healthy Eating on a Budget',
    slug: '5-tips-healthy-eating-budget',
    excerpt: 'Learn practical tips for maintaining a nutritious diet without breaking the bank, from our nutrition experts.',
    content: '<p>Full article content here...</p>',
    author: 'Nutrition Team',
    featured_image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=600',
    language: 'en',
    category: 'health_tips',
    published_at: '2026-02-15',
  },
]

const mockStats: Statistic[] = [
  { id: 1, key: 'people_helped', value: 25000, label: 'People Helped', icon: 'users', order: 1 },
  { id: 2, key: 'programs_launched', value: 48, label: 'Programs Launched', icon: 'clipboard', order: 2 },
  { id: 3, key: 'volunteers', value: 350, label: 'Volunteers', icon: 'heart', order: 3 },
  { id: 4, key: 'regions_covered', value: 12, label: 'Regions Covered', icon: 'map', order: 4 },
]

const mockPartners: Partner[] = [
  { id: 1, name: 'World Health Organization', logo: 'https://via.placeholder.com/200x80?text=WHO', website: 'https://who.int', order: 1 },
  { id: 2, name: 'UNICEF', logo: 'https://via.placeholder.com/200x80?text=UNICEF', website: 'https://unicef.org', order: 2 },
  { id: 3, name: 'Red Cross', logo: 'https://via.placeholder.com/200x80?text=Red+Cross', website: 'https://redcross.org', order: 3 },
  { id: 4, name: 'Ministry of Health', logo: 'https://via.placeholder.com/200x80?text=MoH', website: '#', order: 4 },
  { id: 5, name: 'Community Foundation', logo: 'https://via.placeholder.com/200x80?text=CF', website: '#', order: 5 },
]

export const useAppStore = defineStore('app', () => {
  const programs = ref<Program[]>(mockPrograms)
  const articles = ref<Article[]>(mockArticles)
  const stats = ref<Statistic[]>(mockStats)
  const partners = ref<Partner[]>(mockPartners)
  const loading = ref(false)
  const error = ref<string | null>(null)

  const featuredPrograms = () => programs.value.filter(p => p.published).slice(0, 3)
  const latestArticles = () => articles.value.slice(0, 3)

  return {
    programs,
    articles,
    stats,
    partners,
    loading,
    error,
    featuredPrograms,
    latestArticles,
  }
})
