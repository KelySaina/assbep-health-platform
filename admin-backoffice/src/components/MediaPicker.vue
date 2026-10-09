<template>
  <div>
    <div class="flex items-center gap-2">
      <input :value="modelValue" @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)" type="text" class="input flex-1" :placeholder="placeholder" />
      <button type="button" @click="showPicker = true" class="btn-secondary whitespace-nowrap text-sm px-3 py-2">
        <svg class="w-4 h-4 mr-1 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        Browse
      </button>
    </div>
    <div v-if="modelValue" class="mt-2">
      <img :src="modelValue" class="h-12 rounded-lg object-contain border" />
    </div>

    <!-- Media Picker Modal -->
    <div v-if="showPicker" class="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4">
      <div class="bg-white rounded-2xl max-w-3xl w-full max-h-[80vh] overflow-hidden flex flex-col">
        <div class="flex items-center justify-between p-5 border-b">
          <h3 class="text-lg font-headline font-semibold">Choose from Media</h3>
          <button @click="showPicker = false" class="text-gray-400 hover:text-gray-600">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div class="p-5 flex-1 overflow-y-auto">
          <div v-if="loading" class="text-center py-8 text-gray-500">Loading media...</div>
          <div v-else-if="mediaItems.length === 0" class="text-center py-8 text-gray-500">No media files found.</div>
          <div v-else class="grid grid-cols-3 md:grid-cols-4 gap-3">
            <button
              v-for="item in mediaItems"
              :key="item.id"
              type="button"
              @click="selectItem(urlWithFraming(item))"
              class="aspect-square rounded-xl border-2 overflow-hidden hover:border-primary transition-colors"
              :class="modelValue === item.url ? 'border-primary ring-2 ring-primary/20' : 'border-gray-200'"
            >
              <img v-if="item.type === 'image' || item.type === 'logo'" :src="item.url" :alt="item.altText" class="w-full h-full object-cover" :style="focalStyle(urlWithFraming(item))" />
              <div v-else class="w-full h-full flex items-center justify-center bg-gray-50">
                <svg class="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { withFocal, focalStyle } from '../utils/focal'
import { ref, watch } from 'vue'
import axios from 'axios'

const props = defineProps<{
  modelValue: string
  placeholder?: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const apiUrl = import.meta.env.VITE_API_URL || '/api'
const showPicker = ref(false)
const loading = ref(false)
const mediaItems = ref<any[]>([])

const loadMedia = async () => {
  loading.value = true
  try {
    const response = await axios.get(`${apiUrl}/media`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('admin_token')}` }
    })
    mediaItems.value = response.data
  } catch {
    mediaItems.value = []
  } finally {
    loading.value = false
  }
}

watch(showPicker, (val) => {
  if (val && mediaItems.value.length === 0) {
    loadMedia()
  }
})

/**
 * Carry the media row's framing into the URL that gets stored on the article,
 * programme or partner. Those columns hold a bare URL with no link back to the
 * media row, so this is what lets the public site know where to look without an
 * extra request — see utils/focal.ts.
 *
 * A centred focal point adds no fragment, so picking an unframed image stores
 * exactly the same string it always did.
 */
const urlWithFraming = (item: any): string =>
  withFocal(item.url, {
    x: Number.isFinite(Number(item.focalX)) ? Number(item.focalX) : 50,
    y: Number.isFinite(Number(item.focalY)) ? Number(item.focalY) : 50,
  })

const selectItem = (url: string) => {
  emit('update:modelValue', url)
  showPicker.value = false
}
</script>
