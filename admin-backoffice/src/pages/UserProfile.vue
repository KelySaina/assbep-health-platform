<template>
  <div class="max-w-4xl mx-auto space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-2xl font-headline font-semibold">My Profile</h2>
        <p class="text-sm text-gray-500 mt-1">Manage your account settings and team profile</p>
      </div>
    </div>

    <!-- Profile Picture & Basic Info -->
    <div class="card">
      <h3 class="text-lg font-semibold mb-6">Profile Information</h3>

      <div class="flex items-start space-x-8">
        <!-- Profile Picture -->
        <div class="flex-shrink-0">
          <div class="relative group">
            <div class="w-32 h-32 rounded-2xl overflow-hidden bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center text-white text-4xl font-bold shadow-lg">
              <img v-if="profileData.profilePicture" :src="profileData.profilePicture" alt="Profile" class="w-full h-full object-cover" />
              <span v-else>{{ authStore.user?.name?.charAt(0) || 'U' }}</span>
            </div>
            <button @click="showMediaPicker = true" class="absolute inset-0 bg-black/60 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>
          </div>
          <p class="text-xs text-gray-500 mt-2 text-center">Click to change</p>
        </div>

        <!-- Form Fields -->
        <div class="flex-1 space-y-4">
          <div class="grid md:grid-cols-2 gap-4">
            <div>
              <label class="label">Full Name *</label>
              <input v-model="profileData.name" type="text" class="input" required />
            </div>
            <div>
              <label class="label">Email *</label>
              <input v-model="profileData.email" type="email" class="input" required />
            </div>
          </div>

          <div class="grid md:grid-cols-2 gap-4">
            <div>
              <label class="label">Position/Title</label>
              <input v-model="profileData.position" type="text" class="input" placeholder="e.g. Health Program Coordinator" />
            </div>
            <div>
              <label class="label">Role</label>
              <input :value="profileData.role" type="text" class="input" disabled />
            </div>
          </div>

          <div>
            <label class="label">Bio</label>
            <textarea v-model="profileData.bio" rows="3" class="input" placeholder="A brief description about yourself..."></textarea>
            <p class="text-xs text-gray-500 mt-1">This will be displayed on the public team page if you opt-in.</p>
          </div>

          <div>
            <label class="flex items-center space-x-2 cursor-pointer">
              <input v-model="profileData.showInTeam" type="checkbox" class="rounded border-gray-300 text-primary focus:ring-primary" />
              <span class="text-sm text-gray-700">Display my profile on the public team page</span>
            </label>
          </div>
        </div>
      </div>

      <div class="border-t border-gray-200 mt-6 pt-6">
        <h4 class="font-medium text-gray-900 mb-4">Social Links (Optional)</h4>
        <div class="grid md:grid-cols-2 gap-4">
          <div>
            <label class="label">LinkedIn</label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg class="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
              </div>
              <input v-model="profileData.linkedin" type="url" class="input pl-10" placeholder="https://linkedin.com/in/yourprofile" />
            </div>
          </div>
          <div>
            <label class="label">Twitter</label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg class="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"/>
                </svg>
              </div>
              <input v-model="profileData.twitter" type="url" class="input pl-10" placeholder="https://twitter.com/yourhandle" />
            </div>
          </div>
        </div>
      </div>

      <div class="flex justify-end space-x-3 mt-6">
        <button @click="resetProfileForm" class="btn-secondary">Reset</button>
        <button @click="updateProfile" class="btn-primary">Save Profile</button>
      </div>
    </div>

    <!-- Change Password -->
    <div class="card">
      <h3 class="text-lg font-semibold mb-6">Change Password</h3>

      <form @submit.prevent="changePassword" class="space-y-4 max-w-md">
        <div>
          <label class="label">Current Password *</label>
          <div class="relative">
            <input
              v-model="passwordData.currentPassword"
              :type="showCurrentPassword ? 'text' : 'password'"
              class="input pr-10"
              required
              autocomplete="current-password"
            />
            <button type="button" @click="showCurrentPassword = !showCurrentPassword" class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600">
              <svg v-if="!showCurrentPassword" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
              </svg>
            </button>
          </div>
        </div>

        <div>
          <label class="label">New Password *</label>
          <div class="relative">
            <input
              v-model="passwordData.newPassword"
              :type="showNewPassword ? 'text' : 'password'"
              class="input pr-10"
              required
              autocomplete="new-password"
              @input="validatePassword"
            />
            <button type="button" @click="showNewPassword = !showNewPassword" class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600">
              <svg v-if="!showNewPassword" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
              </svg>
            </button>
          </div>

          <!-- Password Strength Indicator -->
          <div class="mt-2 space-y-1">
            <div class="flex items-center space-x-2 text-xs">
              <div class="flex-1 bg-gray-200 rounded-full h-1.5">
                <div
                  :class="[
                    'h-1.5 rounded-full transition-all duration-300',
                    passwordStrength.score === 0 ? 'w-0' : '',
                    passwordStrength.score === 1 ? 'w-1/4 bg-red-500' : '',
                    passwordStrength.score === 2 ? 'w-2/4 bg-orange-500' : '',
                    passwordStrength.score === 3 ? 'w-3/4 bg-yellow-500' : '',
                    passwordStrength.score === 4 ? 'w-full bg-green-500' : '',
                  ]"
                ></div>
              </div>
              <span :class="[
                'font-medium',
                passwordStrength.score === 1 ? 'text-red-500' : '',
                passwordStrength.score === 2 ? 'text-orange-500' : '',
                passwordStrength.score === 3 ? 'text-yellow-600' : '',
                passwordStrength.score === 4 ? 'text-green-600' : '',
              ]">{{ passwordStrength.label }}</span>
            </div>

            <!-- Requirements -->
            <div class="space-y-1">
              <div class="flex items-center space-x-2 text-xs" :class="passwordRequirements.minLength ? 'text-green-600' : 'text-gray-500'">
                <svg class="w-4 h-4" :class="passwordRequirements.minLength ? 'text-green-600' : 'text-gray-400'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="passwordRequirements.minLength ? 'M5 13l4 4L19 7' : 'M6 18L18 6M6 6l12 12'" />
                </svg>
                <span>At least 8 characters</span>
              </div>
              <div class="flex items-center space-x-2 text-xs" :class="passwordRequirements.hasUpperCase ? 'text-green-600' : 'text-gray-500'">
                <svg class="w-4 h-4" :class="passwordRequirements.hasUpperCase ? 'text-green-600' : 'text-gray-400'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="passwordRequirements.hasUpperCase ? 'M5 13l4 4L19 7' : 'M6 18L18 6M6 6l12 12'" />
                </svg>
                <span>One uppercase letter</span>
              </div>
              <div class="flex items-center space-x-2 text-xs" :class="passwordRequirements.hasNumber ? 'text-green-600' : 'text-gray-500'">
                <svg class="w-4 h-4" :class="passwordRequirements.hasNumber ? 'text-green-600' : 'text-gray-400'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="passwordRequirements.hasNumber ? 'M5 13l4 4L19 7' : 'M6 18L18 6M6 6l12 12'" />
                </svg>
                <span>One number</span>
              </div>
              <div class="flex items-center space-x-2 text-xs" :class="passwordRequirements.hasSpecial ? 'text-green-600' : 'text-gray-500'">
                <svg class="w-4 h-4" :class="passwordRequirements.hasSpecial ? 'text-green-600' : 'text-gray-400'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="passwordRequirements.hasSpecial ? 'M5 13l4 4L19 7' : 'M6 18L18 6M6 6l12 12'" />
                </svg>
                <span>One special character (@$!%*?&)</span>
              </div>
            </div>
          </div>
        </div>

        <div>
          <label class="label">Confirm New Password *</label>
          <input
            v-model="passwordData.confirmPassword"
            :type="showNewPassword ? 'text' : 'password'"
            class="input"
            required
            autocomplete="new-password"
          />
          <p v-if="passwordData.confirmPassword && passwordData.newPassword !== passwordData.confirmPassword" class="text-xs text-red-500 mt-1">
            Passwords do not match
          </p>
        </div>

        <div class="flex justify-end space-x-3 pt-2">
          <button type="button" @click="resetPasswordForm" class="btn-secondary">Cancel</button>
          <button type="submit" class="btn-primary" :disabled="!isPasswordValid">
            Update Password
          </button>
        </div>
      </form>
    </div>

    <!-- Media Picker Modal -->
    <div v-if="showMediaPicker" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div class="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 class="text-xl font-headline font-semibold">Choose Profile Picture</h3>
          <button @click="showMediaPicker = false" class="text-gray-400 hover:text-gray-600">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div class="p-6 flex-1 overflow-y-auto">
          <!-- Upload Tab -->
          <div class="mb-6">
            <label class="block w-full cursor-pointer">
              <input type="file" @change="uploadNewImage" accept="image/*" class="hidden" />
              <div class="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-primary hover:bg-primary-light/30 transition-colors">
                <svg class="w-12 h-12 mx-auto text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <p class="text-sm text-gray-600 font-medium">Click to upload new image</p>
                <p class="text-xs text-gray-500 mt-1">PNG, JPG up to 5MB</p>
              </div>
            </label>
          </div>

          <!-- Media Library Grid -->
          <div>
            <h4 class="font-medium mb-3">Or choose from media library:</h4>
            <div v-if="loadingMedia" class="text-center py-8 text-gray-500">
              Loading media...
            </div>
            <div v-else-if="mediaLibrary.length === 0" class="text-center py-8 text-gray-500">
              No images in media library yet
            </div>
            <div v-else class="grid grid-cols-4 gap-4">
              <button
                v-for="media in mediaLibrary.filter(m => m.type === 'image')"
                :key="media.id"
                @click="selectMediaImage(media.url)"
                class="aspect-square rounded-lg overflow-hidden border-2 hover:border-primary transition-colors"
                :class="profileData.profilePicture === media.url ? 'border-primary ring-2 ring-primary' : 'border-gray-200'"
              >
                <img :src="media.url" :alt="media.altText || 'Media'" class="w-full h-full object-cover" />
              </button>
            </div>
          </div>
        </div>

        <div class="p-6 border-t border-gray-200 flex justify-end space-x-3">
          <button @click="showMediaPicker = false" class="btn-secondary">Cancel</button>
          <button @click="showMediaPicker = false" class="btn-primary">Done</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useToast } from 'vue-toastification'
