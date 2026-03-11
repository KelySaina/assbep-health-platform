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
        <div class="flex flex-col sm:flex-row gap-3 sm:items-center">
          <input v-model="searchQuery" type="text" :placeholder="$t('actions.search')" class="input max-w-xs" />
          <select v-model="filterType" class="input max-w-[180px]">
            <option value="">All Types</option>
            <option value="guide">Guides</option>
            <option value="video">Videos</option>
            <option value="document">Documents</option>
          </select>
        </div>
        <div class="flex items-center gap-3">
          <p class="text-xs text-gray-500" v-if="selectedResources.length">
            {{ selectedResources.length }} selected
          </p>
          <button
            v-if="selectedResources.length"
            @click="deleteSelectedResources"
            class="px-3 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
          >
            Delete Selected
          </button>
        </div>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead>
            <tr class="border-b border-gray-100">
              <th class="text-left py-3 px-3 w-12">
                <input
                  type="checkbox"
                  class="rounded border-gray-300 text-primary focus:ring-primary"
                  :checked="allFilteredSelected"
                  :indeterminate.prop="someFilteredSelected && !allFilteredSelected"
                  @change="toggleSelectAllFiltered"
                />
              </th>
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
              <td class="py-3 px-3 align-top">
                <input
                  :checked="selectedResources.includes(resource.id)"
                  @change="toggleResourceSelection(resource.id)"
                  type="checkbox"
                  class="rounded border-gray-300 text-primary focus:ring-primary"
                />
              </td>
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
        <h3 class="text-xl font-headline font-semibold text-center mb-2">
          {{ resourceToDelete ? 'Delete Resource' : 'Delete Resources' }}
        </h3>
        <p class="text-gray-500 text-center mb-6">
          {{
            resourceToDelete
              ? 'Are you sure you want to delete this resource? This action cannot be undone.'
              : `Are you sure you want to delete ${selectedResources.length} selected resources? This action cannot be undone.`
          }}
        </p>
        <div class="flex justify-end space-x-3">
          <button @click="closeDeleteModal" class="btn-secondary">Cancel</button>
          <button @click="confirmDelete" class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors" :disabled="bulkDeleting">
            {{ bulkDeleting ? 'Deleting...' : 'Delete' }}
          </button>
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
            <div class="flex items-center justify-between gap-3 mb-2">
              <label class="label mb-0">File URL</label>
              <div class="flex flex-wrap justify-end gap-2">
                <button type="button" @click="openMediaPicker" class="px-3 py-2 text-xs font-medium text-primary bg-primary-light rounded-lg hover:bg-blue-100 transition-colors">
                  Choose From Media
                </button>
                <label class="px-3 py-2 text-xs font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors cursor-pointer">
                  <input type="file" class="hidden" @change="uploadResourceFile" />
                  {{ uploadingResourceFile ? 'Uploading...' : 'Upload To Media' }}
                </label>
                <router-link to="/media" class="px-3 py-2 text-xs font-medium text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  Open Media Manager
                </router-link>
              </div>
            </div>
            <input v-model="formData.fileUrl" type="text" class="input" placeholder="https://... or storage URL" />
            <p class="text-xs text-gray-500 mt-1">Uploaded files are stored in Media Manager automatically, then linked here.</p>
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

    <div v-if="showMediaPicker" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div class="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h3 class="text-xl font-headline font-semibold">Choose Resource File</h3>
            <p class="text-sm text-gray-500 mt-1">Pick an existing file from Media Manager or upload a new one directly here.</p>
          </div>
          <button @click="showMediaPicker = false" class="text-gray-400 hover:text-gray-600">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div class="p-6 flex-1 overflow-y-auto">
          <div class="mb-6">
            <label class="block w-full cursor-pointer">
              <input type="file" @change="uploadResourceFile" class="hidden" />
              <div class="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-primary hover:bg-primary-light/30 transition-colors">
                <svg class="w-12 h-12 mx-auto text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <p class="text-sm text-gray-600 font-medium">Upload a new resource file to Media Manager</p>
                <p class="text-xs text-gray-500 mt-1">Documents and videos uploaded here will be reusable across the backoffice.</p>
              </div>
            </label>
          </div>

          <div>
            <div class="flex items-center justify-between mb-3">
              <h4 class="font-medium">Available media files</h4>
              <router-link to="/media" class="text-sm text-primary hover:underline">Go to full Media Manager</router-link>
            </div>
            <div v-if="loadingMedia" class="text-center py-8 text-gray-500">
              Loading media...
            </div>
            <div v-else-if="filteredMediaLibrary.length === 0" class="text-center py-8 text-gray-500">
              No matching files in media library yet.
            </div>
            <div v-else class="grid gap-3 md:grid-cols-2">
              <button
                v-for="media in filteredMediaLibrary"
                :key="media.id"
                type="button"
                @click="selectMediaFile(media.url)"
                class="rounded-2xl border border-gray-200 p-4 text-left hover:border-primary hover:bg-primary-light/30 transition-colors"
                :class="formData.fileUrl === media.url ? 'border-primary bg-primary-light/50' : ''"
              >
                <div class="flex items-start gap-4">
                  <div class="w-16 h-16 rounded-xl overflow-hidden bg-gray-100 flex items-center justify-center flex-shrink-0">
                    <img v-if="media.type === 'image'" :src="media.url" :alt="media.altText || 'Media file'" class="w-full h-full object-cover" />
                    <video v-else-if="media.type === 'video'" :src="media.url" class="w-full h-full object-cover" muted></video>
                    <svg v-else class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div class="min-w-0">
                    <p class="text-xs font-semibold uppercase tracking-[0.2em] text-gray-400">{{ media.type }}</p>
                    <p class="font-medium text-gray-900 mt-1 break-words">{{ media.altText || media.url.split('/').pop() || 'Media file' }}</p>
                    <p class="text-xs text-gray-500 mt-1 break-all">{{ media.url }}</p>
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>

        <div class="p-6 border-t border-gray-200 flex justify-end space-x-3">
          <button @click="showMediaPicker = false" class="btn-secondary">Close</button>
        </div>
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

