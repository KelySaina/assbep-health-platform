<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-2xl font-headline font-semibold">{{ $t('admin.partners') }}</h2>
        <p class="text-sm text-gray-500 mt-1">Manage partner organizations</p>
      </div>
      <div class="flex space-x-2">
        <button
          v-if="selectedPartners.length > 0"
          @click="bulkDelete"
          class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
          <span>Delete {{ selectedPartners.length }}</span>
        </button>
        <button @click="showForm = true" class="btn-primary">
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Add Partner
        </button>
      </div>
    </div>

    <div class="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
      <div v-for="partner in partners" :key="partner.id" class="card text-center group relative">
        <input
          type="checkbox"
          :value="partner.id"
          v-model="selectedPartners"
          class="absolute top-3 left-3 rounded border-gray-300 text-primary focus:ring-primary z-10"
        />
        <div class="h-16 flex items-center justify-center mb-3">
          <img :src="partner.logo" :alt="partner.name" class="max-h-12 object-contain" />
        </div>
        <h4 class="font-medium text-gray-900 text-sm">{{ partner.name }}</h4>
        <p class="text-xs text-gray-400 mt-1">Order: {{ partner.order }}</p>
        <div class="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity flex space-x-1">
          <button @click="editPartner(partner)" class="w-7 h-7 bg-primary-light rounded-lg flex items-center justify-center text-primary text-xs hover:bg-primary hover:text-white transition-colors">
            ✎
          </button>
          <button @click="deletePartner(partner.id)" class="w-7 h-7 bg-red-100 rounded-lg flex items-center justify-center text-red-500 text-xs hover:bg-red-500 hover:text-white transition-colors">
            ✕
          </button>
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
        <h3 class="text-xl font-headline font-semibold text-center mb-2">Delete Partner{{ partnerToDelete ? '' : 's' }}</h3>
        <p class="text-gray-500 text-center mb-6">
          {{ partnerToDelete
            ? 'Are you sure you want to delete this partner? This action cannot be undone.'
            : `Are you sure you want to delete ${selectedPartners.length} partners? This action cannot be undone.`
          }}
        </p>
        <div class="flex justify-end space-x-3">
          <button @click="showDeleteModal = false; partnerToDelete = null" class="btn-secondary">Cancel</button>
          <button @click="confirmDelete" class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">Delete</button>
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
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { useToast } from 'vue-toastification'

const toast = useToast()
const apiUrl = import.meta.env.VITE_API_URL || '/api'
const showForm = ref(false)
const showDeleteModal = ref(false)
const partnerToDelete = ref<string | null>(null)
const editingPartner = ref<any>(null)
const selectedPartners = ref<string[]>([])

const partners = ref<any[]>([])

const loadPartners = async () => {
  try {
    const response = await axios.get(`${apiUrl}/partners`)
    partners.value = response.data
  } catch (error) {
    toast.error('Failed to load partners')
  }
}

const editPartner = (partner: any) => {
  editingPartner.value = { ...partner }
  showForm.value = true
}

const deletePartner = (id: string) => {
  partnerToDelete.value = id
  showDeleteModal.value = true
}

const bulkDelete = () => {
  partnerToDelete.value = null
  showDeleteModal.value = true
}

const confirmDelete = async () => {
  try {
    if (partnerToDelete.value) {
      // Single delete
      await axios.delete(`${apiUrl}/partners/${partnerToDelete.value}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('admin_token')}`
        }
      })
      toast.success('Partner deleted successfully!')
    } else {
      // Bulk delete
      await Promise.all(
        selectedPartners.value.map(id =>
          axios.delete(`${apiUrl}/partners/${id}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('admin_token')}`
            }
          })
        )
      )
      toast.success(`${selectedPartners.value.length} partners deleted successfully!`)
      selectedPartners.value = []
    }
    showDeleteModal.value = false
    partnerToDelete.value = null
    loadPartners()
  } catch (error) {
    toast.error('Failed to delete partner(s)')
  }
}

onMounted(() => {
  loadPartners()
})
</script>