import axios from 'axios'

const authStore = useAuthStore()
const toast = useToast()
const apiUrl = import.meta.env.VITE_API_URL || '/api'

const showMediaPicker = ref(false)
const loadingMedia = ref(false)
const mediaLibrary = ref<any[]>([])
const currentUserId = ref('')

const showCurrentPassword = ref(false)
const showNewPassword = ref(false)

const profileData = reactive({
  name: '',
  email: '',
  position: '',
  bio: '',
  profilePicture: '',
  role: '',
  showInTeam: false,
  linkedin: '',
  twitter: ''
})

const passwordData = reactive({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const passwordRequirements = reactive({
  minLength: false,
  hasUpperCase: false,
  hasNumber: false,
  hasSpecial: false
})

const passwordStrength = ref({ score: 0, label: '' })

const isPasswordValid = computed(() => {
  return passwordRequirements.minLength &&
    passwordRequirements.hasUpperCase &&
    passwordRequirements.hasNumber &&
    passwordRequirements.hasSpecial &&
    passwordData.newPassword === passwordData.confirmPassword &&
    passwordData.currentPassword.length > 0
})

const validatePassword = () => {
  const pwd = passwordData.newPassword

  passwordRequirements.minLength = pwd.length >= 8
  passwordRequirements.hasUpperCase = /[A-Z]/.test(pwd)
  passwordRequirements.hasNumber = /[0-9]/.test(pwd)
  passwordRequirements.hasSpecial = /[@$!%*?&]/.test(pwd)

  const score = [
    passwordRequirements.minLength,
    passwordRequirements.hasUpperCase,
    passwordRequirements.hasNumber,
    passwordRequirements.hasSpecial
  ].filter(Boolean).length

  const labels = ['', 'Weak', 'Fair', 'Good', 'Strong']
  passwordStrength.value = { score, label: labels[score] || '' }
}

const loadCurrentUser = async () => {
  try {
    const token = localStorage.getItem('admin_token')
    const response = await axios.get(`${apiUrl}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` }
    })

    const user = response.data
    currentUserId.value = user.id || ''
    authStore.setCurrentUser(user)
    profileData.name = user.name || ''
    profileData.email = user.email || ''
    profileData.position = user.position || ''
    profileData.bio = user.bio || ''
    profileData.profilePicture = user.profilePicture || ''
    profileData.role = user.role || ''
    profileData.showInTeam = user.showInTeam || false
    profileData.linkedin = user.linkedin || ''
    profileData.twitter = user.twitter || ''
  } catch (error) {
    toast.error('Failed to load profile')
  }
}

