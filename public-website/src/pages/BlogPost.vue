<template>
  <div v-if="article">
    <!-- Hero Header - Newspaper style -->
    <section class="relative">
      <div v-if="article.featured_image" class="w-full max-h-[60vh] relative">
        <img :src="article.featured_image" :alt="article.title" class="w-full max-h-[60vh] object-contain bg-black/5" />
        <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
      </div>
      <div :class="article.featured_image ? 'absolute bottom-0 left-0 right-0' : 'bg-gradient-to-br from-primary to-primary-dark'">
        <div class="container-narrow py-12 md:py-16">
          <router-link to="/blog" class="inline-flex items-center text-blue-200 hover:text-white mb-4 transition-colors text-sm">
            <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16l-4-4m0 0l4-4m-4 4h18" />
            </svg>
            Back to Blog
          </router-link>
          <span class="inline-block px-3 py-1 bg-white/20 text-white text-xs font-medium rounded-full mb-4 capitalize">
            {{ article.category.replace('_', ' ') }}
          </span>
          <h1 class="text-3xl md:text-5xl lg:text-6xl font-headline font-bold text-white leading-tight max-w-4xl">
            {{ article.title }}
          </h1>
          <div class="flex items-center space-x-4 mt-6 text-blue-100 text-sm">
            <span class="font-medium">{{ article.author }}</span>
            <span class="opacity-50">•</span>
            <time>{{ formatDate(article.published_at || '') }}</time>
          </div>
        </div>
      </div>
    </section>

    <!-- Article Body - Newspaper layout -->
    <article class="py-12 md:py-20">
      <div class="container-narrow">
        <div class="max-w-3xl mx-auto">
          <!-- Lead / Excerpt -->
          <p v-if="article.excerpt" class="text-xl md:text-2xl text-gray-700 leading-relaxed font-serif border-l-4 border-primary pl-6 mb-10">
            {{ article.excerpt }}
          </p>

          <!-- Drop Cap First Letter Style + Content -->
          <div class="prose prose-lg max-w-none
            prose-headings:font-headline prose-headings:font-bold
            prose-p:text-gray-700 prose-p:leading-relaxed
            prose-img:rounded-2xl prose-img:shadow-lg prose-img:my-8
            prose-a:text-primary prose-a:no-underline hover:prose-a:underline
            prose-blockquote:border-l-primary prose-blockquote:bg-primary-light/30 prose-blockquote:rounded-r-xl prose-blockquote:py-2
            first-letter:text-5xl first-letter:font-headline first-letter:font-bold first-letter:text-primary first-letter:float-left first-letter:mr-3 first-letter:mt-1"
            v-html="article.content">
          </div>

          <!-- Image Gallery (if multiple images in content) -->
          <div v-if="galleryImages.length > 0" class="mt-12">
            <h3 class="font-headline font-semibold text-xl mb-6">Gallery</h3>
            <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div v-for="(img, index) in galleryImages" :key="index" class="aspect-square rounded-xl overflow-hidden cursor-pointer hover:opacity-90 transition-opacity">
                <img :src="img" class="w-full h-full object-cover" />
              </div>
            </div>
          </div>

          <!-- Divider -->
          <div class="my-12 flex items-center justify-center space-x-2">
            <span class="w-2 h-2 bg-primary rounded-full"></span>
            <span class="w-2 h-2 bg-primary/50 rounded-full"></span>
            <span class="w-2 h-2 bg-primary/25 rounded-full"></span>
          </div>

          <!-- Share -->
          <div class="flex items-center justify-between py-6 border-t border-b border-gray-200">
            <span class="text-sm text-gray-500 font-medium uppercase tracking-wide">Share this article</span>
            <div class="flex space-x-2">
              <a :href="`https://www.facebook.com/sharer/sharer.php?u=${currentUrl}`" target="_blank" class="w-9 h-9 bg-gray-100 rounded-full flex items-center justify-center text-gray-500 hover:bg-primary hover:text-white transition-colors">
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              </a>
              <a :href="`https://twitter.com/intent/tweet?url=${currentUrl}&text=${article.title}`" target="_blank" class="w-9 h-9 bg-gray-100 rounded-full flex items-center justify-center text-gray-500 hover:bg-primary hover:text-white transition-colors">
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </article>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useAppStore } from '@/stores/app'

const route = useRoute()
const store = useAppStore()

onMounted(async () => {
  if (store.articles.length === 0) {
    await store.loadArticles()
  }
})

const article = computed(() =>
  store.articles.find((a) => a.slug === route.params.slug)
)

const currentUrl = computed(() => window.location.href)

// Gallery images from dedicated field
const galleryImages = computed(() => {
  return (article.value as any)?.images || []
})

const formatDate = (date: string) => {
  if (!date) return ''
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
  })
}
</script>
