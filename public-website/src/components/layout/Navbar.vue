<template>
  <nav class="bg-white shadow-soft sticky top-0 z-50">
    <div class="container-narrow">
      <div class="flex items-center justify-between h-16 md:h-20">
        <!-- Logo -->
        <router-link to="/" class="flex items-center space-x-3">
          <div class="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </div>
          <span class="text-xl font-headline font-semibold text-primary-dark">ASSBEP</span>
        </router-link>

        <!-- Desktop Nav -->
        <div class="hidden md:flex items-center space-x-1">
          <router-link
            v-for="link in navLinks"
            :key="link.path"
            :to="link.path"
            class="px-4 py-2 text-sm font-medium text-gray-600 hover:text-primary rounded-lg hover:bg-primary-light transition-all duration-200"
            active-class="text-primary bg-primary-light"
          >
            {{ $t(link.label) }}
          </router-link>
        </div>

        <!-- Right actions -->
        <div class="hidden md:flex items-center space-x-3">
          <!-- Language Switcher -->
          <button
            @click="toggleLocale"
            class="flex items-center space-x-1 px-3 py-2 text-sm font-medium text-gray-600 hover:text-primary rounded-lg hover:bg-primary-light transition-all duration-200"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9" />
            </svg>
            <span>{{ locale === 'en' ? 'FR' : 'EN' }}</span>
          </button>

          <!-- CTA -->
          <router-link to="/contact" class="btn-primary text-sm">
            {{ $t('cta.donate') }}
          </router-link>
        </div>

        <!-- Mobile menu button -->
        <button
          @click="mobileMenuOpen = !mobileMenuOpen"
          class="md:hidden p-2 rounded-lg text-gray-600 hover:bg-primary-light transition-colors"
        >
          <svg v-if="!mobileMenuOpen" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
          <svg v-else class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Mobile Menu -->
      <transition name="slide-down">
        <div v-if="mobileMenuOpen" class="md:hidden pb-4 space-y-1">
          <router-link
            v-for="link in navLinks"
            :key="link.path"
            :to="link.path"
            class="block px-4 py-2 text-sm font-medium text-gray-600 hover:text-primary rounded-lg hover:bg-primary-light transition-all duration-200"
            active-class="text-primary bg-primary-light"
            @click="mobileMenuOpen = false"
          >
            {{ $t(link.label) }}
          </router-link>
          <div class="pt-2 px-4 flex items-center space-x-3">
            <button
              @click="toggleLocale"
              class="px-3 py-2 text-sm font-medium text-gray-600 border rounded-lg hover:bg-primary-light transition-colors"
            >
              {{ locale === 'en' ? 'Français' : 'English' }}
            </button>
            <router-link to="/contact" class="btn-primary text-sm" @click="mobileMenuOpen = false">
              {{ $t('cta.donate') }}
            </router-link>
          </div>
        </div>
      </transition>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

const { locale } = useI18n()
const mobileMenuOpen = ref(false)

const navLinks = [
  { path: '/', label: 'nav.home' },
  { path: '/about', label: 'nav.about' },
  { path: '/programs', label: 'nav.programs' },
  { path: '/blog', label: 'nav.blog' },
  { path: '/resources', label: 'nav.resources' },
  { path: '/partners', label: 'nav.partners' },
  { path: '/contact', label: 'nav.contact' },
]

const toggleLocale = () => {
  const newLocale = locale.value === 'en' ? 'fr' : 'en'
  locale.value = newLocale
  localStorage.setItem('locale', newLocale)
}
</script>

<style scoped>
.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.2s ease;
}
.slide-down-enter-from,
.slide-down-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
