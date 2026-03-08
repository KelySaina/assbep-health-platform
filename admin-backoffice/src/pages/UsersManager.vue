<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-2xl font-headline font-semibold">{{ $t('admin.users') }}</h2>
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
              <th class="text-left py-3 px-3 text-gray-500 font-medium">Permissions</th>
              <th class="text-right py-3 px-3 text-gray-500 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="user in users" :key="user.id" class="border-b border-gray-50 hover:bg-gray-50">
              <td class="py-3 px-3">
                <div class="flex items-center space-x-3">
                  <div class="w-8 h-8 bg-primary-light rounded-lg flex items-center justify-center text-primary text-xs font-bold">
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
              <td class="py-3 px-3">
                <div class="flex flex-wrap gap-1">
                  <span v-for="perm in user.permissions" :key="perm" class="px-2 py-0.5 text-xs bg-gray-100 text-gray-600 rounded">
                    {{ perm }}
                  </span>
                </div>
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

    <!-- Add User Modal -->
    <div v-if="showForm" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-2xl max-w-md w-full p-6">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-xl font-headline font-semibold">Add User</h3>
          <button @click="showForm = false" class="text-gray-400 hover:text-gray-600">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <form @submit.prevent="showForm = false" class="space-y-4">
          <div>
            <label class="label">Name</label>
            <input type="text" class="input" placeholder="Full name" />
          </div>
          <div>
            <label class="label">Email</label>
            <input type="email" class="input" placeholder="email@example.com" />
          </div>
          <div>
            <label class="label">Password</label>
            <input type="password" class="input" placeholder="••••••••" />
          </div>
          <div>
            <label class="label">Role</label>
            <select class="input">
              <option value="super_admin">Super Admin</option>
              <option value="editor">Editor</option>
              <option value="translator">Translator</option>
            </select>
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

const users = ref([
  { id: 1, name: 'Dr. Jean Kamga', email: 'jean@assbep.org', role: 'super_admin', permissions: ['manage_content', 'edit_translations', 'publish_articles', 'manage_users'] },
  { id: 2, name: 'Marie Dupont', email: 'marie@assbep.org', role: 'editor', permissions: ['manage_content', 'publish_articles'] },
  { id: 3, name: 'Paul Ngassa', email: 'paul@assbep.org', role: 'editor', permissions: ['manage_content', 'publish_articles'] },
  { id: 4, name: 'Sylvie Mbarga', email: 'sylvie@assbep.org', role: 'translator', permissions: ['edit_translations'] },
])

const roleColor = (role: string) => {
  const colors: Record<string, string> = {
    super_admin: 'bg-red-100 text-red-700',
    editor: 'bg-blue-100 text-blue-700',
    translator: 'bg-purple-100 text-purple-700',
  }
  return colors[role] || 'bg-gray-100 text-gray-700'
}
</script>
