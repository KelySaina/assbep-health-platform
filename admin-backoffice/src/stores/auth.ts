import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import axios from 'axios'

export interface AdminUser {
  id: number
  name: string
  email: string
  role: 'super_admin' | 'editor' | 'translator'
  avatar?: string
}

const apiUrl = import.meta.env.VITE_API_URL || '/api'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<AdminUser | null>(null)
  const token = ref<string | null>(localStorage.getItem('admin_token'))

  const isAuthenticated = computed(() => !!token.value)

  const login = async (email: string, password: string) => {
    try {
      // Clear any old tokens first
      localStorage.removeItem('admin_token')

      const response = await axios.post(`${apiUrl}/auth/login`, {
        email,
        password,
      })

      console.log('Login response:', response.data)

      token.value = response.data.access_token
      user.value = {
        id: response.data.user.id,
        name: response.data.user.name,
        email: response.data.user.email,
        role: response.data.user.role.toLowerCase().replace('_', '_') as 'super_admin' | 'editor' | 'translator',
      }
      if (token.value) {
        localStorage.setItem('admin_token', token.value)
        console.log('Token saved:', token.value)
      }
    } catch (error) {
      console.error('Login failed:', error)
      throw error
    }
  }

  const logout = () => {
    token.value = null
    user.value = null
    localStorage.removeItem('admin_token')
  }

  const hasPermission = (permission: string) => {
    if (!user.value) return false
    const permissions: Record<string, string[]> = {
      super_admin: ['manage_content', 'edit_translations', 'publish_articles', 'manage_users'],
      editor: ['manage_content', 'publish_articles'],
      translator: ['edit_translations'],
    }
    return permissions[user.value.role]?.includes(permission) ?? false
  }

  return { user, token, isAuthenticated, login, logout, hasPermission }
})
