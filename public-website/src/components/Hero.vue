<template>
  <section class="relative bg-gradient-to-br from-primary via-primary to-primary-dark overflow-hidden">
    <div class="absolute inset-0 opacity-10">
      <div class="absolute top-0 right-0 w-96 h-96 bg-white rounded-full -translate-y-1/2 translate-x-1/2"></div>
      <div class="absolute bottom-0 left-0 w-64 h-64 bg-white rounded-full translate-y-1/2 -translate-x-1/2"></div>
    </div>

    <div class="container-narrow relative py-20 md:py-32">
      <div class="grid md:grid-cols-2 gap-12 items-center">
        <div class="text-white space-y-6">
          <h1 class="text-4xl md:text-5xl lg:text-6xl font-headline font-semibold leading-tight">
            {{ $t('hero.title') }}
          </h1>
          <p class="text-lg md:text-xl text-blue-100 leading-relaxed max-w-lg">
            {{ $t('hero.subtitle') }}
          </p>
          <div class="flex flex-wrap gap-4 pt-2">
            <router-link to="/programs" class="inline-flex items-center px-8 py-3.5 bg-white text-primary font-semibold rounded-xl hover:bg-blue-50 transition-all duration-200 shadow-lg">
              {{ $t('hero.cta') }}
              <svg class="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </router-link>
            <router-link to="/contact" class="inline-flex items-center px-8 py-3.5 border-2 border-white/30 text-white font-semibold rounded-xl hover:bg-white/10 transition-all duration-200">
              {{ $t('hero.cta_secondary') }}
            </router-link>
          </div>
        </div>

        <div class="hidden md:flex justify-center">
          <div class="relative">
            <div class="w-80 h-80 bg-white/10 rounded-3xl flex items-center justify-center backdrop-blur-sm">
              <img src="/logo.jpeg" alt="ASSBEP Logo" class="w-64 h-64 object-contain rounded-2xl" />
            </div>
            <div class="absolute -top-4 -right-4 bg-primary-dark/80 backdrop-blur-sm rounded-2xl p-4 text-white">
              <div class="text-2xl font-bold">{{ formatNumber(store.stats.find(s => s.key === 'people_helped')?.value || 0) }}</div>
              <div class="text-xs text-blue-200">{{ $t('stats.people_helped') }}</div>
            </div>
            <div class="absolute -bottom-4 -left-4 bg-primary-dark/80 backdrop-blur-sm rounded-2xl p-4 text-white">
              <div class="text-2xl font-bold">{{ store.stats.find(s => s.key === 'programs_launched')?.value || 0 }}</div>
              <div class="text-xs text-blue-200">{{ $t('stats.programs_launched') }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useAppStore } from '@/stores/app'

const store = useAppStore()

const formatNumber = (num: number) => {
  if (num >= 1000) {
    return (num / 1000).toFixed(0) + 'K+'
  }
  return num.toString()
}
</script>
