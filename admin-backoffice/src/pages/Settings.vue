<template>
  <div class="space-y-6">
    <div>
      <h2 class="text-2xl font-headline font-semibold">{{ $t('admin.settings') }}</h2>
      <p class="text-sm text-gray-500 mt-1">Configure website settings, contact information, About page content, SEO, social links, and homepage statistics.</p>
    </div>

    <div class="grid lg:grid-cols-2 gap-6">
      <!-- General Settings -->
      <div class="card">
        <h3 class="font-headline font-semibold text-lg mb-4">General Settings</h3>
        <form class="space-y-4">
          <div>
            <label class="label">Site Name</label>
            <input type="text" class="input" v-model="settings.siteName" />
          </div>
          <div>
            <label class="label">Site Description</label>
            <textarea class="input" rows="3" v-model="settings.siteDescription"></textarea>
          </div>
          <button type="button" class="btn-primary" @click="saveSettings('general')" :disabled="loading.general">
            {{ loading.general ? 'Saving...' : $t('actions.save') }}
          </button>
        </form>
      </div>

      <!-- Contact Settings -->
      <div class="card">
        <h3 class="font-headline font-semibold text-lg mb-4">Contact Information</h3>
        <form class="space-y-4">
          <div>
            <label class="label">Address</label>
            <input type="text" class="input" v-model="settings.address" />
          </div>
          <div>
            <label class="label">Phone</label>
            <input type="tel" class="input" v-model="settings.phone" />
          </div>
          <div>
            <label class="label">Email</label>
            <input type="email" class="input" v-model="settings.email" />
          </div>
          <div>
            <label class="label">Office Hours</label>
            <input type="text" class="input" v-model="settings.officeHours" />
          </div>
          <div>
            <label class="label">Google Maps Embed URL</label>
            <input type="text" class="input" v-model="settings.mapUrl" placeholder="https://www.google.com/maps/embed?pb=..." />
            <p class="text-xs text-gray-500 mt-1">
              💡 To get the embed URL: Go to <a href="https://www.google.com/maps" target="_blank" class="text-primary hover:underline">Google Maps</a>,
              search for your location, click <strong>Share</strong> → <strong>Embed a map</strong> → Copy the URL from the iframe src attribute.
            </p>
          </div>
          <button type="button" class="btn-primary" @click="saveSettings('contact')" :disabled="loading.contact">
            {{ loading.contact ? 'Saving...' : $t('actions.save') }}
          </button>
        </form>
      </div>

      <!-- SEO Settings -->
      <div class="card">
        <h3 class="font-headline font-semibold text-lg mb-4">SEO Settings</h3>
        <form class="space-y-4">
          <div>
            <label class="label">Meta Title</label>
            <input type="text" class="input" v-model="settings.metaTitle" />
          </div>
          <div>
            <label class="label">Meta Description</label>
            <textarea class="input" rows="3" v-model="settings.metaDescription"></textarea>
          </div>
          <div>
            <label class="label">OG Image URL</label>
            <input type="text" class="input" v-model="settings.ogImage" />
          </div>
          <button type="button" class="btn-primary" @click="saveSettings('seo')" :disabled="loading.seo">
            {{ loading.seo ? 'Saving...' : $t('actions.save') }}
          </button>
        </form>
      </div>

      <!-- Social Media -->
      <div class="card">
        <h3 class="font-headline font-semibold text-lg mb-4">Social Media</h3>
        <form class="space-y-4">
          <div>
            <label class="label">Facebook</label>
            <input type="url" class="input" v-model="settings.facebook" placeholder="https://facebook.com/..." />
          </div>
          <div>
            <label class="label">Twitter / X</label>
            <input type="url" class="input" v-model="settings.twitter" placeholder="https://x.com/..." />
          </div>
          <div>
            <label class="label">Instagram</label>
            <input type="url" class="input" v-model="settings.instagram" placeholder="https://instagram.com/..." />
          </div>
          <div>
            <label class="label">LinkedIn</label>
            <input type="url" class="input" v-model="settings.linkedin" placeholder="https://linkedin.com/..." />
          </div>
          <button type="button" class="btn-primary" @click="saveSettings('social')" :disabled="loading.social">
            {{ loading.social ? 'Saving...' : $t('actions.save') }}
          </button>
        </form>
      </div>

      <!-- About Page History -->
      <div class="card lg:col-span-2">
        <h3 class="font-headline font-semibold text-lg mb-4">About Page History</h3>
        <p class="text-sm text-gray-500 mb-4">Edit the history block shown on the public About page.</p>
        <form class="space-y-5">
          <div class="grid lg:grid-cols-2 gap-4">
            <div>
              <label class="label">History Title</label>
              <input type="text" class="input" v-model="settings.aboutHistoryTitle" />
            </div>
            <div>
              <label class="label">History Description</label>
              <textarea class="input" rows="3" v-model="settings.aboutHistoryDescription"></textarea>
            </div>
          </div>

          <div class="grid lg:grid-cols-3 gap-4">
            <div class="rounded-2xl border border-gray-200 p-4 space-y-3">
              <p class="text-xs font-semibold uppercase tracking-[0.2em] text-gray-400">Step 01</p>
              <div>
                <label class="label">Title</label>
                <input type="text" class="input" v-model="settings.aboutHistoryItem1Title" />
              </div>
              <div>
                <label class="label">Description</label>
                <textarea class="input" rows="3" v-model="settings.aboutHistoryItem1Description"></textarea>
              </div>
            </div>

            <div class="rounded-2xl border border-gray-200 p-4 space-y-3">
              <p class="text-xs font-semibold uppercase tracking-[0.2em] text-gray-400">Step 02</p>
              <div>
                <label class="label">Title</label>
                <input type="text" class="input" v-model="settings.aboutHistoryItem2Title" />
              </div>
              <div>
                <label class="label">Description</label>
                <textarea class="input" rows="3" v-model="settings.aboutHistoryItem2Description"></textarea>
              </div>
            </div>

            <div class="rounded-2xl border border-gray-200 p-4 space-y-3">
              <p class="text-xs font-semibold uppercase tracking-[0.2em] text-gray-400">Step 03</p>
              <div>
                <label class="label">Title</label>
                <input type="text" class="input" v-model="settings.aboutHistoryItem3Title" />
              </div>
              <div>
                <label class="label">Description</label>
                <textarea class="input" rows="3" v-model="settings.aboutHistoryItem3Description"></textarea>
              </div>
            </div>
          </div>

          <button type="button" class="btn-primary" @click="saveSettings('about')" :disabled="loading.about">
            {{ loading.about ? 'Saving...' : $t('actions.save') }}
          </button>
        </form>
      </div>

      <!-- Homepage Stats -->
      <div class="card">
        <h3 class="font-headline font-semibold text-lg mb-4">Homepage Statistics</h3>
        <p class="text-sm text-gray-500 mb-4">These numbers appear on the homepage hero section</p>
        <form class="space-y-4">
          <div>
            <label class="label">People Helped</label>
            <input type="number" class="input" v-model.number="settings.peopleHelped" placeholder="25000" />
            <p class="text-xs text-gray-500 mt-1">Total number of people helped by your programs</p>
          </div>
          <div>
            <label class="label">Volunteers</label>
            <input type="number" class="input" v-model.number="settings.volunteers" placeholder="350" />
            <p class="text-xs text-gray-500 mt-1">Total number of active volunteers</p>
          </div>
          <div class="p-3 bg-blue-50 rounded-lg text-sm text-blue-700">
            <strong>Note:</strong> Programs and Partners counts are automatically calculated from your database.
          </div>
          <button type="button" class="btn-primary" @click="saveSettings('stats')" :disabled="loading.stats">
            {{ loading.stats ? 'Saving...' : $t('actions.save') }}
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, onMounted } from 'vue'
import axios from 'axios'
import { useToast } from 'vue-toastification'

