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
            <div v-if="program?.image" class="rounded-2xl overflow-hidden mb-8">
              <img :src="program?.image" :alt="program?.title" class="w-full h-64 md:h-96 object-cover" />
            </div>
            <div class="prose max-w-none">
              <p class="text-neutral leading-relaxed text-lg">{{ program?.description }}</p>
              <div v-if="program?.content" class="mt-4 text-neutral leading-relaxed" v-html="program.content"></div>
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
                  <span class="text-neutral">{{ program?.published ? 'Active Program' : 'Draft' }}</span>
                </li>
                <li class="flex items-center space-x-3">
                  <svg class="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                  <span class="text-neutral capitalize">{{ program?.category }}</span>
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
import { computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useAppStore } from '@/stores/app'

const route = useRoute()
const store = useAppStore()

onMounted(async () => {
  if (store.programs.length === 0) {
    await store.loadPrograms()
  }
})

const program = computed(() =>
  store.programs.find((p) => p.slug === route.params.slug)
)
</script>
