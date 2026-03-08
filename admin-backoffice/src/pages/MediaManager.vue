<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-2xl font-headline font-semibold">{{ $t('admin.media') }}</h2>
        <p class="text-sm text-gray-500 mt-1">Upload and manage images, documents, and videos</p>
      </div>
      <div class="flex space-x-2">
        <button
          v-if="selectedMedia.length > 0"
          @click="bulkDelete"
          class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
          <span>Delete {{ selectedMedia.length }}</span>
        </button>
        <button @click="showUpload = true" class="btn-primary">
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
          </svg>
          {{ $t('actions.upload') }}
        </button>
      </div>
    </div>

    <!-- Filter Tabs -->
    <div class="flex space-x-2">
      <button
        v-for="type in mediaTypes"
        :key="type.key"
        @click="activeType = type.key"
        :class="[
          'px-4 py-2 text-sm font-medium rounded-lg transition-colors',
          activeType === type.key ? 'bg-primary text-white' : 'bg-white text-gray-600 hover:bg-gray-50 border'
        ]"
      >
        {{ type.label }}
      </button>
    </div>

    <!-- Media Grid -->
    <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
      <div v-for="item in filteredMedia" :key="item.id" class="group relative bg-white rounded-xl border overflow-hidden">
        <input
          type="checkbox"
          :value="item.id"
          v-model="selectedMedia"
          @click.stop
          class="absolute top-2 left-2 rounded border-gray-300 text-primary focus:ring-primary z-10"
        />
        <div @click="previewMedia(item)" class="aspect-square bg-gray-100 flex items-center justify-center cursor-pointer">
          <img v-if="item.type === 'image' || item.type === 'logo'" :src="item.url" :alt="item.altText" class="w-full h-full object-cover" />
          <svg v-else-if="item.type === 'document'" class="w-12 h-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <svg v-else class="w-12 h-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
        </div>
        <div class="p-2 pointer-events-none">
          <p class="text-xs font-medium text-gray-900 truncate">{{ item.altText }}</p>
          <p class="text-xs text-gray-400">{{ formatDate(item.createdAt) }}</p>
        </div>
        <div class="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-2 pointer-events-none">
          <button @click.stop="copyUrl(item.url)" class="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-gray-700 hover:text-blue-500 pointer-events-auto" title="Copy URL">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </button>
          <button @click.stop="editMedia(item)" class="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-gray-700 hover:text-primary pointer-events-auto" title="Edit">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
          </button>
          <button @click.stop="deleteMedia(item.id)" class="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-gray-700 hover:text-red-500 pointer-events-auto" title="Delete">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Preview Modal -->
    <div v-if="showPreview && previewItem" class="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4">
      <button @click="showPreview = false" class="absolute top-4 right-4 text-white hover:text-gray-300">
        <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
      <div class="max-w-4xl w-full">
        <img v-if="previewItem.type === 'image' || previewItem.type === 'logo'" :src="previewItem.url" :alt="previewItem.altText" class="w-full h-auto max-h-[80vh] object-contain rounded-lg" />
        <video v-else-if="previewItem.type === 'video'" :src="previewItem.url" controls class="w-full h-auto max-h-[80vh] rounded-lg"></video>
        <div v-else class="bg-white p-8 rounded-lg text-center">
          <svg class="w-20 h-20 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p class="text-lg font-medium text-gray-900 mb-2">{{ previewItem.altText }}</p>
          <a :href="previewItem.url" target="_blank" class="btn-primary inline-block">
            Download Document
          </a>
        </div>
        <div class="bg-white/10 backdrop-blur-sm text-white p-4 rounded-lg mt-4">
          <p class="font-medium mb-1">{{ previewItem.altText }}</p>
          <p class="text-sm text-gray-300">Type: {{ previewItem.type }} • Uploaded: {{ formatDate(previewItem.createdAt) }}</p>
        </div>
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
        <h3 class="text-xl font-headline font-semibold text-center mb-2">Delete Media{{ mediaToDelete ? '' : ' Files' }}</h3>
        <p class="text-gray-500 text-center mb-6">
          {{ mediaToDelete
            ? 'Are you sure you want to delete this media file? This action cannot be undone.'
            : `Are you sure you want to delete ${selectedMedia.length} media files? This action cannot be undone.`
          }}
        </p>
        <div class="flex justify-end space-x-3">
          <button @click="showDeleteModal = false; mediaToDelete = null" class="btn-secondary">Cancel</button>
          <button @click="confirmDelete" class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">Delete</button>
        </div>
      </div>
    </div>

    <!-- Edit Modal -->
    <div v-if="showEditModal && editingMedia" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-2xl max-w-lg w-full p-6">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-xl font-headline font-semibold">Edit Media</h3>
          <button @click="closeEditModal" class="text-gray-400 hover:text-gray-600">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div class="space-y-4">
          <div>
            <label class="label">Alt Text</label>
            <input type="text" v-model="editingMedia.altText" class="input" placeholder="Describe the image..." />
          </div>
          <div>
            <label class="label">Type</label>
            <select v-model="editingMedia.type" class="input">
              <option value="image">Image</option>
              <option value="document">Document</option>
              <option value="logo">Logo</option>
              <option value="video">Video</option>
            </select>
          </div>
          <div>
            <label class="label">URL</label>
            <input type="text" v-model="editingMedia.url" class="input" readonly />
          </div>
        </div>
        <div class="flex justify-end space-x-3 pt-4">
          <button type="button" @click="closeEditModal" class="btn-secondary">Cancel</button>
          <button type="button" @click="updateMedia" :disabled="isUpdating" class="btn-primary">
            {{ isUpdating ? 'Updating...' : 'Update' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Upload Modal -->
    <div v-if="showUpload" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-2xl max-w-lg w-full p-6">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-xl font-headline font-semibold">Upload Media</h3>
          <button @click="showUpload = false" class="text-gray-400 hover:text-gray-600">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div class="border-2 border-dashed border-gray-300 rounded-xl p-12 text-center">
          <input
            type="file"
            ref="fileInput"
            @change="handleFileSelect"
            accept="image/*,video/*,.pdf,.doc,.docx"
            class="hidden"
          />
          <svg class="w-12 h-12 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p v-if="!selectedFile" class="text-sm text-gray-500 mb-2">Drag and drop files here, or</p>
          <p v-else class="text-sm text-gray-700 mb-2 font-medium">📄 {{ selectedFile.name }}</p>
          <button type="button" @click="$refs.fileInput.click()" class="btn-secondary">
            {{ selectedFile ? 'Change File' : 'Browse Files' }}
          </button>
          <p class="text-xs text-gray-400 mt-3">Supports: JPG, PNG, SVG, PDF, MP4 (max 10MB)</p>
        </div>
        <div class="mt-4 space-y-3">
          <div>
            <label class="label">Alt Text</label>
            <input type="text" v-model="uploadForm.altText" class="input" placeholder="Describe the image..." />
          </div>
          <div>
            <label class="label">Type (Auto-detected)</label>
            <select v-model="uploadForm.type" class="input bg-gray-50" disabled>
              <option value="image">Image</option>
              <option value="document">Document</option>
              <option value="logo">Logo</option>
              <option value="video">Video</option>
            </select>
            <p class="text-xs text-gray-500 mt-1">Type is automatically detected from the file</p>
          </div>
        </div>
        <div class="flex justify-end space-x-3 pt-4">
          <button type="button" @click="closeUploadModal" class="btn-secondary">{{ $t('actions.cancel') }}</button>
          <button type="button" @click="handleUpload" :disabled="!selectedFile || isUploading" class="btn-primary">
            {{ isUploading ? 'Uploading...' : $t('actions.upload') }}
          </button>
        </div>
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
const showUpload = ref(false)
const activeType = ref('all')
const selectedFile = ref<File | null>(null)
const fileInput = ref<HTMLInputElement | null>(null)
const isUploading = ref(false)
const selectedMedia = ref<string[]>([])
const showDeleteModal = ref(false)
const mediaToDelete = ref<string | null>(null)
const showEditModal = ref(false)
const editingMedia = ref<any>(null)
const isUpdating = ref(false)
const showPreview = ref(false)
const previewItem = ref<any>(null)

const uploadForm = ref({
  altText: '',
  type: 'image'
})

const mediaTypes = [
  { key: 'all', label: 'All' },
  { key: 'image', label: 'Images' },
  { key: 'document', label: 'Documents' },
  { key: 'logo', label: 'Logos' },
  { key: 'video', label: 'Videos' },
]

const mediaItems = ref<any[]>([])

const loadMedia = async () => {
  try {
    const response = await axios.get(`${apiUrl}/media`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('admin_token')}`
      }
    })
    mediaItems.value = response.data
  } catch (error) {
    toast.error('Failed to load media')
  }
}

const detectFileType = (file: File): string => {
  const ext = file.name.split('.').pop()?.toLowerCase() || ''
  const mimeType = file.type.toLowerCase()

  // Image types
  if (mimeType.startsWith('image/') || ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp', 'ico'].includes(ext)) {
    // Check if it's likely a logo based on filename
    if (file.name.toLowerCase().includes('logo')) {
      return 'logo'
    }
    return 'image'
  }

  // Video types
  if (mimeType.startsWith('video/') || ['mp4', 'webm', 'ogg', 'mov', 'avi', 'mkv'].includes(ext)) {
    return 'video'
  }

  // Everything else is a document
  return 'document'
}

const handleFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files && target.files.length > 0) {
    selectedFile.value = target.files[0]
    // Auto-set alt text from filename
    if (!uploadForm.value.altText) {
      uploadForm.value.altText = target.files[0].name.replace(/\.[^/.]+$/, '')
    }
    // Auto-detect file type
    uploadForm.value.type = detectFileType(target.files[0])
  }
}

const handleUpload = async () => {
  if (!selectedFile.value) {
    toast.error('Please select a file')
    return
  }

  isUploading.value = true
  const formData = new FormData()
  formData.append('file', selectedFile.value)
  formData.append('alt_text', uploadForm.value.altText)
  formData.append('type', uploadForm.value.type)

  try {
    await axios.post(`${apiUrl}/media/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${localStorage.getItem('admin_token')}`
      }
    })
    toast.success('File uploaded successfully!')
    closeUploadModal()
    loadMedia()
  } catch (error) {
    toast.error('Failed to upload file')
  } finally {
    isUploading.value = false
  }
}

const closeUploadModal = () => {
  showUpload.value = false
  selectedFile.value = null
  uploadForm.value = {
    altText: '',
    type: 'image'
  }
}

const previewMedia = (item: any) => {
  previewItem.value = item
  showPreview.value = true
}

const copyUrl = async (url: string) => {
  try {
    await navigator.clipboard.writeText(url)
    toast.success('URL copied to clipboard!')
  } catch (error) {
    toast.error('Failed to copy URL')
  }
}

const editMedia = (item: any) => {
  editingMedia.value = { ...item }
  showEditModal.value = true
}

const closeEditModal = () => {
  showEditModal.value = false
  editingMedia.value = null
}

const updateMedia = async () => {
  if (!editingMedia.value) return

  isUpdating.value = true
  try {
    await axios.put(`${apiUrl}/media/${editingMedia.value.id}`, {
      altText: editingMedia.value.altText,
      type: editingMedia.value.type,
    }, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('admin_token')}`
      }
    })
    toast.success('Media updated successfully!')
    closeEditModal()
    loadMedia()
  } catch (error) {
    toast.error('Failed to update media')
  } finally {
    isUpdating.value = false
  }
}

const deleteMedia = (id: string) => {
  mediaToDelete.value = id
  showDeleteModal.value = true
}

const bulkDelete = () => {
  mediaToDelete.value = null
  showDeleteModal.value = true
}

const confirmDelete = async () => {
  try {
    if (mediaToDelete.value) {
      // Single delete
      await axios.delete(`${apiUrl}/media/${mediaToDelete.value}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('admin_token')}`
        }
      })
      toast.success('Media deleted successfully!')
    } else {
      // Bulk delete
      await Promise.all(
        selectedMedia.value.map(id =>
          axios.delete(`${apiUrl}/media/${id}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('admin_token')}`
            }
          })
        )
      )
      toast.success(`${selectedMedia.value.length} media files deleted successfully!`)
      selectedMedia.value = []
    }
    showDeleteModal.value = false
    mediaToDelete.value = null
    loadMedia()
  } catch (error) {
    toast.error('Failed to delete media')
  }
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString()
}

const filteredMedia = computed(() => {
  if (activeType.value === 'all') return mediaItems.value
  return mediaItems.value.filter((m) => m.type === activeType.value)
})

onMounted(() => {
  loadMedia()
})
</script>
