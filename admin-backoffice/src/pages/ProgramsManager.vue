<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-2xl font-headline font-semibold">{{ $t('admin.programs') }}</h2>
        <p class="text-sm text-gray-500 mt-1">Manage health programs and services</p>
      </div>
      <button @click="showForm = true" class="btn-primary">
        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
        {{ $t('actions.create') }} Program
      </button>
    </div>

    <!-- Programs Table -->
    <div class="card">
      <div class="flex items-center justify-between mb-4">
        <input type="text" v-model="searchQuery" :placeholder="$t('actions.search')" class="input max-w-xs" />
        <select v-model="filterLanguage" class="input max-w-[120px]">
          <option value="">All Languages</option>
          <option value="en">English</option>
          <option value="fr">French</option>
        </select>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead>
            <tr class="border-b border-gray-100">
              <th class="text-left py-3 px-3 text-gray-500 font-medium">Title</th>
              <th class="text-left py-3 px-3 text-gray-500 font-medium">Category</th>
              <th class="text-left py-3 px-3 text-gray-500 font-medium">Language</th>
              <th class="text-left py-3 px-3 text-gray-500 font-medium">Order</th>
              <th class="text-left py-3 px-3 text-gray-500 font-medium">Status</th>
              <th class="text-right py-3 px-3 text-gray-500 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="program in filteredPrograms" :key="program.id" class="border-b border-gray-50 hover:bg-gray-50">
              <td class="py-3 px-3">
                <div class="flex items-center space-x-3">
                  <img :src="program.image" :alt="program.title" class="w-10 h-10 rounded-lg object-cover" />
                  <span class="font-medium text-gray-900">{{ program.title }}</span>
                </div>
              </td>
              <td class="py-3 px-3">
                <span class="px-2 py-1 text-xs bg-primary-light text-primary rounded-full">{{ program.category }}</span>
              </td>
              <td class="py-3 px-3 text-gray-500 uppercase">{{ program.language }}</td>
              <td class="py-3 px-3 text-gray-500">{{ program.order }}</td>
              <td class="py-3 px-3">
                <span :class="program.published ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'"
                  class="px-2 py-1 text-xs rounded-full">
                  {{ program.published ? 'Published' : 'Draft' }}
                </span>
              </td>
              <td class="py-3 px-3 text-right">
                <button class="text-primary hover:underline text-xs mr-3">{{ $t('actions.edit') }}</button>
                <button class="text-red-500 hover:underline text-xs">{{ $t('actions.delete') }}</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Create/Edit Modal -->
    <div v-if="showForm" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-xl font-headline font-semibold">New Program</h3>
          <button @click="showForm = false" class="text-gray-400 hover:text-gray-600">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <form @submit.prevent="showForm = false" class="space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="label">Title</label>
              <input type="text" class="input" placeholder="Program title" />
            </div>
            <div>
              <label class="label">Category</label>
              <select class="input">
                <option>maternal</option>
                <option>vaccination</option>
                <option>nutrition</option>
                <option>wellness</option>
                <option>outreach</option>
              </select>
            </div>
          </div>
          <div>
            <label class="label">Description</label>
            <textarea class="input" rows="4" placeholder="Program description..."></textarea>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="label">Language</label>
              <select class="input">
                <option value="en">English</option>
                <option value="fr">French</option>
              </select>
            </div>
            <div>
              <label class="label">Order</label>
              <input type="number" class="input" value="1" />
            </div>
          </div>
          <div>
            <label class="label">Image URL</label>
            <input type="text" class="input" placeholder="https://..." />
          </div>
          <div class="flex items-center space-x-2">
            <input type="checkbox" id="published" class="rounded border-gray-300 text-primary" />
            <label for="published" class="text-sm text-gray-700">Published</label>
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
import { ref, computed } from 'vue'

const showForm = ref(false)
const searchQuery = ref('')
const filterLanguage = ref('')

const programs = ref([
  { id: 1, title: 'Maternal Health Program', category: 'maternal', language: 'en', order: 1, published: true, image: 'https://images.unsplash.com/photo-1584515933487-779824d29309?w=100' },
  { id: 2, title: 'Community Vaccination', category: 'vaccination', language: 'en', order: 2, published: true, image: 'https://images.unsplash.com/photo-1632053001332-2f6735363d10?w=100' },
  { id: 3, title: 'Nutrition Awareness', category: 'nutrition', language: 'en', order: 3, published: true, image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=100' },
  { id: 4, title: 'Programme Santé Maternelle', category: 'maternal', language: 'fr', order: 1, published: true, image: 'https://images.unsplash.com/photo-1584515933487-779824d29309?w=100' },
  { id: 5, title: 'Vaccination Communautaire', category: 'vaccination', language: 'fr', order: 2, published: false, image: 'https://images.unsplash.com/photo-1632053001332-2f6735363d10?w=100' },
])

const filteredPrograms = computed(() => {
  return programs.value.filter((p) => {
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchesLang = !filterLanguage.value || p.language === filterLanguage.value
    return matchesSearch && matchesLang
  })
})
</script>
