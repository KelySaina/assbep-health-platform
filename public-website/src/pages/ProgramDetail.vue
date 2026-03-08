<template>
  <div>
    <section class="bg-gradient-to-br from-primary to-primary-dark py-16 md:py-24">
      <div class="container-narrow">
        <router-link to="/programs" class="inline-flex items-center text-blue-200 hover:text-white mb-6 transition-colors">
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16l-4-4m0 0l4-4m-4 4h18" />
          </svg>
          {{ $t('common.back') }}
        </router-link>
        <h1 class="text-4xl md:text-5xl font-headline font-semibold text-white">{{ program?.title }}</h1>
        <span class="inline-block mt-4 px-4 py-1 bg-white/20 text-white text-sm rounded-full">
          {{ program?.category }}
        </span>
      </div>
    </section>

    <section class="py-16">
      <div class="container-narrow">
        <div class="grid md:grid-cols-3 gap-12">
          <div class="md:col-span-2">
            <div class="rounded-2xl overflow-hidden mb-8">
              <img :src="program?.image" :alt="program?.title" class="w-full h-64 md:h-96 object-cover" />
            </div>
            <div class="prose max-w-none">
              <p class="text-neutral leading-relaxed text-lg">{{ program?.description }}</p>
              <p class="text-neutral leading-relaxed mt-4">
                This program aims to provide comprehensive support to communities through accessible healthcare services.
                Our team of dedicated professionals works tirelessly to ensure that everyone has access to quality care
                regardless of their location or economic status.
              </p>
            </div>
          </div>
          <div class="space-y-6">
            <div class="card">
              <h3 class="font-headline font-semibold text-lg mb-4">Program Info</h3>
              <ul class="space-y-3 text-sm">
                <li class="flex items-center space-x-3">
                  <svg class="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span class="text-neutral">Active Program</span>
                </li>
                <li class="flex items-center space-x-3">
                  <svg class="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  </svg>
                  <span class="text-neutral">Multiple Regions</span>
                </li>
                <li class="flex items-center space-x-3">
                  <svg class="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                  <span class="text-neutral">5,000+ Beneficiaries</span>
                </li>
              </ul>
            </div>
            <div class="card bg-primary-light border-0">
              <h3 class="font-headline font-semibold text-lg mb-2">Get Involved</h3>
              <p class="text-sm text-neutral mb-4">Support this program through volunteering or donations.</p>
              <router-link to="/contact" class="btn-primary w-full text-center text-sm">
                {{ $t('cta.donate') }}
              </router-link>
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

const program = computed(() =>
  store.programs.find((p) => p.slug === route.params.slug)
)
</script>
