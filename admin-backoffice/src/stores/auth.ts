import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import axios from 'axios'

export interface AdminUser {
  id: string
  name: string
  email: string
  role: 'super_admin' | 'editor' | 'translator'
  avatar?: string
  profilePicture?: string
  position?: string
  bio?: string
  showInTeam?: boolean
  linkedin?: string
  twitter?: string
}

const apiUrl = import.meta.env.VITE_API_URL || '/api'

const normalizeRole = (role: string): AdminUser['role'] => {
  return role.toLowerCase() as AdminUser['role']
}

const mapApiUser = (user: {
  id: string
  name: string
  email: string
  role: string
  profilePicture?: string | null
  position?: string | null
  bio?: string | null
  showInTeam?: boolean | null
  linkedin?: string | null
  twitter?: string | null
}): AdminUser => ({
  id: user.id,
  name: user.name,
  email: user.email,
  role: normalizeRole(user.role),
  profilePicture: user.profilePicture || undefined,
  position: user.position || undefined,
  bio: user.bio || undefined,
  showInTeam: user.showInTeam ?? undefined,
  linkedin: user.linkedin || undefined,
  twitter: user.twitter || undefined,
})

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
      user.value = mapApiUser(response.data.user)
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

  const updateProfile = (profile: Partial<Omit<AdminUser, 'id' | 'role'>>) => {
    if (!user.value) return

    user.value = {
      ...user.value,
      ...profile,
    }
  }

  const setCurrentUser = (currentUser: {
    id: string
    name: string
    email: string
    role: string
    profilePicture?: string | null
    position?: string | null
    bio?: string | null
    showInTeam?: boolean | null
    linkedin?: string | null
    twitter?: string | null
  }) => {
    user.value = mapApiUser(currentUser)
  }

  const fetchCurrentUser = async () => {
    if (!token.value) return null

    try {
      const response = await axios.get(`${apiUrl}/auth/me`, {
        headers: { Authorization: `Bearer ${token.value}` },
      })
      setCurrentUser(response.data)
      return user.value
    } catch (error) {
      logout()
      throw error
    }
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

  return { user, token, isAuthenticated, login, logout, updateProfile, setCurrentUser, fetchCurrentUser, hasPermission }
})
