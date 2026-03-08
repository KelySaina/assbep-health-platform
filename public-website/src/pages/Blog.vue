<template>
  <div>
    <!-- Page Header -->
    <section class="bg-gradient-to-br from-primary to-primary-dark py-16 md:py-24">
      <div class="container-narrow text-center text-white">
        <h1 class="text-4xl md:text-5xl font-headline font-semibold mb-4">{{ $t('blog.title') }}</h1>
        <p class="text-lg text-blue-100 max-w-2xl mx-auto">{{ $t('blog.subtitle') }}</p>
      </div>
    </section>

    <!-- Category Filter -->
    <section class="py-8 border-b">
      <div class="container-narrow">
        <div class="flex flex-wrap gap-2 justify-center">
          <button
            v-for="cat in categories"
            :key="cat.key"
            @click="activeCategory = cat.key"
            :class="[
              'px-4 py-2 text-sm font-medium rounded-full transition-all duration-200',
              activeCategory === cat.key
                ? 'bg-primary text-white'
                : 'bg-primary-light text-primary hover:bg-blue-100'
            ]"
          >
            {{ $t(`blog.categories.${cat.key}`) }}
          </button>
        </div>
      </div>
    </section>

    <!-- Articles Grid -->
    <section class="py-16">
      <div class="container-narrow">
        <div class="grid md:grid-cols-3 gap-8">
          <BlogCard
            v-for="article in filteredArticles"
            :key="article.id"
            :article="article"
          />
        </div>
        <div v-if="filteredArticles.length === 0" class="text-center py-16">
          <p class="text-neutral text-lg">No articles found in this category.</p>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useAppStore } from '@/stores/app'
import BlogCard from '@/components/BlogCard.vue'

const store = useAppStore()
const activeCategory = ref('all')

const categories = [
  { key: 'all' },
  { key: 'health_tips' },
  { key: 'community_news' },
  { key: 'events' },
  { key: 'reports' },
]

const filteredArticles = computed(() => {
  if (activeCategory.value === 'all') return store.articles
  return store.articles.filter((a) => a.category === activeCategory.value)
})
</script>
