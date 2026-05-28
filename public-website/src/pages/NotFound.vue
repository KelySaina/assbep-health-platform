<template>
  <div class="min-h-[60vh] flex items-center justify-center py-16">
    <div class="text-center">
      <div class="w-24 h-24 bg-primary-light rounded-3xl flex items-center justify-center mx-auto mb-6">
        <svg class="w-12 h-12 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
            d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <h1 class="text-4xl font-headline font-semibold text-gray-900 mb-4">{{ $t('common.not_found') }}</h1>
      <p class="text-neutral max-w-md mx-auto mb-8">{{ $t('common.not_found_message') }}</p>
      <router-link to="/" class="btn-primary">
        {{ $t('common.go_home') }}
      </router-link>
    </div>
  </div>
</template>
