<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary to-primary-dark">
    <div class="w-full max-w-md">
      <div class="text-center mb-8">
        <div class="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <svg class="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </div>
        <h1 class="text-2xl font-headline font-semibold text-white">ASSBEP Admin</h1>
        <p class="text-blue-200 mt-1 text-sm">{{ $t('auth.subtitle') }}</p>
      </div>

      <div class="bg-white rounded-2xl shadow-xl p-8">
        <h2 class="text-xl font-headline font-semibold text-gray-900 mb-6">{{ $t('auth.login') }}</h2>

        <div v-if="error" class="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg">
          {{ error }}
        </div>

        <form @submit.prevent="handleLogin" class="space-y-4">
          <div>
            <label class="label">{{ $t('auth.email') }}</label>
            <input v-model="email" type="email" required class="input" placeholder="admin@assbep.org" />
          </div>
          <div>
            <label class="label">{{ $t('auth.password') }}</label>
            <input v-model="password" type="password" required class="input" placeholder="••••••••" />
          </div>
          <div class="flex items-center justify-between">
            <label class="flex items-center space-x-2 text-sm">
              <input type="checkbox" v-model="remember" class="rounded border-gray-300 text-primary focus:ring-primary" />
              <span class="text-gray-600">{{ $t('auth.remember') }}</span>
            </label>
            <a href="#" class="text-sm text-primary hover:underline">{{ $t('auth.forgot') }}</a>
          </div>
          <button type="submit" :disabled="isLoading" class="btn-primary w-full py-3">
            {{ isLoading ? 'Signing in...' : $t('auth.login') }}
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const email = ref('')
const password = ref('')
const remember = ref(false)
const isLoading = ref(false)
const error = ref('')

const handleLogin = async () => {
  isLoading.value = true
  error.value = ''
  try {
    await authStore.login(email.value, password.value)
    router.push({ name: 'Dashboard' })
  } catch {
    error.value = 'Invalid email or password.'
  } finally {
    isLoading.value = false
  }
}
</script>
