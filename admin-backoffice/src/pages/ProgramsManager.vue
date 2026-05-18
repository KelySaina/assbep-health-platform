<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-2xl font-headline font-semibold">Programs</h2>
        <p class="text-sm text-gray-500 mt-1">Manage health programs and services</p>
      </div>
      <button @click="openCreateForm" class="btn-primary">
        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
        New Program
      </button>
    </div>

    <!-- Programs Table -->
    <div class="card">
      <div class="flex items-center justify-between mb-4">
        <input type="text" v-model="searchQuery" placeholder="Search programs..." class="input max-w-xs" />
        <button
          v-if="selectedPrograms.length > 0"
          @click="bulkDelete"
          class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
          <span>Delete {{ selectedPrograms.length }} item{{ selectedPrograms.length > 1 ? 's' : '' }}</span>
        </button>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead>
            <tr class="border-b border-gray-100">
              <th class="text-left py-3 px-3 text-gray-500 font-medium w-8">
                <input
                  type="checkbox"
                  :checked="selectedPrograms.length === filteredPrograms.length && filteredPrograms.length > 0"
                  @change="toggleSelectAll"
                  class="rounded border-gray-300 text-primary focus:ring-primary"
                />
              </th>
              <th class="text-left py-3 px-3 text-gray-500 font-medium">Title</th>
              <th class="text-left py-3 px-3 text-gray-500 font-medium">Category</th>
              <th class="text-left py-3 px-3 text-gray-500 font-medium">Order</th>
              <th class="text-left py-3 px-3 text-gray-500 font-medium">Status</th>
              <th class="text-right py-3 px-3 text-gray-500 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="program in filteredPrograms" :key="program.id" class="border-b border-gray-50 hover:bg-gray-50">
              <td class="py-3 px-3">
                <input
                  type="checkbox"
                  :value="program.id"
                  v-model="selectedPrograms"
                  class="rounded border-gray-300 text-primary focus:ring-primary"
                />
              </td>
              <td class="py-3 px-3">
                <div class="flex items-center space-x-3">
                  <img :src="program.image" :alt="program.title" class="w-10 h-10 rounded-lg object-cover" />
                  <div>
                    <span class="font-medium text-gray-900 block">{{ program.title }}</span>
                  </div>
                </div>
              </td>
              <td class="py-3 px-3">
                <span class="px-2 py-1 text-xs bg-primary-light text-primary rounded-full">{{ program.category }}</span>
              </td>
              <td class="py-3 px-3 text-gray-500">{{ program.order }}</td>
              <td class="py-3 px-3">
                <span :class="program.published ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'"
                  class="px-2 py-1 text-xs rounded-full">
                  {{ program.published ? 'Published' : 'Draft' }}
                </span>
              </td>
              <td class="py-3 px-3 text-right">
                <button @click="editProgram(program)" class="text-primary hover:underline text-xs mr-3">Edit</button>
                <button @click="deleteProgram(program.id)" class="text-red-500 hover:underline text-xs">Delete</button>
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
        <h3 class="text-xl font-headline font-semibold text-center mb-2">Delete Program{{ programToDelete ? '' : 's' }}</h3>
        <p class="text-gray-500 text-center mb-6">
          {{ programToDelete
            ? 'Are you sure you want to delete this program? This action cannot be undone.'
            : `Are you sure you want to delete ${selectedPrograms.length} programs? This action cannot be undone.`
          }}
        </p>
        <div class="flex justify-end space-x-3">
          <button @click="showDeleteModal = false; programToDelete = null" class="btn-secondary">Cancel</button>
          <button @click="confirmDelete" class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">Delete</button>
        </div>
      </div>
    </div>

    <!-- Create/Edit Modal -->
    <div v-if="showForm" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-xl font-headline font-semibold">{{ editingProgram ? 'Edit Program' : 'New Program' }}</h3>
          <button @click="closeForm" class="text-gray-400 hover:text-gray-600">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <form @submit.prevent="saveProgram" class="space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="label">Title</label>
              <input type="text" class="input" placeholder="Program title" v-model="formData.title" required />
            </div>
            <div>
              <label class="label">Category</label>
              <select class="input" v-model="formData.category">
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
            <textarea class="input" rows="3" placeholder="Short program description..." v-model="formData.description"></textarea>
          </div>
          <div>
            <div class="flex items-center justify-between mb-1">
              <label class="label mb-0">Content</label>
              <button type="button" @click="showImageInserter = true" class="text-xs btn-secondary px-2 py-1">
                <svg class="w-3 h-3 mr-1 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Insert Image
              </button>
            </div>
            <textarea class="input font-mono text-sm" rows="6" placeholder="Detailed content (HTML supported). Use Insert Image to add photos..." v-model="formData.content"></textarea>
            <p class="text-xs text-gray-400 mt-1">Supports HTML. Insert multiple images for a richer page.</p>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="label">Image</label>
              <MediaPicker v-model="formData.image" placeholder="Image URL or browse media" />
            </div>
            <div>
              <label class="label">Order</label>
              <input type="number" class="input" v-model="formData.order" />
            </div>
          </div>
          <div class="flex items-center space-x-2">
            <input type="checkbox" id="published" class="rounded border-gray-300 text-primary" v-model="formData.published" />
            <label for="published" class="text-sm text-gray-700">Published</label>
          </div>
          <div class="flex justify-end space-x-3 pt-4">
            <button type="button" @click="closeForm" class="btn-secondary">Cancel</button>
            <button type="submit" class="btn-primary">{{ editingProgram ? 'Update' : 'Save' }}</button>
          </div>
        </form>
      </div>
    </div>

    <!-- Insert Image into Content Modal -->
    <div v-if="showImageInserter" class="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4">
      <div class="bg-white rounded-2xl max-w-3xl w-full max-h-[80vh] overflow-hidden flex flex-col">
        <div class="flex items-center justify-between p-5 border-b">
          <h3 class="text-lg font-headline font-semibold">Insert Images into Content</h3>
          <div class="flex items-center gap-3">
            <span class="text-sm text-gray-500">Click images to insert, then close</span>
            <button @click="showImageInserter = false" class="btn-primary text-sm px-4 py-2">Done</button>
          </div>
        </div>
        <div class="p-5 flex-1 overflow-y-auto">
          <div v-if="mediaLoading" class="text-center py-8 text-gray-500">Loading media...</div>
          <div v-else-if="mediaItems.length === 0" class="text-center py-8 text-gray-500">No media files found.</div>
          <div v-else class="grid grid-cols-3 md:grid-cols-4 gap-3">
            <button
              v-for="item in mediaItems"
              :key="item.id"
              type="button"
              @click="insertImageToContent(item.url)"
              class="aspect-square rounded-xl border-2 border-gray-200 overflow-hidden hover:border-primary transition-colors"
            >
              <img v-if="item.type === 'image' || item.type === 'logo'" :src="item.url" :alt="item.altText" class="w-full h-full object-cover" />
              <div v-else class="w-full h-full flex items-center justify-center bg-gray-50 text-xs text-gray-400">
                {{ item.type }}
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import axios from 'axios'
import { useToast } from 'vue-toastification'
import MediaPicker from '@/components/MediaPicker.vue'

