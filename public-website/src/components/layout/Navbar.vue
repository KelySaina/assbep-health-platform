<template>
  <nav class="bg-white shadow-soft sticky top-0 z-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16 md:h-20">
        <!-- Logo -->
        <router-link to="/" class="flex items-center space-x-3 flex-shrink-0">
          <img src="/logo.jpeg" alt="ASSBEP Logo" class="h-10 md:h-12 w-auto object-contain" />
          <span class="text-xl font-headline font-semibold text-primary-dark">ASSBEP</span>
        </router-link>

        <!-- Desktop Nav -->
        <div class="hidden lg:flex items-center space-x-0.5">
          <router-link
            v-for="link in navLinks"
            :key="link.path"
            :to="link.path"
            class="px-3 py-2 text-sm font-medium text-gray-600 hover:text-primary rounded-lg hover:bg-primary-light transition-all duration-200 whitespace-nowrap"
            active-class="text-primary bg-primary-light"
          >
            {{ $t(link.label) }}
          </router-link>
        </div>

        <!-- Right actions -->
        <div class="hidden lg:flex items-center space-x-3 flex-shrink-0">
          <!-- CTA -->
          <router-link to="/contact" class="btn-primary text-sm">
            {{ $t('cta.donate') }}
          </router-link>
        </div>

        <!-- Mobile menu button -->
        <button
          @click="mobileMenuOpen = !mobileMenuOpen"
          class="lg:hidden p-2 rounded-lg text-gray-600 hover:bg-primary-light transition-colors"
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
        <div v-if="mobileMenuOpen" class="lg:hidden pb-4 space-y-1">
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