type MediaItem = {
  id: string
  url: string
  type: 'image' | 'video' | 'document' | 'logo'
  altText?: string
}

const toast = useToast()
const apiUrl = import.meta.env.VITE_API_URL || '/api'

const resources = ref<ResourceItem[]>([])
const mediaLibrary = ref<MediaItem[]>([])
const showForm = ref(false)
const showDeleteModal = ref(false)
const showMediaPicker = ref(false)
const editingResource = ref<ResourceItem | null>(null)
const resourceToDelete = ref<string | null>(null)
const selectedResources = ref<string[]>([])
const searchQuery = ref('')
const filterType = ref('')
const saving = ref(false)
const bulkDeleting = ref(false)
const loadingMedia = ref(false)
const uploadingResourceFile = ref(false)

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

const detectFileType = (file: File): MediaItem['type'] => {
  const ext = file.name.split('.').pop()?.toLowerCase() || ''
  const mimeType = file.type.toLowerCase()

  if (mimeType.startsWith('image/') || ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp', 'ico'].includes(ext)) {
    return 'image'
  }

  if (mimeType.startsWith('video/') || ['mp4', 'webm', 'ogg', 'mov', 'avi', 'mkv'].includes(ext)) {
    return 'video'
  }

  return 'document'
}

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

const loadMediaLibrary = async () => {
  loadingMedia.value = true
  try {
    const response = await axios.get(`${apiUrl}/media`, {
      headers: authHeaders(),
    })
    mediaLibrary.value = response.data
  } catch (error) {
    console.error('Error loading media library:', error)
    toast.error('Failed to load media library')
  } finally {
    loadingMedia.value = false
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
  showMediaPicker.value = false
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

const openMediaPicker = async () => {
  showMediaPicker.value = true
  if (!mediaLibrary.value.length) {
    await loadMediaLibrary()
  }
}

const selectMediaFile = (url: string) => {
  formData.fileUrl = url
  showMediaPicker.value = false
}

const uploadResourceFile = async (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file) return

  uploadingResourceFile.value = true
  const uploadPayload = new FormData()
  uploadPayload.append('file', file)
  uploadPayload.append('type', detectFileType(file))
  uploadPayload.append('alt_text', formData.titleEn || file.name.replace(/\.[^/.]+$/, ''))

  try {
    const response = await axios.post(`${apiUrl}/media/upload`, uploadPayload, {
      headers: {
        ...authHeaders(),
        'Content-Type': 'multipart/form-data',
      },
    })

    formData.fileUrl = response.data.url
    toast.success('File uploaded to media library successfully!')
    await loadMediaLibrary()
    showMediaPicker.value = false
  } catch (error: any) {
    console.error('Error uploading resource file:', error)
    toast.error(error.response?.data?.message || 'Failed to upload file to media library')
  } finally {
    target.value = ''
    uploadingResourceFile.value = false
  }
}

const toggleResourceSelection = (id: string) => {
  if (selectedResources.value.includes(id)) {
    selectedResources.value = selectedResources.value.filter((resourceId) => resourceId !== id)
    return
  }

  selectedResources.value = [...selectedResources.value, id]
}

const toggleSelectAllFiltered = () => {
  if (allFilteredSelected.value) {
    selectedResources.value = selectedResources.value.filter(
      (id) => !filteredResources.value.some((resource) => resource.id === id),
    )
    return
  }

  const nextSelection = new Set(selectedResources.value)
  filteredResources.value.forEach((resource) => {
    nextSelection.add(resource.id)
  })
  selectedResources.value = Array.from(nextSelection)
}

const deleteSelectedResources = () => {
  if (!selectedResources.value.length) {
    return
  }

  resourceToDelete.value = null
  showDeleteModal.value = true
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
  if (!resourceToDelete.value && !selectedResources.value.length) return

  bulkDeleting.value = true

  try {
    if (resourceToDelete.value) {
      await axios.delete(`${apiUrl}/resources/${resourceToDelete.value}`, {
        headers: authHeaders(),
      })
      selectedResources.value = selectedResources.value.filter((id) => id !== resourceToDelete.value)
      toast.success('Resource deleted successfully!')
    } else {
      await Promise.all(
        selectedResources.value.map((id) =>
          axios.delete(`${apiUrl}/resources/${id}`, {
            headers: authHeaders(),
          }),
        ),
      )
      toast.success(`${selectedResources.value.length} resources deleted successfully!`)
      selectedResources.value = []
    }

    closeDeleteModal()
    await loadResources()
  } catch (error) {
    console.error('Error deleting resource:', error)
    toast.error('Failed to delete resource')
  } finally {
    bulkDeleting.value = false
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

const filteredMediaLibrary = computed(() => {
  if (formData.type === 'video') {
    return mediaLibrary.value.filter((media) => media.type === 'video')
  }

  return mediaLibrary.value.filter((media) => media.type === 'document' || media.type === 'image')
})

const allFilteredSelected = computed(() => {
  return filteredResources.value.length > 0 && filteredResources.value.every((resource) => selectedResources.value.includes(resource.id))
})

const someFilteredSelected = computed(() => {
  return filteredResources.value.some((resource) => selectedResources.value.includes(resource.id))
})

onMounted(() => {
  loadResources()
  loadMediaLibrary()
})
</script>