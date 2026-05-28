<template>
  <section class="py-16 bg-primary-light">
    <div class="container-narrow text-center">
      <h2 class="section-title">{{ $t('partners.title') }}</h2>
      <p class="section-subtitle mb-12">{{ $t('partners.subtitle') }}</p>
      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 items-center">
        <a v-for="partner in partners" :key="partner.id" :href="partner.website" target="_blank" rel="noopener noreferrer"
          class="bg-white rounded-2xl p-6 flex items-center justify-center h-24 hover:shadow-card transition-all duration-200 grayscale hover:grayscale-0">
          <img :src="partner.logo" :alt="partner.name" class="max-h-12 max-w-full object-contain" />
        </a>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { Partner } from '@/types'
defineProps<{ partners: Partner[] }>()
</script>
