<template>
  <div>
    <section class="bg-gradient-to-br from-primary to-primary-dark py-16 md:py-24">
      <div class="container-narrow text-center text-white">
        <h1 class="text-4xl md:text-5xl font-headline font-semibold mb-4">{{ $t('partners.title') }}</h1>
        <p class="text-lg text-blue-100 max-w-2xl mx-auto">{{ $t('partners.subtitle') }}</p>
      </div>
    </section>

    <section class="py-16">
      <div class="container-narrow">
        <div class="grid md:grid-cols-3 lg:grid-cols-4 gap-8">
          <a
            v-for="partner in store.partners"
            :key="partner.id"
            :href="partner.website"
            target="_blank"
            rel="noopener noreferrer"
            class="card text-center group"
          >
            <div class="h-20 flex items-center justify-center mb-4 grayscale group-hover:grayscale-0 transition-all">
              <img :src="partner.logo" :alt="partner.name" class="max-h-16 max-w-full object-contain" />
            </div>
            <h3 class="font-headline font-semibold text-gray-900 group-hover:text-primary transition-colors">
              {{ partner.name }}
            </h3>
          </a>
        </div>

        <!-- Become a Partner CTA -->
        <div class="mt-16 bg-primary-light rounded-3xl p-8 md:p-12 text-center">
          <h2 class="text-2xl font-headline font-semibold text-gray-900 mb-4">{{ $t('partners.become_partner') }}</h2>
          <p class="text-neutral max-w-xl mx-auto mb-6">
            Join our network of partners working to improve community health. Together, we can make a greater impact.
          </p>
          <router-link to="/contact" class="btn-primary">
            {{ $t('contact.title') }}
          </router-link>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useAppStore } from '@/stores/app'

const store = useAppStore()

onMounted(() => {
  store.loadPartners()
})
</script>
