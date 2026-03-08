<template>
  <div class="space-y-6">
    <div>
      <h2 class="text-2xl font-headline font-semibold">{{ $t('admin.settings') }}</h2>
      <p class="text-sm text-gray-500 mt-1">Configure website settings and contact information</p>
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
          <div>
            <label class="label">Default Language</label>
            <select class="input" v-model="settings.defaultLanguage">
              <option value="en">English</option>
              <option value="fr">French</option>
            </select>
          </div>
          <button type="button" class="btn-primary">{{ $t('actions.save') }}</button>
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
            <input type="text" class="input" v-model="settings.mapUrl" placeholder="https://maps.google.com/..." />
          </div>
          <button type="button" class="btn-primary">{{ $t('actions.save') }}</button>
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
          <button type="button" class="btn-primary">{{ $t('actions.save') }}</button>
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
          <button type="button" class="btn-primary">{{ $t('actions.save') }}</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'

const settings = reactive({
  siteName: 'ASSBEP Health Platform',
  siteDescription: 'Improving Community Health Together — Améliorer la Santé de la Population Ensemble',
  defaultLanguage: 'en',
  address: 'Yaoundé, Cameroon',
  phone: '+237 6XX XXX XXX',
  email: 'contact@assbep.org',
  officeHours: 'Mon-Fri 8:00 AM - 5:00 PM',
  mapUrl: '',
  metaTitle: 'ASSBEP - Improving Community Health Together',
  metaDescription: 'ASSBEP Health Platform - Accessible healthcare services, education, and outreach programs for communities.',
  ogImage: '',
  facebook: '',
  twitter: '',
  instagram: '',
  linkedin: '',
})
</script>
