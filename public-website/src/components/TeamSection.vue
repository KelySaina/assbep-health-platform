<template>
  <section id="team" class="section pt-8 md:pt-10">
    <div class="container-narrow">
      <div class="relative overflow-hidden rounded-[2rem] border border-primary/10 bg-gradient-to-br from-slate-50 via-white to-primary-light/40 px-6 py-8 shadow-soft md:px-10 md:py-10">
        <div class="absolute -right-10 top-0 h-32 w-32 rounded-full bg-primary/10 blur-2xl"></div>
        <div class="absolute bottom-0 left-0 h-24 w-24 rounded-full bg-primary-light/60 blur-2xl"></div>

        <div class="relative">
          <div class="section-header max-w-3xl mx-auto text-center mb-8 md:mb-10">
            <span class="inline-flex items-center rounded-full border border-primary/15 bg-white/80 px-4 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-primary shadow-sm">
              ASSBEP
            </span>
            <h2 class="mt-4 text-4xl md:text-5xl font-headline font-semibold text-gray-900">{{ $t('team.title') }}</h2>
            <p class="text-lg text-gray-600 max-w-2xl mx-auto mt-4">
              {{ $t('team.subtitle') }}
            </p>
          </div>

          <div v-if="loading" class="text-center py-10">
            <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>

          <div v-else-if="team.length === 0" class="text-center py-10 text-gray-500">
            {{ $t('team.noMembers') }}
          </div>

          <div v-else class="grid md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5 justify-items-center max-w-5xl mx-auto">
            <div
              v-for="member in team"
              :key="member.id"
              class="group w-full max-w-[248px] overflow-hidden rounded-[1.5rem] border border-white/80 bg-white shadow-[0_18px_40px_rgba(15,23,42,0.08)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_22px_50px_rgba(15,23,42,0.14)]"
            >
              <div class="relative h-56 overflow-hidden bg-gradient-to-br from-primary/10 to-primary-light/10">
                <img
                  v-if="member.profilePicture"
                  :src="member.profilePicture"
                  :alt="member.name"
                  class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div
                  v-else
                  class="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary to-primary-dark text-white text-5xl font-bold"
                >
                  {{ member.name?.charAt(0) || '?' }}
                </div>

                <div
                  v-if="member.linkedin || member.twitter"
                  class="absolute inset-x-0 bottom-0 flex items-center justify-end gap-2 bg-gradient-to-t from-black/60 via-black/20 to-transparent p-3 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                >
                  <a
                    v-if="member.linkedin"
                    :href="member.linkedin"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="flex h-10 w-10 items-center justify-center rounded-full bg-white text-gray-900 transition-colors hover:bg-primary hover:text-white"
                    @click.stop
                  >
                    <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                    </svg>
                  </a>
                  <a
                    v-if="member.twitter"
                    :href="member.twitter"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="flex h-10 w-10 items-center justify-center rounded-full bg-white text-gray-900 transition-colors hover:bg-primary hover:text-white"
                    @click.stop
                  >
                    <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"/>
                    </svg>
                  </a>
                </div>
              </div>

              <div class="p-4 text-left">
                <h3 class="text-lg font-headline font-semibold text-gray-900 mb-1">
                  {{ member.name }}
                </h3>
                <p v-if="member.position" class="text-sm font-medium text-primary mb-2">
                  {{ member.position }}
                </p>
                <p v-if="member.bio" class="text-gray-600 text-sm leading-relaxed line-clamp-4">
                  {{ member.bio }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import axios from 'axios'

interface TeamMember {
  id: string
  name: string
  position?: string
  bio?: string
  profilePicture?: string
  linkedin?: string
  twitter?: string
}

const loading = ref(true)
const team = ref<TeamMember[]>([])

const apiUrl = import.meta.env.VITE_API_URL || '/api'

const fetchTeam = async () => {
  try {
    loading.value = true
    const response = await axios.get(`${apiUrl}/users/team`)
    team.value = response.data
  } catch (error) {
    console.error('Failed to fetch team:', error)
    team.value = []
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchTeam()
})
</script>

<style scoped>
.line-clamp-4 {
  display: -webkit-box;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
