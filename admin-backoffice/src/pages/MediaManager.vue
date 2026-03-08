<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-2xl font-headline font-semibold">{{ $t('admin.media') }}</h2>
        <p class="text-sm text-gray-500 mt-1">Upload and manage images, documents, and videos</p>
      </div>
      <button @click="showUpload = true" class="btn-primary">
        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
        </svg>
        {{ $t('actions.upload') }}
      </button>
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
        <div class="aspect-square bg-gray-100 flex items-center justify-center">
          <img v-if="item.type === 'image' || item.type === 'logo'" :src="item.url" :alt="item.alt_text" class="w-full h-full object-cover" />
          <svg v-else-if="item.type === 'document'" class="w-12 h-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <svg v-else class="w-12 h-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
        </div>
        <div class="p-2">
          <p class="text-xs font-medium text-gray-900 truncate">{{ item.alt_text }}</p>
          <p class="text-xs text-gray-400">{{ item.uploaded_at }}</p>
        </div>
        <div class="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-2">
          <button class="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-gray-700 hover:text-primary">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
          </button>
          <button class="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-gray-700 hover:text-red-500">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
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
          <svg class="w-12 h-12 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p class="text-sm text-gray-500 mb-2">Drag and drop files here, or</p>
          <button class="btn-secondary">Browse Files</button>
          <p class="text-xs text-gray-400 mt-3">Supports: JPG, PNG, SVG, PDF, MP4 (max 10MB)</p>
        </div>
        <div class="mt-4 space-y-3">
          <div>
            <label class="label">Alt Text</label>
            <input type="text" class="input" placeholder="Describe the image..." />
          </div>
          <div>
            <label class="label">Type</label>
            <select class="input">
              <option value="image">Image</option>
              <option value="document">Document</option>
              <option value="logo">Logo</option>
              <option value="video">Video</option>
            </select>
          </div>
        </div>
        <div class="flex justify-end space-x-3 pt-4">
          <button @click="showUpload = false" class="btn-secondary">{{ $t('actions.cancel') }}</button>
          <button class="btn-primary">{{ $t('actions.upload') }}</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const showUpload = ref(false)
const activeType = ref('all')

const mediaTypes = [
  { key: 'all', label: 'All' },
  { key: 'image', label: 'Images' },
  { key: 'document', label: 'Documents' },
  { key: 'logo', label: 'Logos' },
  { key: 'video', label: 'Videos' },
]

const mediaItems = ref([
  { id: 1, url: 'https://images.unsplash.com/photo-1584515933487-779824d29309?w=300', type: 'image', alt_text: 'Maternal Health', uploaded_at: 'Mar 1, 2026' },
  { id: 2, url: 'https://images.unsplash.com/photo-1632053001332-2f6735363d10?w=300', type: 'image', alt_text: 'Vaccination Drive', uploaded_at: 'Feb 20, 2026' },
  { id: 3, url: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=300', type: 'image', alt_text: 'Nutrition Program', uploaded_at: 'Feb 15, 2026' },
  { id: 4, url: 'https://via.placeholder.com/300?text=WHO', type: 'logo', alt_text: 'WHO Logo', uploaded_at: 'Feb 10, 2026' },
  { id: 5, url: '', type: 'document', alt_text: 'Annual Report 2025', uploaded_at: 'Feb 5, 2026' },
  { id: 6, url: '', type: 'video', alt_text: 'Health Workshop Recording', uploaded_at: 'Jan 28, 2026' },
])

const filteredMedia = computed(() => {
  if (activeType.value === 'all') return mediaItems.value
  return mediaItems.value.filter((m) => m.type === activeType.value)
})
</script>
