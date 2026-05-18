<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-2xl font-headline font-semibold">Users</h2>
        <p class="text-sm text-gray-500 mt-1">Manage admin users and their roles</p>
      </div>
      <button @click="showForm = true" class="btn-primary">
        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
        Add User
      </button>
    </div>

    <div class="card">
      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead>
            <tr class="border-b border-gray-100">
              <th class="text-left py-3 px-3 text-gray-500 font-medium">User</th>
              <th class="text-left py-3 px-3 text-gray-500 font-medium">Email</th>
              <th class="text-left py-3 px-3 text-gray-500 font-medium">Role</th>
              <th class="text-left py-3 px-3 text-gray-500 font-medium">Position</th>
              <th class="text-center py-3 px-3 text-gray-500 font-medium">Show on Website</th>
              <th class="text-right py-3 px-3 text-gray-500 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="user in users" :key="user.id" class="border-b border-gray-50 hover:bg-gray-50">
              <td class="py-3 px-3">
                <div class="flex items-center space-x-3">
                  <div v-if="user.profilePicture" class="w-8 h-8 rounded-lg overflow-hidden flex-shrink-0">
                    <img :src="user.profilePicture" :alt="user.name" class="w-full h-full object-cover" />
                  </div>
                  <div v-else class="w-8 h-8 bg-primary-light rounded-lg flex items-center justify-center text-primary text-xs font-bold flex-shrink-0">
                    {{ user.name.charAt(0) }}
                  </div>
                  <span class="font-medium text-gray-900">{{ user.name }}</span>
                </div>
              </td>
              <td class="py-3 px-3 text-gray-500">{{ user.email }}</td>
              <td class="py-3 px-3">
                <span :class="roleColor(user.role)" class="px-2 py-1 text-xs rounded-full">
                  {{ user.role.replace('_', ' ') }}
                </span>
              </td>
              <td class="py-3 px-3 text-gray-600 text-sm">
                {{ user.position || '-' }}
              </td>
              <td class="py-3 px-3 text-center">
                <button @click="toggleShowInTeam(user)" class="focus:outline-none" :title="user.showInTeam ? 'Visible on website' : 'Hidden from website'">
                  <span v-if="user.showInTeam" class="inline-flex items-center justify-center w-8 h-8 bg-green-100 rounded-full hover:bg-green-200 transition-colors">
                    <svg class="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </span>
                  <span v-else class="inline-flex items-center justify-center w-8 h-8 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors">
                    <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </span>
                </button>
              </td>
              <td class="py-3 px-3 text-right">
                <button @click="editUser(user)" class="text-primary hover:underline text-xs mr-3">Edit</button>
                <button @click="deleteUser(user.id)" class="text-red-500 hover:underline text-xs">Delete</button>
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
        <h3 class="text-xl font-headline font-semibold text-center mb-2">Delete User</h3>
        <p class="text-gray-500 text-center mb-6">Are you sure you want to delete this user? This action cannot be undone.</p>
        <div class="flex justify-end space-x-3">
          <button @click="showDeleteModal = false; userToDelete = null" class="btn-secondary">Cancel</button>
          <button @click="confirmDelete" class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">Delete</button>
        </div>
      </div>
    </div>

    <!-- Add/Edit User Modal -->
    <div v-if="showForm" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-2xl max-w-md w-full p-6">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-xl font-headline font-semibold">{{ editingUser ? 'Edit User' : 'Add User' }}</h3>
          <button @click="showForm = false" class="text-gray-400 hover:text-gray-600">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <form @submit.prevent="saveUser" class="space-y-4">
          <div>
            <label class="label">Name</label>
            <input v-model="formData.name" type="text" class="input" placeholder="Full name" required />
          </div>
          <div>
            <label class="label">Email</label>
            <input v-model="formData.email" type="email" class="input" placeholder="email@example.com" required />
          </div>
          <div v-if="!editingUser">
            <label class="label">Password</label>
            <input v-model="formData.password" type="password" class="input" placeholder="••••••••" required />
          </div>
          <div>
            <label class="label">Role</label>
            <select v-model="formData.role" class="input">
              <option value="SUPER_ADMIN">Super Admin</option>
              <option value="EDITOR">Editor</option>
            </select>
          </div>
          <div class="flex justify-end space-x-3 pt-4">
            <button type="button" @click="closeForm" class="btn-secondary">Cancel</button>
            <button type="submit" class="btn-primary">Save</button>
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
const userToDelete = ref<string | null>(null)
const editingUser = ref<any>(null)

const formData = ref({
  name: '',
  email: '',
  password: '',
  role: 'EDITOR'
})

const users = ref<any[]>([])

const loadUsers = async () => {
  try {
    const response = await axios.get(`${apiUrl}/users`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('admin_token')}`
      }
    })
    users.value = response.data
  } catch (error) {
    console.error('Error loading users:', error)
    toast.error('Failed to load users')
  }
}

const roleColor = (role: string) => {
  const colors: Record<string, string> = {
    super_admin: 'bg-red-100 text-red-700',
    SUPER_ADMIN: 'bg-red-100 text-red-700',
    editor: 'bg-blue-100 text-blue-700',
    EDITOR: 'bg-blue-100 text-blue-700',
    translator: 'bg-purple-100 text-purple-700',
    TRANSLATOR: 'bg-purple-100 text-purple-700',
  }
  return colors[role] || 'bg-gray-100 text-gray-700'
}

const editUser = (user: any) => {
  editingUser.value = user
  formData.value = {
    name: user.name,
    email: user.email,
    password: '',
    role: user.role
  }
  showForm.value = true
}

const deleteUser = (id: string) => {
  userToDelete.value = id
  showDeleteModal.value = true
}

const confirmDelete = async () => {
  try {
    await axios.delete(`${apiUrl}/users/${userToDelete.value}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('admin_token')}`
      }
    })
    toast.success('User deleted successfully!')
    showDeleteModal.value = false
    userToDelete.value = null
    loadUsers()
  } catch (error) {
    toast.error('Failed to delete user')
  }
}

const saveUser = async () => {
  try {
    if (editingUser.value) {
      // Update existing user
      const updateData: any = {
        name: formData.value.name,
        email: formData.value.email,
        role: formData.value.role
      }
      if (formData.value.password) {
        updateData.password = formData.value.password
      }
      await axios.put(`${apiUrl}/users/${editingUser.value.id}`, updateData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('admin_token')}`
        }
      })
      toast.success('User updated successfully!')
    } else {
      // Create new user
      await axios.post(`${apiUrl}/users`, formData.value, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('admin_token')}`
        }
      })
      toast.success('User created successfully!')
    }
    closeForm()
    loadUsers()
  } catch (error: any) {
    toast.error(error.response?.data?.message || 'Failed to save user')
  }
}

const closeForm = () => {
  showForm.value = false
  editingUser.value = null
  formData.value = {
    name: '',
    email: '',
    password: '',
    role: 'EDITOR'
  }
}

const toggleShowInTeam = async (user: any) => {
  try {
    const newValue = !user.showInTeam
    await axios.put(`${apiUrl}/users/${user.id}`, { showInTeam: newValue }, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('admin_token')}`
      }
    })
    user.showInTeam = newValue
    toast.success(newValue ? 'User will be shown on the website' : 'User hidden from website')
  } catch (error) {
    toast.error('Failed to update visibility')
  }
}

onMounted(() => {
  loadUsers()
})
</script>
