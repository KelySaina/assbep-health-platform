<template>
  <router-link :to="`/programs/${program.slug}`" class="card group cursor-pointer">
    <div class="aspect-video rounded-xl overflow-hidden mb-4">
      <img :src="program.image" :alt="program.title"
        class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
    </div>
    <span class="inline-block px-3 py-1 text-xs font-medium bg-primary-light text-primary rounded-full mb-2">
      {{ program.category }}
    </span>
    <h3 class="text-lg font-headline font-semibold text-gray-900 group-hover:text-primary transition-colors">
      {{ program.title }}
    </h3>
    <p class="text-sm text-neutral mt-2 line-clamp-2">{{ program.description }}</p>
    <div class="mt-4 flex items-center text-primary text-sm font-medium">
      {{ $t('programs.learn_more') }}
      <svg class="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
      </svg>
    </div>
  </router-link>
</template>

<script setup lang="ts">
import type { Program } from '@/types'
defineProps<{ program: Program }>()
</script>