const toast = useToast()
const apiUrl = import.meta.env.VITE_API_URL || '/api'

const settings = reactive({
  siteName: '',
  siteDescription: '',
  address: ''
  phone: '',
  email: '',
  officeHours: '',
  mapUrl: '',
  metaTitle: '',
  metaDescription: '',
  ogImage: '',
  facebook: '',
  twitter: '',
  instagram: '',
  linkedin: '',
  aboutHistoryTitle: '',
  aboutHistoryDescription: '',
  aboutHistoryItem1Title: '',
  aboutHistoryItem1Description: '',
  aboutHistoryItem2Title: '',
  aboutHistoryItem2Description: '',
  aboutHistoryItem3Title: '',
  aboutHistoryItem3Description: '',
  peopleHelped: 0,
  volunteers: 0,
})

const loading = reactive({
  general: false,
  contact: false,
  seo: false,
  social: false,
  about: false,
  stats: false,
})

const loadSettings = async () => {
  try {
    const response = await axios.get(`${apiUrl}/settings`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('admin_token')}`
      }
    })
    const data = response.data

    // Map API response to settings
    settings.siteName = data.site_name || ''
    settings.siteDescription = data.site_description || ''
    settings.address = data.contact_address || ''
    settings.phone = data.contact_phone || ''
    settings.email = data.contact_email || ''
    settings.officeHours = data.office_hours || ''
    settings.mapUrl = data.map_url || ''
    settings.metaTitle = data.meta_title || ''
    settings.metaDescription = data.meta_description || ''
    settings.ogImage = data.og_image || ''
    settings.facebook = data.social_facebook || ''
    settings.twitter = data.social_twitter || ''
    settings.instagram = data.social_instagram || ''
    settings.linkedin = data.social_linkedin || ''
    settings.aboutHistoryTitle = data.about_history_title || ''
    settings.aboutHistoryDescription = data.about_history_description || ''
    settings.aboutHistoryItem1Title = data.about_history_item_1_title || ''
    settings.aboutHistoryItem1Description = data.about_history_item_1_description || ''
    settings.aboutHistoryItem2Title = data.about_history_item_2_title || ''
    settings.aboutHistoryItem2Description = data.about_history_item_2_description || ''
    settings.aboutHistoryItem3Title = data.about_history_item_3_title || ''
    settings.aboutHistoryItem3Description = data.about_history_item_3_description || ''
    settings.peopleHelped = parseInt(data.stat_people_helped) || 0
    settings.volunteers = parseInt(data.stat_volunteers) || 0
  } catch (error) {
    console.error('Error loading settings:', error)
    toast.error('Failed to load settings')
  }
}

const saveSettings = async (section: 'general' | 'contact' | 'seo' | 'social' | 'about' | 'stats') => {
  loading[section] = true

  try {
    let data: Record<string, string> = {}

    if (section === 'general') {
      data = {
        site_name: settings.siteName,
        site_description: settings.siteDescription,
      }
    } else if (section === 'contact') {
      data = {
        contact_address: settings.address,
        contact_phone: settings.phone,
        contact_email: settings.email,
        office_hours: settings.officeHours,
        map_url: settings.mapUrl,
      }
    } else if (section === 'seo') {
      data = {
        meta_title: settings.metaTitle,
        meta_description: settings.metaDescription,
        og_image: settings.ogImage,
      }
    } else if (section === 'social') {
      data = {
        social_facebook: settings.facebook,
        social_twitter: settings.twitter,
        social_instagram: settings.instagram,
        social_linkedin: settings.linkedin,
      }
    } else if (section === 'about') {
      data = {
        about_history_title: settings.aboutHistoryTitle,
        about_history_description: settings.aboutHistoryDescription,
        about_history_item_1_title: settings.aboutHistoryItem1Title,
        about_history_item_1_description: settings.aboutHistoryItem1Description,
        about_history_item_2_title: settings.aboutHistoryItem2Title,
        about_history_item_2_description: settings.aboutHistoryItem2Description,
        about_history_item_3_title: settings.aboutHistoryItem3Title,
        about_history_item_3_description: settings.aboutHistoryItem3Description,
      }
    } else if (section === 'stats') {
      data = {
        stat_people_helped: settings.peopleHelped.toString(),
        stat_volunteers: settings.volunteers.toString(),
      }
    }

    await axios.post(`${apiUrl}/settings`, data, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('admin_token')}`
      }
    })

    toast.success('Settings saved successfully!')
  } catch (error) {
    console.error('Error saving settings:', error)
    toast.error('Failed to save settings')
  } finally {
    loading[section] = false
  }
}

onMounted(() => {
  loadSettings()
})
</script>
