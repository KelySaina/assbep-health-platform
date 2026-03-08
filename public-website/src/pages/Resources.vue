<template>
  <div>
    <!-- Page Header -->
    <section class="bg-gradient-to-br from-primary to-primary-dark py-16 md:py-24">
      <div class="container-narrow text-center text-white">
        <h1 class="text-4xl md:text-5xl font-headline font-semibold mb-4">{{ $t('resources.title') }}</h1>
        <p class="text-lg text-blue-100 max-w-2xl mx-auto">{{ $t('resources.subtitle') }}</p>
      </div>
    </section>

    <!-- Category Tabs -->
    <section class="py-8 border-b">
      <div class="container-narrow">
        <div class="flex flex-wrap gap-2 justify-center">
          <button
            v-for="cat in resourceCategories"
            :key="cat"
            @click="activeTab = cat"
            :class="[
              'px-4 py-2 text-sm font-medium rounded-full transition-all duration-200',
              activeTab === cat
                ? 'bg-primary text-white'
                : 'bg-primary-light text-primary hover:bg-blue-100'
            ]"
          >
            {{ $t(`resources.categories.${cat}`) }}
          </button>
        </div>
      </div>
    </section>

    <!-- Resources List -->
    <section class="py-16">
      <div class="container-narrow">
        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div v-for="resource in filteredResources" :key="resource.id" class="card">
            <div class="flex items-start space-x-4">
              <div class="w-12 h-12 bg-primary-light rounded-xl flex items-center justify-center flex-shrink-0">
                <svg v-if="resource.type === 'guide'" class="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                <svg v-else-if="resource.type === 'video'" class="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                <svg v-else class="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div class="flex-1">
                <h3 class="font-headline font-semibold text-gray-900">{{ resource.title }}</h3>
                <p class="text-sm text-neutral mt-1">{{ resource.description }}</p>
                <button class="mt-3 text-primary text-sm font-medium flex items-center hover:underline">
                  {{ resource.type === 'video' ? $t('resources.watch') : $t('resources.download') }}
                  <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
        <div v-if="filteredResources.length === 0" class="text-center py-16">
          <p class="text-neutral text-lg">No resources available in this category yet.</p>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Resource } from '@/types'

const activeTab = ref('guides')
const resourceCategories = ['guides', 'videos', 'documents']

const mockResources: Resource[] = [
  { id: 1, title: 'Maternal Health Guide', description: 'Comprehensive guide for expectant mothers covering prenatal care essentials.', file: '#', type: 'guide', language: 'en', category: 'guides' },
  { id: 2, title: 'Nutrition Handbook', description: 'A practical guide to balanced nutrition for families on a budget.', file: '#', type: 'guide', language: 'en', category: 'guides' },
  { id: 3, title: 'Vaccination Awareness', description: 'Video explaining the importance of childhood vaccination.', file: '#', type: 'video', language: 'en', category: 'videos' },
  { id: 4, title: 'Community Health Workshop', description: 'Recording of our latest community health awareness workshop.', file: '#', type: 'video', language: 'en', category: 'videos' },
  { id: 5, title: 'Annual Health Report 2025', description: 'ASSBEP annual health impact report with statistics and outcomes.', file: '#', type: 'document', language: 'en', category: 'documents' },
  { id: 6, title: 'Hygiene Best Practices', description: 'Printable document on daily hygiene practices for community distribution.', file: '#', type: 'document', language: 'en', category: 'documents' },
]

const filteredResources = computed(() =>
  mockResources.filter((r) => r.category === activeTab.value)
)
</script>
