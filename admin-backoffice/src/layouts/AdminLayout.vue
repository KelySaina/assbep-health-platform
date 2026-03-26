<template>
  <div class="relative h-screen overflow-hidden bg-background">
    <div class="flex h-screen overflow-hidden">
      <aside class="w-64 bg-sidebar text-white flex flex-col flex-shrink-0">
        <div class="h-16 flex items-center px-6 border-b border-white/10">
          <div class="flex items-center space-x-3">
            <img src="/logo.jpeg" alt="ASSBEP Logo" class="h-8 w-auto object-contain" />
            <div>
              <span class="text-sm font-headline font-semibold">ASSBEP</span>
              <span class="text-xs text-gray-400 block">Admin Panel</span>
            </div>
          </div>
        </div>

        <nav class="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
          <router-link
            v-for="item in menuItems"
            :key="item.path"
            :to="item.path"
            class="flex items-center space-x-3 px-3 py-2.5 text-sm text-gray-300 rounded-lg hover:bg-white/10 hover:text-white transition-colors"
            exact-active-class="!bg-primary !text-white"
          >
            <span v-html="item.icon" class="w-5 h-5"></span>
            <span>{{ $t(item.label) }}</span>
          </router-link>
        </nav>

        <div class="border-t border-white/10 p-4">
          <router-link to="/profile" class="flex items-center space-x-3 mb-3 px-2 py-2 rounded-lg hover:bg-white/10 transition-colors">
            <div class="w-8 h-8 bg-primary/30 rounded-lg flex items-center justify-center text-primary-light text-xs font-bold">
              {{ authStore.user?.name?.charAt(0) || 'A' }}
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium truncate">{{ authStore.user?.name || 'Admin' }}</p>
              <p class="text-xs text-gray-400 truncate">{{ authStore.user?.role || 'super_admin' }}</p>
            </div>
          </router-link>
          <button @click="handleLogout" class="w-full flex items-center justify-center space-x-2 px-3 py-2 text-sm text-gray-300 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg transition-colors">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span>Logout</span>
          </button>
        </div>
      </aside>

      <div class="flex-1 flex flex-col overflow-hidden">
        <header class="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 flex-shrink-0">
          <div class="flex items-center space-x-4">
            <h1 class="text-lg font-headline font-semibold text-gray-900">
              {{ currentPageTitle }}
            </h1>
          </div>
          <div class="flex items-center space-x-3">
            <button
              @click="openOnboarding()"
              class="px-3 py-1.5 text-xs font-medium text-primary bg-primary-light rounded-lg hover:bg-blue-100 transition-colors"
            >
              How To Use
            </button>
            <button
              @click="toggleLocale"
              class="px-3 py-1.5 text-xs font-medium text-gray-600 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              {{ locale === 'en' ? 'FR' : 'EN' }}
            </button>
            <a :href="publicUrl" target="_blank" class="px-3 py-1.5 text-xs font-medium text-primary bg-primary-light rounded-lg hover:bg-blue-100 transition-colors">
              View Website →
            </a>
          </div>
        </header>

        <main class="flex-1 overflow-y-auto p-6 bg-background">
          <router-view />
        </main>
      </div>
    </div>

    <div v-if="showOnboarding" class="absolute inset-0 z-50 flex items-center justify-center bg-slate-950/55 p-4">
      <div class="w-full max-w-4xl overflow-hidden rounded-[2rem] bg-white shadow-2xl">
        <div class="grid md:grid-cols-[1.2fr_1fr]">
          <div class="bg-gradient-to-br from-primary to-primary-dark px-8 py-10 text-white">
            <p class="text-xs font-semibold uppercase tracking-[0.28em] text-blue-200">Admin Guide</p>
            <h2 class="mt-3 text-3xl font-headline font-semibold">{{ onboardingSteps[currentOnboardingStep].title }}</h2>
            <p class="mt-4 text-sm text-blue-100 leading-relaxed">
              {{ onboardingSteps[currentOnboardingStep].description }}
            </p>

            <div class="mt-8 space-y-3">
              <div
                v-for="(tip, index) in onboardingSteps[currentOnboardingStep].tips"
                :key="tip"
                class="flex items-start space-x-3 rounded-2xl bg-white/10 px-4 py-3"
              >
                <span class="mt-0.5 flex h-6 w-6 items-center justify-center rounded-full bg-white/20 text-xs font-semibold">
                  {{ index + 1 }}
                </span>
                <p class="text-sm text-blue-50">{{ tip }}</p>
              </div>
            </div>
          </div>

          <div class="px-8 py-8">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-gray-900">Step {{ currentOnboardingStep + 1 }} of {{ onboardingSteps.length }}</p>
                <p class="text-xs text-gray-500 mt-1">You can reopen this guide any time from the top bar.</p>
              </div>
              <button @click="skipOnboarding" class="text-sm text-gray-400 hover:text-gray-600 transition-colors">
                Skip forever
              </button>
            </div>

            <div class="mt-8 space-y-3">
              <button
                v-for="(step, index) in onboardingSteps"
                :key="step.title"
                @click="currentOnboardingStep = index"
                :class="[
                  'w-full rounded-2xl border px-4 py-3 text-left transition-colors',
                  currentOnboardingStep === index
                    ? 'border-primary bg-primary-light text-primary'
                    : 'border-gray-200 hover:border-gray-300 text-gray-600'
                ]"
              >
                <p class="text-xs font-semibold uppercase tracking-[0.2em]">{{ step.label }}</p>
                <p class="mt-1 text-sm font-medium">{{ step.title }}</p>
              </button>
            </div>

            <label class="mt-8 flex items-start space-x-3 rounded-2xl bg-gray-50 px-4 py-3">
              <input v-model="onboardingAutoShow" type="checkbox" class="mt-1 rounded border-gray-300 text-primary focus:ring-primary" />
              <span>
                <span class="block text-sm font-medium text-gray-900">Show this guide automatically on this browser</span>
                <span class="block mt-1 text-xs text-gray-500">Turn this off if you do not want the first-use guide to appear again unless you open it manually.</span>
              </span>
            </label>

            <div class="mt-8 flex items-center justify-between">
              <button @click="previousOnboardingStep" class="btn-secondary" :disabled="currentOnboardingStep === 0">
                Previous
              </button>
              <div class="flex items-center space-x-3">
                <button @click="dismissOnboarding" class="px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors">
                  Close
                </button>
                <button @click="nextOnboardingStep" class="btn-primary">
                  {{ currentOnboardingStep === onboardingSteps.length - 1 ? 'Finish' : 'Next' }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '@/stores/auth'

const ONBOARDING_SEEN_KEY = 'assbep_admin_onboarding_seen'
const ONBOARDING_AUTO_SHOW_KEY = 'assbep_admin_onboarding_auto_show'

const route = useRoute()
const router = useRouter()
const { locale } = useI18n()
const publicUrl = import.meta.env.VITE_PUBLIC_URL || '/'
const authStore = useAuthStore()
const showOnboarding = ref(false)
const currentOnboardingStep = ref(0)
const onboardingAutoShow = ref(true)

const onboardingSteps = [
  {
    label: 'Start Here',
    title: 'Understand the admin structure',
    description: 'The sidebar is the control center. Programs, articles, resources, partners, media, users, and settings each drive a visible part of the public website.',
    tips: [
      'Use Dashboard for a quick health check of content volume and recent activity.',
      'Programs, Articles, and Resources are the three main public content libraries.',
      'Settings controls contact info, About page text, SEO, and homepage metrics.',
    ],
  },
  {
    label: 'Content',
    title: 'Publish content in the right place',
    description: 'Each public section maps to a manager. Edit the correct content type so changes appear where you expect.',
    tips: [
      'Programs show service offerings and structured content blocks.',
      'Articles feed the blog and news areas.',
      'Resources power the downloadable guides, videos, and documents section.',
    ],
  },
  {
    label: 'Media & Profile',
    title: 'Keep media and team profiles clean',
    description: 'Upload assets once, then reuse them across content and profile pages. Team cards on the public site come from user profiles marked for display.',
    tips: [
      'Use Media Manager for shared assets before pasting raw URLs everywhere.',
      'Use My Profile to update your picture, bio, and team visibility.',
      'A user only appears on the public team section when Show In Team is enabled.',
    ],
  },
  {
    label: 'Ops',
    title: 'Avoid common admin mistakes',
    description: 'The most common problems are forgotten publish states, missing English or French content, and checking stale frontend bundles after deploys.',
    tips: [
      'Draft items do not appear on the public website.',
      'When both languages matter, fill both English and French fields before publishing.',
      'If something looks wrong after deploy, hard refresh first to rule out cached frontend assets.',
    ],
  },
] as const

const menuItems = [
  { path: '/', label: 'admin.dashboard', icon: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>' },
  { path: '/programs', label: 'admin.programs', icon: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"/></svg>' },
  { path: '/articles', label: 'admin.blog', icon: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"/></svg>' },
  { path: '/translations', label: 'admin.translations', icon: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"/></svg>' },
  { path: '/media', label: 'admin.media', icon: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>' },
  { path: '/resources', label: 'admin.resources', icon: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>' },
  { path: '/partners', label: 'admin.partners', icon: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/></svg>' },
  { path: '/users', label: 'admin.users', icon: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/></svg>' },
  { path: '/settings', label: 'admin.settings', icon: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>' },
] as const

const currentPageTitle = computed(() => {
  const name = route.name as string
  const titles: Record<string, string> = {
    Dashboard: 'Dashboard',
    ProgramsManager: 'Programs',
    ArticlesManager: 'Blog / Articles',
    TranslationsManager: 'Translations',
    MediaManager: 'Media Manager',
    ResourcesManager: 'Resources',
    PartnersManager: 'Partners',
    UsersManager: 'Users',
    UserProfile: 'My Profile',
    Settings: 'Settings',
  }
  return titles[name] || 'Dashboard'
})

const persistOnboardingPreference = () => {
  localStorage.setItem(ONBOARDING_AUTO_SHOW_KEY, onboardingAutoShow.value ? 'true' : 'false')
}

const openOnboarding = (step = 0) => {
  currentOnboardingStep.value = step
  showOnboarding.value = true
}

const dismissOnboarding = () => {
  persistOnboardingPreference()
  localStorage.setItem(ONBOARDING_SEEN_KEY, 'true')
  showOnboarding.value = false
}

const skipOnboarding = () => {
  onboardingAutoShow.value = false
  persistOnboardingPreference()
  localStorage.setItem(ONBOARDING_SEEN_KEY, 'true')
  showOnboarding.value = false
}

const previousOnboardingStep = () => {
  if (currentOnboardingStep.value > 0) {
    currentOnboardingStep.value -= 1
  }
}

const nextOnboardingStep = () => {
  if (currentOnboardingStep.value === onboardingSteps.length - 1) {
    dismissOnboarding()
    return
  }

  currentOnboardingStep.value += 1
}

const toggleLocale = () => {
  const newLocale = locale.value === 'en' ? 'fr' : 'en'
  locale.value = newLocale
  localStorage.setItem('admin_locale', newLocale)
}

const handleLogout = () => {
  authStore.logout()
  router.push({ name: 'Login' })
}

onMounted(() => {
  onboardingAutoShow.value = localStorage.getItem(ONBOARDING_AUTO_SHOW_KEY) !== 'false'

  const hasSeenOnboarding = localStorage.getItem(ONBOARDING_SEEN_KEY) === 'true'
  if (!hasSeenOnboarding && onboardingAutoShow.value) {
    openOnboarding()
  }
})
</script>
