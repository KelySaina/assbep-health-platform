<template>
  <div class="flex h-screen overflow-hidden">
    <!-- Sidebar -->
    <aside class="w-64 bg-sidebar text-white flex flex-col flex-shrink-0">
      <!-- Logo -->
      <div class="h-16 flex items-center px-6 border-b border-white/10">
        <div class="flex items-center space-x-3">
          <div class="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </div>
          <div>
            <span class="text-sm font-headline font-semibold">ASSBEP</span>
            <span class="text-xs text-gray-400 block">Admin Panel</span>
          </div>
        </div>
      </div>

      <!-- Nav -->
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

      <!-- User -->
      <div class="border-t border-white/10 p-4">
        <div class="flex items-center space-x-3">
          <div class="w-8 h-8 bg-primary/30 rounded-lg flex items-center justify-center text-primary-light text-xs font-bold">
            {{ authStore.user?.name?.charAt(0) || 'A' }}
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-sm font-medium truncate">{{ authStore.user?.name || 'Admin' }}</p>
            <p class="text-xs text-gray-400 truncate">{{ authStore.user?.role || 'super_admin' }}</p>
          </div>
          <button @click="handleLogout" class="text-gray-400 hover:text-white transition-colors">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </button>
        </div>
      </div>
    </aside>

    <!-- Main Content -->
    <div class="flex-1 flex flex-col overflow-hidden">
      <!-- Top Bar -->
      <header class="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 flex-shrink-0">
        <div class="flex items-center space-x-4">
          <h1 class="text-lg font-headline font-semibold text-gray-900">
            {{ currentPageTitle }}
          </h1>
        </div>
        <div class="flex items-center space-x-3">
          <!-- Language Switch -->
          <button
            @click="toggleLocale"
            class="px-3 py-1.5 text-xs font-medium text-gray-600 border rounded-lg hover:bg-gray-50 transition-colors"
          >
            {{ locale === 'en' ? 'FR' : 'EN' }}
          </button>
          <!-- View Website -->
          <a href="http://localhost:3000" target="_blank" class="px-3 py-1.5 text-xs font-medium text-primary bg-primary-light rounded-lg hover:bg-blue-100 transition-colors">
            View Website →
          </a>
        </div>
      </header>

      <!-- Page Content -->
      <main class="flex-1 overflow-y-auto p-6 bg-background">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '@/stores/auth'

const route = useRoute()
const router = useRouter()
const { locale } = useI18n()
const authStore = useAuthStore()

const menuItems = [
  { path: '/', label: 'admin.dashboard', icon: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>' },
  { path: '/programs', label: 'admin.programs', icon: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"/></svg>' },
  { path: '/articles', label: 'admin.blog', icon: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"/></svg>' },
  { path: '/translations', label: 'admin.translations', icon: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"/></svg>' },
  { path: '/media', label: 'admin.media', icon: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>' },
  { path: '/partners', label: 'admin.partners', icon: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/></svg>' },
  { path: '/users', label: 'admin.users', icon: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/></svg>' },
  { path: '/settings', label: 'admin.settings', icon: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>' },
]

const currentPageTitle = computed(() => {
  const name = route.name as string
  const titles: Record<string, string> = {
    Dashboard: 'Dashboard',
    ProgramsManager: 'Programs',
    ArticlesManager: 'Blog / Articles',
    TranslationsManager: 'Translations',
    MediaManager: 'Media Manager',
    PartnersManager: 'Partners',
    UsersManager: 'Users',
    Settings: 'Settings',
  }
  return titles[name] || 'Dashboard'
})

const toggleLocale = () => {
  const newLocale = locale.value === 'en' ? 'fr' : 'en'
  locale.value = newLocale
  localStorage.setItem('admin_locale', newLocale)
}

const handleLogout = () => {
  authStore.logout()
  router.push({ name: 'Login' })
}
</script>