const toast = useToast()
const apiUrl = import.meta.env.VITE_API_URL || '/api'
const showForm = ref(false)
const searchQuery = ref('')
const editingProgram = ref<any>(null)
const showDeleteModal = ref(false)
const programToDelete = ref<string | null>(null)
const selectedPrograms = ref<string[]>([])
const showImageInserter = ref(false)
const mediaLoading = ref(false)
const mediaItems = ref<any[]>([])
const formData = ref({
  title: '',
  description: '',
  content: '',
  category: 'maternal',
  image: '',
  order: 1,
  published: false
})

const programs = ref<any[]>([])

const loadPrograms = async () => {
  try {
    const response = await axios.get(`${apiUrl}/programs/admin`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('admin_token')}`
      }
    })
    programs.value = response.data
  } catch (error) {
    toast.error('Failed to load programs')
  }
}

const openCreateForm = () => {
  editingProgram.value = null
  formData.value = { title: '', description: '', content: '', category: 'maternal', image: '', order: 1, published: false }
  showForm.value = true
}

const closeForm = () => {
  showForm.value = false
  editingProgram.value = null
  formData.value = { title: '', description: '', content: '', category: 'maternal', image: '', order: 1, published: false }
}

const editProgram = (program: any) => {
  editingProgram.value = program
  formData.value = {
    title: program.title || '',
    description: program.description || '',
    content: program.content || '',
    category: program.category || 'maternal',
    image: program.image || '',
    order: program.order || 1,
    published: program.published || false
  }
  showForm.value = true
}

const saveProgram = async () => {
  try {
    const headers = { Authorization: `Bearer ${localStorage.getItem('admin_token')}` }
    if (editingProgram.value) {
      await axios.put(`${apiUrl}/programs/${editingProgram.value.id}`, formData.value, { headers })
      toast.success('Program updated successfully!')
    } else {
      await axios.post(`${apiUrl}/programs`, formData.value, { headers })
      toast.success('Program created successfully!')
    }
    closeForm()
    loadPrograms()
  } catch (error) {
    toast.error('Failed to save program')
  }
}

const toggleSelectAll = () => {
  if (selectedPrograms.value.length === filteredPrograms.value.length) {
    selectedPrograms.value = []
  } else {
    selectedPrograms.value = filteredPrograms.value.map(p => p.id)
  }
}

const deleteProgram = (id: string) => {
  programToDelete.value = id
  showDeleteModal.value = true
}

const bulkDelete = () => {
  programToDelete.value = null
  showDeleteModal.value = true
}

const confirmDelete = async () => {
  try {
    if (programToDelete.value) {
      // Single delete
      await axios.delete(`${apiUrl}/programs/${programToDelete.value}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('admin_token')}`
        }
      })
      toast.success('Program deleted successfully!')
    } else {
      // Bulk delete
      await Promise.all(
        selectedPrograms.value.map(id =>
          axios.delete(`${apiUrl}/programs/${id}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('admin_token')}`
            }
          })
        )
      )
      toast.success(`${selectedPrograms.value.length} programs deleted successfully!`)
      selectedPrograms.value = []
    }
    showDeleteModal.value = false
    programToDelete.value = null
    loadPrograms()
  } catch (error) {
    toast.error('Failed to delete program(s)')
  }
}

const filteredPrograms = computed(() => {
  return programs.value.filter((p) => {
    const title = p.title || ''
    return title.toLowerCase().includes(searchQuery.value.toLowerCase())
  })
})

onMounted(() => {
  loadPrograms()
})

const loadMedia = async () => {
  mediaLoading.value = true
  try {
    const response = await axios.get(`${apiUrl}/media`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('admin_token')}` }
    })
    mediaItems.value = response.data
  } catch { mediaItems.value = [] }
  finally { mediaLoading.value = false }
}

const insertImageToContent = (url: string) => {
  const imgTag = `<img src="${url}" alt="" style="width:100%;border-radius:12px;margin:16px 0" />`
  formData.value.content += `\n${imgTag}\n`
  toast.success('Image inserted — select more or close')
}

watch(showImageInserter, (val) => {
  if (val && mediaItems.value.length === 0) loadMedia()
})
</script>
