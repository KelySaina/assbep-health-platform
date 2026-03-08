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
          <button
            v-if="selectedArticles.length > 0"
            @click="bulkDelete"
            class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            <span>Delete {{ selectedArticles.length }}</span>
          </button>
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
              <th class="text-left py-3 px-3 text-gray-500 font-medium w-8">
                <input
                  type="checkbox"
                  :checked="selectedArticles.length === filteredArticles.length && filteredArticles.length > 0"
                  @change="toggleSelectAll"
                  class="rounded border-gray-300 text-primary focus:ring-primary"
                />
              </th>
              <th class="text-left py-3 px-3 text-gray-500 font-medium">Title (EN / FR)</th>
              <th class="text-left py-3 px-3 text-gray-500 font-medium">Author</th>
              <th class="text-left py-3 px-3 text-gray-500 font-medium">Category</th>
              <th class="text-left py-3 px-3 text-gray-500 font-medium">Date</th>
              <th class="text-right py-3 px-3 text-gray-500 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="article in filteredArticles" :key="article.id" class="border-b border-gray-50 hover:bg-gray-50">
              <td class="py-3 px-3">
                <input
                  type="checkbox"
                  :value="article.id"
                  v-model="selectedArticles"
                  class="rounded border-gray-300 text-primary focus:ring-primary"
                />
              </td>
              <td class="py-3 px-3">
                <div class="flex items-center space-x-3">
                  <img :src="article.image" :alt="article.title_en || article.title_fr" class="w-10 h-10 rounded-lg object-cover" />
                  <div>
                    <span class="font-medium text-gray-900 block">{{ article.title_en }}</span>
                    <span class="text-xs text-gray-500">{{ article.title_fr }}</span>
                  </div>
                </div>
              </td>
              <td class="py-3 px-3 text-gray-500">{{ article.author }}</td>
              <td class="py-3 px-3">
                <span class="px-2 py-1 text-xs bg-primary-light text-primary rounded-full">{{ article.category }}</span>
              </td>
              <td class="py-3 px-3 text-gray-500">{{ new Date(article.publishedAt || article.createdAt).toLocaleDateString() }}</td>
              <td class="py-3 px-3 text-right">
                <button @click="editArticle(article)" class="text-primary hover:underline text-xs mr-3">{{ $t('actions.edit') }}</button>
                <button @click="deleteArticle(article.id)" class="text-red-500 hover:underline text-xs">{{ $t('actions.delete') }}</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-2xl max-w-md w-full p-6">
        <div class="flex items-center justify-center w-12 h-12 rounded-full bg-red-100 mx-auto mb-4">
          <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h3 class="text-xl font-headline font-semibold text-center mb-2">Delete Article{{ articleToDelete ? '' : 's' }}</h3>
        <p class="text-gray-500 text-center mb-6">
          {{ articleToDelete
            ? 'Are you sure you want to delete this article? This action cannot be undone.'
            : `Are you sure you want to delete ${selectedArticles.length} articles? This action cannot be undone.`
          }}
        </p>
        <div class="flex justify-end space-x-3">
          <button @click="showDeleteModal = false; articleToDelete = null" class="btn-secondary">Cancel</button>
          <button @click="confirmDelete" class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">Delete</button>
        </div>
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
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import { useToast } from 'vue-toastification'

const toast = useToast()
const apiUrl = import.meta.env.VITE_API_URL || '/api'
const showForm = ref(false)
const searchQuery = ref('')
const filterCategory = ref('')
const filterLanguage = ref('')
const editingArticle = ref<any>(null)
const showDeleteModal = ref(false)
const articleToDelete = ref<string | null>(null)
const selectedArticles = ref<string[]>([])

const articles = ref<any[]>([])

const loadArticles = async () => {
  try {
    const response = await axios.get(`${apiUrl}/articles/admin`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('admin_token')}`
      }
    })
    articles.value = response.data
  } catch (error) {
    toast.error('Failed to load articles')
  }
}

const toggleSelectAll = () => {
  if (selectedArticles.value.length === filteredArticles.value.length) {
    selectedArticles.value = []
  } else {
    selectedArticles.value = filteredArticles.value.map(a => a.id)
  }
}

const editArticle = (article: any) => {
  editingArticle.value = { ...article }
  showForm.value = true
}

const deleteArticle = (id: string) => {
  articleToDelete.value = id
  showDeleteModal.value = true
}

const bulkDelete = () => {
  articleToDelete.value = null
  showDeleteModal.value = true
}

const confirmDelete = async () => {
  try {
    if (articleToDelete.value) {
      // Single delete
      await axios.delete(`${apiUrl}/articles/${articleToDelete.value}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('admin_token')}`
        }
      })
      toast.success('Article deleted successfully!')
    } else {
      // Bulk delete
      await Promise.all(
        selectedArticles.value.map(id =>
          axios.delete(`${apiUrl}/articles/${id}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('admin_token')}`
            }
          })
        )
      )
      toast.success(`${selectedArticles.value.length} articles deleted successfully!`)
      selectedArticles.value = []
    }
    showDeleteModal.value = false
    articleToDelete.value = null
    loadArticles()
  } catch (error) {
    toast.error('Failed to delete article(s)')
  }
}

const filteredArticles = computed(() => {
  return articles.value.filter((a) => {
    const titleEn = a.title_en || ''
    const titleFr = a.title_fr || ''
    const matchesSearch = titleEn.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
                         titleFr.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchesCategory = !filterCategory.value || a.category === filterCategory.value
    return matchesSearch && matchesCategory
  })
})

onMounted(() => {
  loadArticles()
})
</script>