const loadMediaLibrary = async () => {
  loadingMedia.value = true
  try {
    const token = localStorage.getItem('admin_token')
    const response = await axios.get(`${apiUrl}/media`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    mediaLibrary.value = response.data
  } catch (error) {
    console.error('Failed to load media:', error)
  } finally {
    loadingMedia.value = false
  }
}

const uploadNewImage = async (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (!file) return

  if (file.size > 5 * 1024 * 1024) {
    toast.error('File size must be less than 5MB')
    return
  }

  const formData = new FormData()
  formData.append('file', file)
  formData.append('type', 'image')
  formData.append('alt_text', `Profile picture for ${profileData.name}`)

  try {
    const token = localStorage.getItem('admin_token')
    const response = await axios.post(`${apiUrl}/media/upload`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data'
      }
    })

    profileData.profilePicture = response.data.url
    toast.success('Image uploaded successfully!')
    loadMediaLibrary() // Reload media library
  } catch (error: any) {
    toast.error(error.response?.data?.message || 'Failed to upload image')
  }
}

const selectMediaImage = (url: string) => {
  profileData.profilePicture = url
}

const updateProfile = async () => {
  try {
    const token = localStorage.getItem('admin_token')
    const userId = currentUserId.value || authStore.user?.id

    if (!userId) {
      toast.error('Unable to determine the current user. Please refresh the page.')
      return
    }

    await axios.put(`${apiUrl}/users/${userId}`, {
      name: profileData.name,
      email: profileData.email,
      position: profileData.position,
      bio: profileData.bio,
      profilePicture: profileData.profilePicture,
      showInTeam: profileData.showInTeam,
      linkedin: profileData.linkedin,
      twitter: profileData.twitter
    }, {
      headers: { Authorization: `Bearer ${token}` }
    })

    authStore.updateProfile({
      name: profileData.name,
      email: profileData.email,
      profilePicture: profileData.profilePicture,
      position: profileData.position,
      bio: profileData.bio,
      showInTeam: profileData.showInTeam,
      linkedin: profileData.linkedin,
      twitter: profileData.twitter
    })

    toast.success('Profile updated successfully!')
  } catch (error: any) {
    toast.error(error.response?.data?.message || 'Failed to update profile')
  }
}

const changePassword = async () => {
  if (!isPasswordValid.value) {
    toast.error('Please meet all password requirements')
    return
  }

  try {
    const token = localStorage.getItem('admin_token')
    await axios.post(`${apiUrl}/auth/change-password`, {
      currentPassword: passwordData.currentPassword,
      newPassword: passwordData.newPassword
    }, {
      headers: { Authorization: `Bearer ${token}` }
    })

    toast.success('Password changed successfully!')
    resetPasswordForm()
  } catch (error: any) {
    toast.error(error.response?.data?.message || 'Failed to change password')
  }
}

const resetProfileForm = () => {
  loadCurrentUser()
}

const resetPasswordForm = () => {
  passwordData.currentPassword = ''
  passwordData.newPassword = ''
  passwordData.confirmPassword = ''
  passwordRequirements.minLength = false
  passwordRequirements.hasUpperCase = false
  passwordRequirements.hasNumber = false
  passwordRequirements.hasSpecial = false
  passwordStrength.value = { score: 0, label: '' }
}

onMounted(() => {
  loadCurrentUser()
  loadMediaLibrary()
})
</script>
