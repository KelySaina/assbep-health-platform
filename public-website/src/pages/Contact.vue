<template>
  <div>
    <!-- Page Header -->
    <section class="bg-gradient-to-br from-primary to-primary-dark py-16 md:py-24">
      <div class="container-narrow text-center text-white">
        <h1 class="text-4xl md:text-5xl font-headline font-semibold mb-4">{{ $t('contact.title') }}</h1>
        <p class="text-lg text-blue-100 max-w-2xl mx-auto">{{ $t('contact.subtitle') }}</p>
      </div>
    </section>

    <section class="py-16">
      <div class="container-narrow">
        <div class="grid md:grid-cols-3 gap-12">
          <!-- Contact Form -->
          <div class="md:col-span-2">
            <div class="card">
              <h2 class="text-2xl font-headline font-semibold mb-6">Send us a message</h2>

              <!-- Success/Error Messages -->
              <div v-if="submitStatus === 'success'" class="mb-6 p-4 bg-green-50 text-green-700 rounded-xl text-sm">
                {{ $t('contact.form.success') }}
              </div>
              <div v-if="submitStatus === 'error'" class="mb-6 p-4 bg-red-50 text-red-700 rounded-xl text-sm">
                {{ $t('contact.form.error') }}
              </div>

              <form @submit.prevent="handleSubmit" class="space-y-5">
                <div class="grid md:grid-cols-2 gap-5">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1.5">{{ $t('contact.form.name') }}</label>
                    <input
                      v-model="form.name"
                      type="text"
                      required
                      class="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1.5">{{ $t('contact.form.email') }}</label>
                    <input
                      v-model="form.email"
                      type="email"
                      required
                      class="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1.5">{{ $t('contact.form.subject') }}</label>
                  <input
                    v-model="form.subject"
                    type="text"
                    required
                    class="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                    placeholder="How can we help?"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1.5">{{ $t('contact.form.message') }}</label>
                  <textarea
                    v-model="form.message"
                    required
                    rows="5"
                    class="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors resize-none"
                    placeholder="Tell us more..."
                  ></textarea>
                </div>
                <button
                  type="submit"
                  :disabled="isSubmitting"
                  class="btn-primary w-full md:w-auto"
                >
                  {{ isSubmitting ? $t('contact.form.sending') : $t('contact.form.send') }}
                </button>
              </form>
            </div>
          </div>

          <!-- Contact Info Sidebar -->
          <div class="space-y-6">
            <div class="card">
              <h3 class="font-headline font-semibold text-lg mb-4">{{ $t('contact.info.address') }}</h3>
              <div class="space-y-4 text-sm">
                <div class="flex items-start space-x-3">
                  <svg class="w-5 h-5 text-primary mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span class="text-neutral">{{ contactInfo.address }}</span>
                </div>
                <div class="flex items-center space-x-3">
                  <svg class="w-5 h-5 text-primary flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <span class="text-neutral">{{ contactInfo.phone }}</span>
                </div>
                <div class="flex items-center space-x-3">
                  <svg class="w-5 h-5 text-primary flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span class="text-neutral">{{ contactInfo.email }}</span>
                </div>
              </div>
            </div>
            <div class="card">
              <h3 class="font-headline font-semibold text-lg mb-4">{{ $t('contact.info.hours') }}</h3>
              <div class="text-sm text-neutral whitespace-pre-line">{{ contactInfo.officeHours }}</div>
            </div>

            <!-- Map -->
            <div v-if="contactInfo.mapUrl" class="rounded-2xl overflow-hidden h-64">
              <iframe
                :src="contactInfo.mapUrl"
                width="100%"
                height="100%"
                style="border:0;"
                :allowfullscreen="true"
                loading="lazy"
                referrerpolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
            <div v-else class="bg-primary-light rounded-2xl h-48 flex items-center justify-center">
              <div class="text-center text-primary/60">
                <svg class="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
                <span class="text-sm font-medium">Map Location</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import axios from 'axios'

const apiUrl = import.meta.env.VITE_API_URL || '/api'
const isSubmitting = ref(false)
const submitStatus = ref<'idle' | 'success' | 'error'>('idle')

const contactInfo = ref({
  address: 'Antsirabe, Madagascar',
  phone: '+261 33 05 977 56',
  email: 'alravelomaharavo@gmail.com',
  officeHours: 'Mon-Fri 8:00 AM - 5:00 PM',
  mapUrl: ''
})

const form = reactive({
  name: '',
  email: '',
  subject: '',
  message: '',
})

const loadContactInfo = async () => {
  try {
    const response = await axios.get(`${apiUrl}/settings`)
    const settings = response.data

    // Settings is an object with keys like contact_address, contact_phone, etc.
    if (settings.contact_address) contactInfo.value.address = settings.contact_address
    if (settings.contact_phone) contactInfo.value.phone = settings.contact_phone
    if (settings.contact_email) contactInfo.value.email = settings.contact_email
    if (settings.office_hours) contactInfo.value.officeHours = settings.office_hours
    if (settings.map_url) contactInfo.value.mapUrl = settings.map_url
  } catch (error) {
    console.error('Error loading contact info:', error)
  }
}

const handleSubmit = async () => {
  isSubmitting.value = true
  submitStatus.value = 'idle'

  try {
    await axios.post(`${apiUrl}/contact`, form)
    submitStatus.value = 'success'
    form.name = ''
    form.email = ''
    form.subject = ''
    form.message = ''
  } catch {
    submitStatus.value = 'error'
  } finally {
    isSubmitting.value = false
  }
}

onMounted(() => {
  loadContactInfo()
})
</script>
