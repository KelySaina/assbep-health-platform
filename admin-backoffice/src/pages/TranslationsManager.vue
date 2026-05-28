<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-2xl font-headline font-semibold">{{ $t('admin.translations') }}</h2>
        <p class="text-sm text-gray-500 mt-1">Manage all phrases and translations for the website</p>
      </div>
      <button @click="showForm = true" class="btn-primary">
        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
        Add Phrase
      </button>
    </div>

    <!-- Filters -->
    <div class="card">
      <div class="flex items-center space-x-4 mb-6">
        <input type="text" v-model="searchQuery" :placeholder="$t('actions.search')" class="input max-w-xs" />
        <select v-model="filterGroup" class="input max-w-[160px]">
          <option value="">All Groups</option>
          <option value="hero">Hero</option>
          <option value="nav">Navigation</option>
          <option value="cta">CTA</option>
          <option value="footer">Footer</option>
          <option value="programs">Programs</option>
          <option value="blog">Blog</option>
          <option value="contact">Contact</option>
        </select>
      </div>

      <!-- Translations Table -->
      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead>
            <tr class="border-b border-gray-100">
              <th class="text-left py-3 px-3 text-gray-500 font-medium">Key</th>
              <th class="text-left py-3 px-3 text-gray-500 font-medium">Group</th>
              <th class="text-left py-3 px-3 text-gray-500 font-medium">English</th>
              <th class="text-left py-3 px-3 text-gray-500 font-medium">French</th>
              <th class="text-right py-3 px-3 text-gray-500 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="phrase in filteredPhrases" :key="phrase.key" class="border-b border-gray-50 hover:bg-gray-50">
              <td class="py-3 px-3">
                <code class="text-xs bg-gray-100 px-2 py-1 rounded">{{ phrase.key }}</code>
              </td>
              <td class="py-3 px-3">
                <span class="px-2 py-1 text-xs bg-purple-100 text-purple-700 rounded-full">{{ phrase.group }}</span>
              </td>
              <td class="py-3 px-3">
                <input
                  v-model="phrase.en"
                  class="input text-xs"
                  @change="markDirty(phrase.key)"
                />
              </td>
              <td class="py-3 px-3">
                <input
                  v-model="phrase.fr"
                  class="input text-xs"
                  @change="markDirty(phrase.key)"
                />
              </td>
              <td class="py-3 px-3 text-right">
                <button
                  v-if="dirtyKeys.has(phrase.key)"
                  @click="savPhrase(phrase.key)"
                  class="text-green-600 hover:underline text-xs mr-3"
                >
                  {{ $t('actions.save') }}
                </button>
                <button class="text-red-500 hover:underline text-xs">{{ $t('actions.delete') }}</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Add Phrase Modal -->
    <div v-if="showForm" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-2xl max-w-lg w-full p-6">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-xl font-headline font-semibold">Add New Phrase</h3>
          <button @click="showForm = false" class="text-gray-400 hover:text-gray-600">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <form @submit.prevent="showForm = false" class="space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="label">Key</label>
              <input type="text" class="input" placeholder="hero_title" />
            </div>
            <div>
              <label class="label">Group</label>
              <input type="text" class="input" placeholder="hero" />
            </div>
          </div>
          <div>
            <label class="label">English Value</label>
            <textarea class="input" rows="2" placeholder="English text..."></textarea>
          </div>
          <div>
            <label class="label">French Value</label>
            <textarea class="input" rows="2" placeholder="French text..."></textarea>
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
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import { useToast } from 'vue-toastification'

const toast = useToast()
const apiUrl = import.meta.env.VITE_API_URL || '/api'
const showForm = ref(false)
const searchQuery = ref('')
const filterGroup = ref('')
const dirtyKeys = ref(new Set<string>())

const phrases = ref<any[]>([])

const loadPhrases = async () => {
  try {
    const response = await axios.get(`${apiUrl}/phrases`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('admin_token')}`
      }
    })
    phrases.value = response.data
  } catch (error) {
    console.error('Error loading phrases:', error)
    toast.error('Failed to load translations')
  }
}

const filteredPhrases = computed(() => {
  return phrases.value.filter((p) => {
    const matchesSearch = p.key?.includes(searchQuery.value) || p.en?.toLowerCase().includes(searchQuery.value.toLowerCase()) || p.fr?.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchesGroup = !filterGroup.value || p.group === filterGroup.value
    return matchesSearch && matchesGroup
  })
})

const markDirty = (key: string) => {
  dirtyKeys.value.add(key)
}

const savPhrase = (key: string) => {
  dirtyKeys.value.delete(key)
}

onMounted(() => {
  loadPhrases()
})
</script>
