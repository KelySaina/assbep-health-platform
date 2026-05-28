<template>
  <div>
    <!-- Hero -->
    <Hero />

    <!-- Mission Section -->
    <section class="py-16 md:py-24">
      <div class="container-narrow">
        <div class="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 class="section-title">{{ $t('mission.title') }}</h2>
            <p class="text-neutral mt-4 leading-relaxed">{{ $t('mission.description') }}</p>
            <div class="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div class="flex items-start space-x-3">
                <div class="w-10 h-10 bg-primary-light rounded-xl flex items-center justify-center flex-shrink-0">
                  <svg class="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </div>
                <div>
                  <h4 class="font-semibold text-gray-900">{{ $t('mission.vision_title') }}</h4>
                  <p class="text-sm text-neutral mt-1">{{ $t('mission.vision_description') }}</p>
                </div>
              </div>
              <div class="flex items-start space-x-3">
                <div class="w-10 h-10 bg-primary-light rounded-xl flex items-center justify-center flex-shrink-0">
                  <img src="/logo.jpeg" alt="ASSBEP Logo" class="object-contain" />
                </div>
                <div>
                  <h4 class="font-semibold text-gray-900">{{ $t('mission.values_title') }}</h4>
                  <p class="text-sm text-neutral mt-1">{{ $t('mission.values_description') }}</p>
                </div>
              </div>
            </div>
          </div>
          <div class="bg-primary-light rounded-3xl p-8 flex items-center justify-center">
            <svg class="w-64 h-64 text-primary/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="0.5"
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
        </div>
      </div>
    </section>

    <!-- Programs Section -->
    <section class="py-16 bg-background">
      <div class="container-narrow">
        <div class="text-center mb-12">
          <h2 class="section-title">{{ $t('programs.title') }}</h2>
          <p class="section-subtitle">{{ $t('programs.subtitle') }}</p>
        </div>
        <div class="grid md:grid-cols-3 gap-8">
          <ProgramCard
            v-for="program in store.featuredPrograms()"
            :key="program.id"
            :program="program"
          />
        </div>
        <div class="text-center mt-10">
          <router-link to="/programs" class="btn-outline">
            {{ $t('programs.view_all') }}
          </router-link>
        </div>
      </div>
    </section>

    <!-- Stats -->
    <StatsSection :stats="store.stats" />

    <!-- Blog Preview -->
    <section class="py-16">
      <div class="container-narrow">
        <div class="text-center mb-12">
          <h2 class="section-title">{{ $t('blog.title') }}</h2>
          <p class="section-subtitle">{{ $t('blog.subtitle') }}</p>
        </div>
        <div class="grid md:grid-cols-3 gap-8">
          <BlogCard
            v-for="article in store.latestArticles()"
            :key="article.id"
            :article="article"
          />
        </div>
        <div class="text-center mt-10">
          <router-link to="/blog" class="btn-outline">
            {{ $t('blog.view_all') }}
          </router-link>
        </div>
      </div>
    </section>

    <!-- Partners -->
    <PartnersSection :partners="store.partners" />

    <!-- CTA Section -->
    <section class="py-16 md:py-24">
      <div class="container-narrow">
        <div class="bg-gradient-to-r from-primary to-primary-dark rounded-3xl p-8 md:p-16 text-center text-white">
          <h2 class="text-3xl md:text-4xl font-headline font-semibold mb-4">{{ $t('common.support') }}</h2>
          <p class="text-blue-100 max-w-2xl mx-auto mb-8">
            Join us in making a difference. Together, we can build healthier communities and provide access to quality healthcare for everyone.
          </p>
          <div class="flex flex-wrap justify-center gap-4">
            <router-link to="/contact" class="inline-flex items-center px-8 py-3.5 bg-white text-primary font-semibold rounded-xl hover:bg-blue-50 transition-colors">
              {{ $t('cta.donate') }}
            </router-link>
            <router-link to="/contact" class="inline-flex items-center px-8 py-3.5 border-2 border-white/30 text-white font-semibold rounded-xl hover:bg-white/10 transition-colors">
              {{ $t('cta.volunteer') }}
            </router-link>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useAppStore } from '@/stores/app'
import Hero from '@/components/Hero.vue'
import ProgramCard from '@/components/ProgramCard.vue'
import BlogCard from '@/components/BlogCard.vue'
import StatsSection from '@/components/StatsSection.vue'
import PartnersSection from '@/components/PartnersSection.vue'

const store = useAppStore()

onMounted(() => {
  store.initializeData()
})
</script>
