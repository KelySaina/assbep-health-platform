<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-2xl font-headline font-semibold">{{ $t('admin.blog') }}</h2>
        <p class="text-sm text-gray-500 mt-1">Manage blog articles and news posts</p>
      </div>
      <button @click="showForm = true" class="btn-primary">
        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
        New Article
      </button>
    </div>

    <div class="card">
      <div class="flex items-center justify-between mb-4">
        <input type="text" v-model="searchQuery" :placeholder="$t('actions.search')" class="input max-w-xs" />
        <div class="flex space-x-2">
          <select v-model="filterCategory" class="input max-w-[160px]">
            <option value="">All Categories</option>
            <option value="health_tips">Health Tips</option>
            <option value="community_news">Community News</option>
            <option value="events">Events</option>
            <option value="reports">Reports</option>
          </select>
          <select v-model="filterLanguage" class="input max-w-[120px]">
            <option value="">All Languages</option>
            <option value="en">English</option>
            <option value="fr">French</option>
          </select>
        </div>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead>
            <tr class="border-b border-gray-100">
              <th class="text-left py-3 px-3 text-gray-500 font-medium">Title</th>
              <th class="text-left py-3 px-3 text-gray-500 font-medium">Author</th>
              <th class="text-left py-3 px-3 text-gray-500 font-medium">Category</th>
              <th class="text-left py-3 px-3 text-gray-500 font-medium">Lang</th>
              <th class="text-left py-3 px-3 text-gray-500 font-medium">Date</th>
              <th class="text-right py-3 px-3 text-gray-500 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="article in filteredArticles" :key="article.id" class="border-b border-gray-50 hover:bg-gray-50">
              <td class="py-3 px-3">
                <div class="flex items-center space-x-3">
                  <img :src="article.image" :alt="article.title" class="w-10 h-10 rounded-lg object-cover" />
                  <div>
                    <span class="font-medium text-gray-900 block">{{ article.title }}</span>
                    <span class="text-xs text-gray-400">{{ article.slug }}</span>
                  </div>
                </div>
              </td>
              <td class="py-3 px-3 text-gray-500">{{ article.author }}</td>
              <td class="py-3 px-3">
                <span class="px-2 py-1 text-xs bg-primary-light text-primary rounded-full">{{ article.category }}</span>
              </td>
              <td class="py-3 px-3 text-gray-500 uppercase">{{ article.language }}</td>
              <td class="py-3 px-3 text-gray-500">{{ article.date }}</td>
              <td class="py-3 px-3 text-right">
                <button class="text-primary hover:underline text-xs mr-3">{{ $t('actions.edit') }}</button>
                <button class="text-red-500 hover:underline text-xs">{{ $t('actions.delete') }}</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Create Modal -->
    <div v-if="showForm" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-xl font-headline font-semibold">New Article</h3>
          <button @click="showForm = false" class="text-gray-400 hover:text-gray-600">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <form @submit.prevent="showForm = false" class="space-y-4">
          <div>
            <label class="label">Title</label>
            <input type="text" class="input" placeholder="Article title" />
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="label">Slug</label>
              <input type="text" class="input" placeholder="article-slug" />
            </div>
            <div>
              <label class="label">Author</label>
              <input type="text" class="input" placeholder="Author name" />
            </div>
          </div>
          <div>
            <label class="label">Excerpt</label>
            <textarea class="input" rows="2" placeholder="Short excerpt..."></textarea>
          </div>
          <div>
            <label class="label">Content</label>
            <textarea class="input" rows="8" placeholder="Full article content (HTML supported)..."></textarea>
          </div>
          <div class="grid grid-cols-3 gap-4">
            <div>
              <label class="label">Category</label>
              <select class="input">
                <option value="health_tips">Health Tips</option>
                <option value="community_news">Community News</option>
                <option value="events">Events</option>
                <option value="reports">Reports</option>
              </select>
            </div>
            <div>
              <label class="label">Language</label>
              <select class="input">
                <option value="en">English</option>
                <option value="fr">French</option>
              </select>
            </div>
            <div>
              <label class="label">Featured Image</label>
              <input type="text" class="input" placeholder="Image URL" />
            </div>
          </div>
          <div class="flex justify-end space-x-3 pt-4">
            <button type="button" @click="showForm = false" class="btn-secondary">{{ $t('actions.cancel') }}</button>
            <button type="submit" class="btn-primary">{{ $t('actions.publish') }}</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const showForm = ref(false)
const searchQuery = ref('')
const filterCategory = ref('')
const filterLanguage = ref('')

const articles = ref([
  { id: 1, title: 'Improving Maternal Health in Rural Communities', slug: 'improving-maternal-health', author: 'Dr. Marie Dupont', category: 'community_news', language: 'en', date: 'Mar 1, 2026', image: 'https://images.unsplash.com/photo-1584515933487-779824d29309?w=100' },
  { id: 2, title: 'Vaccination Drive Reaches New Milestone', slug: 'vaccination-drive-milestone', author: 'Jean-Pierre Kamga', category: 'community_news', language: 'en', date: 'Feb 20, 2026', image: 'https://images.unsplash.com/photo-1632053001332-2f6735363d10?w=100' },
  { id: 3, title: '5 Tips for Healthy Eating on a Budget', slug: '5-tips-healthy-eating', author: 'Nutrition Team', category: 'health_tips', language: 'en', date: 'Feb 15, 2026', image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=100' },
])

const filteredArticles = computed(() => {
  return articles.value.filter((a) => {
    const matchesSearch = a.title.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchesCategory = !filterCategory.value || a.category === filterCategory.value
    const matchesLang = !filterLanguage.value || a.language === filterLanguage.value
    return matchesSearch && matchesCategory && matchesLang
  })
})
</script>
