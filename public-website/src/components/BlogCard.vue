<template>
  <router-link :to="`/blog/${article.slug}`" class="card group cursor-pointer">
    <div class="aspect-video rounded-xl overflow-hidden mb-4">
      <img :src="article.featured_image" :alt="article.title"
        class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
    </div>
    <div class="flex items-center space-x-2 mb-2">
      <span class="inline-block px-3 py-1 text-xs font-medium bg-primary-light text-primary rounded-full">
        {{ article.category.replace('_', ' ') }}
      </span>
      <span class="text-xs text-neutral">{{ formatDate(article.published_at) }}</span>
    </div>
    <h3 class="text-lg font-headline font-semibold text-gray-900 group-hover:text-primary transition-colors line-clamp-2">
      {{ article.title }}
    </h3>
    <p class="text-sm text-neutral mt-2 line-clamp-2">{{ article.excerpt }}</p>
    <div class="mt-4 flex items-center justify-between">
      <span class="text-xs text-neutral">{{ $t('blog.by') }} {{ article.author }}</span>
      <span class="text-primary text-sm font-medium flex items-center">
        {{ $t('blog.read_more') }}
        <svg class="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
        </svg>
      </span>
    </div>
  </router-link>
</template>

<script setup lang="ts">
import type { Article } from '@/types'

defineProps<{ article: Article }>()

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric',
  })
}
</script>
