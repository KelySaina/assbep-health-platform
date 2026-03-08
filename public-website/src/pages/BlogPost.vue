<template>
  <div>
    <section class="bg-gradient-to-br from-primary to-primary-dark py-16 md:py-24">
      <div class="container-narrow">
        <router-link to="/blog" class="inline-flex items-center text-blue-200 hover:text-white mb-6 transition-colors">
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16l-4-4m0 0l4-4m-4 4h18" />
          </svg>
          {{ $t('common.back') }}
        </router-link>
        <h1 class="text-4xl md:text-5xl font-headline font-semibold text-white">{{ article?.title }}</h1>
        <div class="flex items-center space-x-4 mt-4 text-blue-200 text-sm">
          <span>{{ $t('blog.by') }} {{ article?.author }}</span>
          <span>•</span>
          <span>{{ formatDate(article?.published_at || '') }}</span>
          <span>•</span>
          <span class="px-3 py-1 bg-white/20 rounded-full">{{ article?.category.replace('_', ' ') }}</span>
        </div>
      </div>
    </section>

    <section class="py-16">
      <div class="container-narrow">
        <div class="max-w-3xl mx-auto">
          <div class="rounded-2xl overflow-hidden mb-8">
            <img :src="article?.featured_image" :alt="article?.title" class="w-full h-64 md:h-96 object-cover" />
          </div>
          <div class="prose max-w-none">
            <p class="text-lg text-neutral leading-relaxed">{{ article?.excerpt }}</p>
            <div class="mt-6 text-neutral leading-relaxed" v-html="article?.content"></div>
          </div>

          <!-- Share -->
          <div class="mt-12 pt-8 border-t">
            <h4 class="font-headline font-semibold text-lg mb-4">Share this article</h4>
            <div class="flex space-x-3">
              <a href="#" class="w-10 h-10 bg-primary-light rounded-xl flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-colors">
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              </a>
              <a href="#" class="w-10 h-10 bg-primary-light rounded-xl flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-colors">
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useAppStore } from '@/stores/app'

const route = useRoute()
const store = useAppStore()

const article = computed(() =>
  store.articles.find((a) => a.slug === route.params.slug)
)

const formatDate = (date: string) => {
  if (!date) return ''
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
  })
}
</script>
