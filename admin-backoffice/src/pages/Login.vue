<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary to-primary-dark">
    <div class="w-full max-w-md">
      <div class="text-center mb-8">
        <img src="/logo.jpeg" alt="ASSBEP Logo" class="h-16 w-auto object-contain mx-auto mb-4" />
        <h1 class="text-2xl font-headline font-semibold text-white">ASSBEP Admin</h1>
        <p class="text-blue-200 mt-1 text-sm">Health platform administration</p>
      </div>

      <div class="bg-white rounded-2xl shadow-xl p-8">
        <!-- Login Form -->
        <template v-if="!showForgotPassword">
          <h2 class="text-xl font-headline font-semibold text-gray-900 mb-6">Sign In</h2>

          <div v-if="error" class="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg">
            {{ error }}
          </div>

          <form @submit.prevent="handleLogin" class="space-y-4">
            <div>
              <label class="label">Email</label>
              <input v-model="email" type="email" required class="input" placeholder="admin@assbep.org" />
            </div>
            <div>
              <label class="label">Password</label>
              <input v-model="password" type="password" required class="input" placeholder="••••••••" />
            </div>
            <div class="flex items-center justify-between">
              <label class="flex items-center space-x-2 text-sm">
                <input type="checkbox" v-model="remember" class="rounded border-gray-300 text-primary focus:ring-primary" />
                <span class="text-gray-600">Remember me</span>
              </label>
              <button type="button" @click="showForgotPassword = true" class="text-sm text-primary hover:underline">Forgot password?</button>
            </div>
            <button type="submit" :disabled="isLoading" class="btn-primary w-full py-3">
              {{ isLoading ? 'Signing in...' : 'Sign In' }}
            </button>
          </form>
        </template>

        <!-- Forgot Password Form -->
        <template v-else>
          <h2 class="text-xl font-headline font-semibold text-gray-900 mb-2">Reset Password</h2>
          <p class="text-sm text-gray-500 mb-6">Enter your email and we'll send you a temporary password.</p>

          <div v-if="forgotSuccess" class="mb-4 p-3 bg-green-50 text-green-600 text-sm rounded-lg">
            {{ forgotSuccess }}
          </div>
          <div v-if="forgotError" class="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg">
            {{ forgotError }}
          </div>

          <form @submit.prevent="handleForgotPassword" class="space-y-4">
            <div>
              <label class="label">Email</label>
              <input v-model="forgotEmail" type="email" required class="input" placeholder="admin@assbep.org" />
            </div>
            <button type="submit" :disabled="forgotLoading" class="btn-primary w-full py-3">
              {{ forgotLoading ? 'Sending...' : 'Send Reset Email' }}
            </button>
            <button type="button" @click="showForgotPassword = false" class="w-full text-sm text-gray-500 hover:text-primary">
              ← Back to login
            </button>
          </form>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import axios from 'axios'

const router = useRouter()
const authStore = useAuthStore()
const apiUrl = import.meta.env.VITE_API_URL || '/api'

const email = ref('')
const password = ref('')
const remember = ref(false)
const isLoading = ref(false)
const error = ref('')

const showForgotPassword = ref(false)
const forgotEmail = ref('')
const forgotLoading = ref(false)
const forgotSuccess = ref('')
const forgotError = ref('')

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

const handleForgotPassword = async () => {
  forgotLoading.value = true
  forgotError.value = ''
  forgotSuccess.value = ''
  try {
    await axios.post(`${apiUrl}/auth/forgot-password`, { email: forgotEmail.value })
    forgotSuccess.value = 'If this email exists in our system, a reset link has been sent.'
  } catch {
    forgotSuccess.value = 'If this email exists in our system, a reset link has been sent.'
  } finally {
    forgotLoading.value = false
  }
}
</script>
