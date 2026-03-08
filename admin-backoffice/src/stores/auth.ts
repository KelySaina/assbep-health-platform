import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface AdminUser {
  id: number
  name: string
  email: string
  role: 'super_admin' | 'editor' | 'translator'
  avatar?: string
}

export const useAuthStore = defineStore('auth', () => {
  const user = ref<AdminUser | null>(null)
  const token = ref<string | null>(localStorage.getItem('admin_token'))

  const isAuthenticated = computed(() => !!token.value)

  const login = async (email: string, _password: string) => {
    // Mock login for development
    await new Promise((r) => setTimeout(r, 1000))
    token.value = 'mock-jwt-token-' + Date.now()
    user.value = {
      id: 1,
      name: 'Admin User',
      email,
      role: 'super_admin',
    }
    localStorage.setItem('admin_token', token.value)
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
