<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-2xl font-headline font-semibold">{{ $t('admin.partners') }}</h2>
        <p class="text-sm text-gray-500 mt-1">Manage partner organizations</p>
      </div>
      <button @click="showForm = true" class="btn-primary">
        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
        Add Partner
      </button>
    </div>

    <div class="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
      <div v-for="partner in partners" :key="partner.id" class="card text-center group relative">
        <div class="h-16 flex items-center justify-center mb-3">
          <img :src="partner.logo" :alt="partner.name" class="max-h-12 object-contain" />
        </div>
        <h4 class="font-medium text-gray-900 text-sm">{{ partner.name }}</h4>
        <p class="text-xs text-gray-400 mt-1">Order: {{ partner.order }}</p>
        <div class="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity flex space-x-1">
          <button class="w-7 h-7 bg-primary-light rounded-lg flex items-center justify-center text-primary text-xs hover:bg-primary hover:text-white transition-colors">
            ✎
          </button>
          <button class="w-7 h-7 bg-red-100 rounded-lg flex items-center justify-center text-red-500 text-xs hover:bg-red-500 hover:text-white transition-colors">
            ✕
          </button>
        </div>
      </div>
    </div>

    <!-- Add Partner Modal -->
    <div v-if="showForm" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-2xl max-w-md w-full p-6">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-xl font-headline font-semibold">Add Partner</h3>
          <button @click="showForm = false" class="text-gray-400 hover:text-gray-600">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <form @submit.prevent="showForm = false" class="space-y-4">
          <div>
            <label class="label">Name</label>
            <input type="text" class="input" placeholder="Organization name" />
          </div>
          <div>
            <label class="label">Logo URL</label>
            <input type="text" class="input" placeholder="https://..." />
          </div>
          <div>
            <label class="label">Website</label>
            <input type="url" class="input" placeholder="https://..." />
          </div>
          <div>
            <label class="label">Display Order</label>
            <input type="number" class="input" value="1" />
          </div>
          <div class="flex justify-end space-x-3 pt-4">
            <button type="button" @click="showForm = false" class="btn-secondary">{{ $t('actions.cancel') }}</button>
            <button type="submit" class="btn-primary">{{ $t('actions.save') }}</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const showForm = ref(false)

const partners = ref([
  { id: 1, name: 'World Health Organization', logo: 'https://via.placeholder.com/200x80?text=WHO', website: 'https://who.int', order: 1 },
  { id: 2, name: 'UNICEF', logo: 'https://via.placeholder.com/200x80?text=UNICEF', website: 'https://unicef.org', order: 2 },
  { id: 3, name: 'Red Cross', logo: 'https://via.placeholder.com/200x80?text=Red+Cross', website: 'https://redcross.org', order: 3 },
  { id: 4, name: 'Ministry of Health', logo: 'https://via.placeholder.com/200x80?text=MoH', website: '#', order: 4 },
  { id: 5, name: 'Community Foundation', logo: 'https://via.placeholder.com/200x80?text=CF', website: '#', order: 5 },
])
</script>
