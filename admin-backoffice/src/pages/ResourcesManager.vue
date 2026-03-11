<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-2xl font-headline font-semibold">{{ $t('admin.resources') }}</h2>
        <p class="text-sm text-gray-500 mt-1">Manage downloadable guides, videos, and documents shown on the public website.</p>
      </div>
      <button @click="openCreateForm" class="btn-primary">
        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
        New Resource
      </button>
    </div>

    <div class="card">
      <div class="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between mb-4">
        <input v-model="searchQuery" type="text" :placeholder="$t('actions.search')" class="input max-w-xs" />
        <select v-model="filterType" class="input max-w-[180px]">
          <option value="">All Types</option>
          <option value="guide">Guides</option>
          <option value="video">Videos</option>
          <option value="document">Documents</option>
        </select>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead>
            <tr class="border-b border-gray-100">
              <th class="text-left py-3 px-3 text-gray-500 font-medium">Title (EN / FR)</th>
              <th class="text-left py-3 px-3 text-gray-500 font-medium">Type</th>
              <th class="text-left py-3 px-3 text-gray-500 font-medium">File</th>
              <th class="text-left py-3 px-3 text-gray-500 font-medium">Order</th>
              <th class="text-left py-3 px-3 text-gray-500 font-medium">Status</th>
              <th class="text-right py-3 px-3 text-gray-500 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="resource in filteredResources" :key="resource.id" class="border-b border-gray-50 hover:bg-gray-50">
              <td class="py-3 px-3">
                <div>
                  <p class="font-medium text-gray-900">{{ resource.title_en || 'Untitled resource' }}</p>
                  <p class="text-xs text-gray-500 mt-1">{{ resource.title_fr || 'No French title' }}</p>
                </div>
              </td>
              <td class="py-3 px-3">
                <span class="px-2 py-1 text-xs rounded-full bg-primary-light text-primary capitalize">
                  {{ resource.type }}
                </span>
              </td>
              <td class="py-3 px-3 max-w-[220px]">
                <a
                  v-if="resource.fileUrl"
                  :href="resource.fileUrl"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="text-primary hover:underline break-all"
                >
                  {{ resource.fileUrl }}
                </a>
                <span v-else class="text-gray-400">No file linked</span>
              </td>
              <td class="py-3 px-3 text-gray-500">{{ resource.order }}</td>
              <td class="py-3 px-3">
                <span :class="resource.published ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'" class="px-2 py-1 text-xs rounded-full">
                  {{ resource.published ? 'Published' : 'Draft' }}
                </span>
              </td>
              <td class="py-3 px-3 text-right">
                <button @click="editResource(resource)" class="text-primary hover:underline text-xs mr-3">{{ $t('actions.edit') }}</button>
                <button @click="deleteResource(resource.id)" class="text-red-500 hover:underline text-xs">{{ $t('actions.delete') }}</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-if="filteredResources.length === 0" class="text-center py-10 text-gray-500">
        No resources found.
      </div>
    </div>

    <div v-if="showDeleteModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-2xl max-w-md w-full p-6">
        <div class="flex items-center justify-center w-12 h-12 rounded-full bg-red-100 mx-auto mb-4">
          <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h3 class="text-xl font-headline font-semibold text-center mb-2">Delete Resource</h3>
        <p class="text-gray-500 text-center mb-6">Are you sure you want to delete this resource? This action cannot be undone.</p>
        <div class="flex justify-end space-x-3">
          <button @click="closeDeleteModal" class="btn-secondary">Cancel</button>
          <button @click="confirmDelete" class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">Delete</button>
        </div>
      </div>
    </div>

    <div v-if="showForm" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6">
        <div class="flex items-center justify-between mb-6">
          <div>
            <h3 class="text-xl font-headline font-semibold">{{ editingResource ? 'Edit Resource' : 'New Resource' }}</h3>
            <p class="text-sm text-gray-500 mt-1">Provide English and French titles so the public website can display this resource cleanly.</p>
          </div>
          <button @click="closeForm" class="text-gray-400 hover:text-gray-600">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form @submit.prevent="saveResource" class="space-y-5">
          <div class="grid md:grid-cols-3 gap-4">
            <div>
              <label class="label">Type</label>
              <select v-model="formData.type" class="input">
                <option value="guide">Guide</option>
                <option value="video">Video</option>
                <option value="document">Document</option>
              </select>
            </div>
            <div>
              <label class="label">Display Order</label>
              <input v-model.number="formData.order" type="number" min="0" class="input" />
            </div>
            <div class="flex items-end">
              <label class="flex items-center space-x-2 cursor-pointer h-11">
                <input v-model="formData.published" type="checkbox" class="rounded border-gray-300 text-primary focus:ring-primary" />
                <span class="text-sm text-gray-700">Published</span>
              </label>
            </div>
          </div>

          <div>
            <label class="label">File URL</label>
            <input v-model="formData.fileUrl" type="text" class="input" placeholder="https://... or storage URL" />
            <p class="text-xs text-gray-500 mt-1">You can paste a document, video, or media URL here.</p>
          </div>

          <div class="grid md:grid-cols-2 gap-4">
            <div class="rounded-2xl border border-gray-200 p-4 space-y-3">
              <p class="text-xs font-semibold uppercase tracking-[0.2em] text-gray-400">English</p>
              <div>
                <label class="label">Title</label>
                <input v-model="formData.titleEn" type="text" class="input" required />
              </div>
              <div>
                <label class="label">Description</label>
                <textarea v-model="formData.descriptionEn" rows="4" class="input" required></textarea>
              </div>
            </div>

            <div class="rounded-2xl border border-gray-200 p-4 space-y-3">
              <p class="text-xs font-semibold uppercase tracking-[0.2em] text-gray-400">French</p>
              <div>
                <label class="label">Title</label>
                <input v-model="formData.titleFr" type="text" class="input" required />
              </div>
              <div>
                <label class="label">Description</label>
                <textarea v-model="formData.descriptionFr" rows="4" class="input" required></textarea>
              </div>
            </div>
          </div>

          <div class="flex justify-end space-x-3 pt-2">
            <button type="button" @click="closeForm" class="btn-secondary">{{ $t('actions.cancel') }}</button>
            <button type="submit" class="btn-primary" :disabled="saving">
              {{ saving ? 'Saving...' : $t('actions.save') }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import axios from 'axios'
import { useToast } from 'vue-toastification'

type ResourceItem = {
  id: string
  type: 'guide' | 'video' | 'document'
  fileUrl: string
  published: boolean
  order: number
  title_en: string
  description_en: string
  title_fr: string
  description_fr: string
}

const toast = useToast()
const apiUrl = import.meta.env.VITE_API_URL || '/api'

const resources = ref<ResourceItem[]>([])
const showForm = ref(false)
const showDeleteModal = ref(false)
const editingResource = ref<ResourceItem | null>(null)
const resourceToDelete = ref<string | null>(null)
const searchQuery = ref('')
const filterType = ref('')
const saving = ref(false)

const formData = reactive({
  type: 'guide' as 'guide' | 'video' | 'document',
  fileUrl: '',
  order: 0,
  published: false,
  titleEn: '',
  descriptionEn: '',
  titleFr: '',
  descriptionFr: '',
})

const authHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem('admin_token')}`,
})

const loadResources = async () => {
  try {
    const response = await axios.get(`${apiUrl}/resources/admin`, {
      headers: authHeaders(),
    })
    resources.value = response.data
  } catch (error) {
    console.error('Error loading resources:', error)
    toast.error('Failed to load resources')
  }
}

const resetForm = () => {
  formData.type = 'guide'
  formData.fileUrl = ''
  formData.order = 0
  formData.published = false
  formData.titleEn = ''
  formData.descriptionEn = ''
  formData.titleFr = ''
  formData.descriptionFr = ''
}

const openCreateForm = () => {
  editingResource.value = null
  resetForm()
  showForm.value = true
}

const editResource = (resource: ResourceItem) => {
  editingResource.value = resource
  formData.type = resource.type
  formData.fileUrl = resource.fileUrl || ''
  formData.order = resource.order || 0
  formData.published = resource.published
  formData.titleEn = resource.title_en || ''
  formData.descriptionEn = resource.description_en || ''
  formData.titleFr = resource.title_fr || ''
  formData.descriptionFr = resource.description_fr || ''
  showForm.value = true
}

const closeForm = () => {
  showForm.value = false
  editingResource.value = null
  resetForm()
}

const deleteResource = (id: string) => {
  resourceToDelete.value = id
  showDeleteModal.value = true
}

const closeDeleteModal = () => {
  showDeleteModal.value = false
  resourceToDelete.value = null
}

const saveResource = async () => {
  saving.value = true

  const payload = {
    type: formData.type,
    fileUrl: formData.fileUrl,
    order: formData.order,
    published: formData.published,
    translations: [
      {
        language: 'en',
        title: formData.titleEn,
        description: formData.descriptionEn,
      },
      {
        language: 'fr',
        title: formData.titleFr,
        description: formData.descriptionFr,
      },
    ],
  }

  try {
    if (editingResource.value) {
      await axios.put(`${apiUrl}/resources/${editingResource.value.id}`, payload, {
        headers: authHeaders(),
      })
      toast.success('Resource updated successfully!')
    } else {
      await axios.post(`${apiUrl}/resources`, payload, {
        headers: authHeaders(),
      })
      toast.success('Resource created successfully!')
    }

    closeForm()
    await loadResources()
  } catch (error) {
    console.error('Error saving resource:', error)
    toast.error('Failed to save resource')
  } finally {
    saving.value = false
  }
}

const confirmDelete = async () => {
  if (!resourceToDelete.value) return

  try {
    await axios.delete(`${apiUrl}/resources/${resourceToDelete.value}`, {
      headers: authHeaders(),
    })
    toast.success('Resource deleted successfully!')
    closeDeleteModal()
    await loadResources()
  } catch (error) {
    console.error('Error deleting resource:', error)
    toast.error('Failed to delete resource')
  }
}

const filteredResources = computed(() => {
  const query = searchQuery.value.toLowerCase().trim()

  return resources.value.filter((resource) => {
    const matchesType = !filterType.value || resource.type === filterType.value
    const matchesSearch =
      !query ||
      resource.title_en.toLowerCase().includes(query) ||
      resource.title_fr.toLowerCase().includes(query) ||
      resource.description_en.toLowerCase().includes(query) ||
      resource.description_fr.toLowerCase().includes(query)

    return matchesType && matchesSearch
  })
})

onMounted(() => {
  loadResources()
})
</script>