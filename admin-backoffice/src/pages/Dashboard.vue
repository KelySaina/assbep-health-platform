<template>
  <div class="space-y-6">
    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div v-for="stat in dashboardStats" :key="stat.label" class="card">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-500">{{ $t(`dashboard.${stat.key}`) }}</p>
            <p class="text-2xl font-headline font-bold text-gray-900 mt-1">{{ stat.value }}</p>
          </div>
          <div :class="['w-12 h-12 rounded-xl flex items-center justify-center', stat.bgColor]">
            <span v-html="stat.icon" :class="['w-6 h-6', stat.iconColor]"></span>
          </div>
        </div>
        <div class="mt-3 flex items-center text-xs">
          <span class="text-green-500 font-medium">↑ {{ stat.change }}%</span>
          <span class="text-gray-400 ml-1">vs last month</span>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Recent Articles -->
      <div class="lg:col-span-2 card">
        <div class="flex items-center justify-between mb-4">
          <h3 class="font-headline font-semibold text-lg">{{ $t('dashboard.recent_articles') }}</h3>
          <router-link to="/articles" class="text-primary text-sm font-medium hover:underline">View All →</router-link>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead>
              <tr class="border-b border-gray-100">
                <th class="text-left py-3 px-2 text-gray-500 font-medium">Title</th>
                <th class="text-left py-3 px-2 text-gray-500 font-medium">Category</th>
                <th class="text-left py-3 px-2 text-gray-500 font-medium">Date</th>
                <th class="text-left py-3 px-2 text-gray-500 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="article in recentArticles" :key="article.id" class="border-b border-gray-50 hover:bg-gray-50">
                <td class="py-3 px-2 font-medium text-gray-900">{{ article.title }}</td>
                <td class="py-3 px-2">
                  <span class="px-2 py-1 text-xs bg-primary-light text-primary rounded-full">{{ article.category }}</span>
                </td>
                <td class="py-3 px-2 text-gray-500">{{ article.date }}</td>
                <td class="py-3 px-2">
                  <span class="px-2 py-1 text-xs bg-green-100 text-green-700 rounded-full">Published</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="card">
        <h3 class="font-headline font-semibold text-lg mb-4">{{ $t('dashboard.quick_actions') }}</h3>
        <div class="space-y-3">
          <router-link to="/programs" class="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
            <div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <div>
              <p class="text-sm font-medium text-gray-900">New Program</p>
              <p class="text-xs text-gray-500">Add a health program</p>
            </div>
          </router-link>
          <router-link to="/articles" class="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
            <div class="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </div>
            <div>
              <p class="text-sm font-medium text-gray-900">New Article</p>
              <p class="text-xs text-gray-500">Write a blog post</p>
            </div>
          </router-link>
          <router-link to="/translations" class="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
            <div class="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <svg class="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10" />
              </svg>
            </div>
            <div>
              <p class="text-sm font-medium text-gray-900">Edit Translations</p>
              <p class="text-xs text-gray-500">Update site phrases</p>
            </div>
          </router-link>
          <router-link to="/media" class="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
            <div class="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
              <svg class="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <p class="text-sm font-medium text-gray-900">Upload Media</p>
              <p class="text-xs text-gray-500">Add images & files</p>
            </div>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const dashboardStats = [
  { key: 'total_programs', value: 48, change: 12, bgColor: 'bg-blue-100', iconColor: 'text-blue-600', icon: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>' },
  { key: 'total_articles', value: 124, change: 8, bgColor: 'bg-green-100', iconColor: 'text-green-600', icon: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"/></svg>' },
  { key: 'total_users', value: 15, change: 5, bgColor: 'bg-purple-100', iconColor: 'text-purple-600', icon: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/></svg>' },
  { key: 'contact_requests', value: 32, change: 15, bgColor: 'bg-orange-100', iconColor: 'text-orange-600', icon: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>' },
]

const recentArticles = [
  { id: 1, title: 'Improving Maternal Health', category: 'Community News', date: 'Mar 1, 2026' },
  { id: 2, title: 'Vaccination Drive Milestone', category: 'Community News', date: 'Feb 20, 2026' },
  { id: 3, title: '5 Tips for Healthy Eating', category: 'Health Tips', date: 'Feb 15, 2026' },
  { id: 4, title: 'Annual Health Report', category: 'Reports', date: 'Feb 10, 2026' },
]
</script>
