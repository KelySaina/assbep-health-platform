<template>
  <div>
    <!-- Page Header -->
    <section class="bg-gradient-to-br from-primary to-primary-dark py-16 md:py-24">
      <div class="container-narrow text-center text-white">
        <h1 class="text-4xl md:text-5xl font-headline font-semibold mb-4">{{ $t('about.title') }}</h1>
        <p class="text-lg text-blue-100 max-w-2xl mx-auto">{{ $t('about.subtitle') }}</p>
      </div>
    </section>

    <!-- History -->
    <section class="py-16">
      <div class="container-narrow">
        <div class="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 class="section-title">{{ historyContent.title }}</h2>
            <p class="text-neutral mt-4 leading-relaxed">{{ historyContent.description }}</p>
            <div class="mt-8 space-y-4">
              <div v-for="item in historyContent.items" :key="item.number" class="flex items-center space-x-4">
                <div class="w-12 h-12 bg-primary-light rounded-xl flex items-center justify-center flex-shrink-0">
                  <span class="text-primary font-bold">{{ item.number }}</span>
                </div>
                <div>
                  <h4 class="font-semibold text-gray-900">{{ item.title }}</h4>
                  <p class="text-sm text-neutral">{{ item.description }}</p>
                </div>
              </div>
            </div>
          </div>
          <div class="bg-primary-light rounded-3xl p-8 flex items-center justify-center min-h-[300px]">
            <svg class="w-48 h-48 text-primary/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="0.5"
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
        </div>
      </div>
    </section>

    <!-- Mission & Values -->
    <section class="py-16 bg-background">
      <div class="container-narrow">
        <div class="grid md:grid-cols-3 gap-8">
          <div class="card text-center">
            <div class="w-16 h-16 bg-primary-light rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg class="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 class="text-xl font-headline font-semibold mb-2">{{ $t('mission.title') }}</h3>
            <p class="text-sm text-neutral">{{ $t('mission.description') }}</p>
          </div>
          <div class="card text-center">
            <div class="w-16 h-16 bg-primary-light rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg class="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </div>
            <h3 class="text-xl font-headline font-semibold mb-2">{{ $t('mission.vision_title') }}</h3>
            <p class="text-sm text-neutral">{{ $t('mission.vision_description') }}</p>
          </div>
          <div class="card text-center">
            <div class="w-16 h-16 bg-primary-light rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg class="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <h3 class="text-xl font-headline font-semibold mb-2">{{ $t('mission.values_title') }}</h3>
            <p class="text-sm text-neutral">{{ $t('mission.values_description') }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Team -->
    <TeamSection />
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive } from 'vue'
import axios from 'axios'
import TeamSection from '@/components/TeamSection.vue'

const apiUrl = import.meta.env.VITE_API_URL || '/api'

const historyContent = reactive({
  title: 'Our History',
  description: 'ASSBEP was founded with the vision of creating a healthier community through accessible healthcare and education programs. Over the years, we have grown to serve thousands of individuals across multiple regions.',
  items: [
    {
      number: '01',
      title: 'Founded with Purpose',
      description: 'Started with a vision to improve community health access.',
    },
    {
      number: '02',
      title: 'Growing Impact',
      description: 'Expanded programs across multiple regions and communities.',
    },
    {
      number: '03',
      title: 'Building Community',
      description: 'Over 25,000 people helped through our health programs.',
    },
  ],
})

const loadHistoryContent = async () => {
  try {
    const response = await axios.get(`${apiUrl}/settings`)
    const settings = response.data

    if (settings.about_history_title) {
      historyContent.title = settings.about_history_title
    }

    if (settings.about_history_description) {
      historyContent.description = settings.about_history_description
    }

    if (settings.about_history_item_1_title) {
      historyContent.items[0].title = settings.about_history_item_1_title
    }

    if (settings.about_history_item_1_description) {
      historyContent.items[0].description = settings.about_history_item_1_description
    }

    if (settings.about_history_item_2_title) {
      historyContent.items[1].title = settings.about_history_item_2_title
    }

    if (settings.about_history_item_2_description) {
      historyContent.items[1].description = settings.about_history_item_2_description
    }

    if (settings.about_history_item_3_title) {
      historyContent.items[2].title = settings.about_history_item_3_title
    }

    if (settings.about_history_item_3_description) {
      historyContent.items[2].description = settings.about_history_item_3_description
    }
  } catch (error) {
    console.error('Error loading about history:', error)
  }
}

onMounted(() => {
  loadHistoryContent()
})
</script>
