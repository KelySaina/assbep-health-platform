<template>
  <section class="relative bg-gradient-to-br from-primary via-primary to-primary-dark overflow-hidden">
    <div class="absolute inset-0 opacity-10">
      <div class="absolute top-0 right-0 w-96 h-96 bg-white rounded-full -translate-y-1/2 translate-x-1/2"></div>
      <div class="absolute bottom-0 left-0 w-64 h-64 bg-white rounded-full translate-y-1/2 -translate-x-1/2"></div>
    </div>

    <div class="container-narrow relative py-20 md:py-32">
      <div class="grid md:grid-cols-2 gap-12 items-center">
        <div class="text-white space-y-6">
          <h1 class="text-4xl md:text-5xl lg:text-6xl font-headline font-semibold leading-tight">
            {{ $t('hero.title') }}
          </h1>
          <p class="text-lg md:text-xl text-blue-100 leading-relaxed max-w-lg">
            {{ $t('hero.subtitle') }}
          </p>
          <div class="flex flex-wrap gap-4 pt-2">
            <router-link to="/programs" class="inline-flex items-center px-8 py-3.5 bg-white text-primary font-semibold rounded-xl hover:bg-blue-50 transition-all duration-200 shadow-lg">
              {{ $t('hero.cta') }}
              <svg class="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </router-link>
            <router-link to="/contact" class="inline-flex items-center px-8 py-3.5 border-2 border-white/30 text-white font-semibold rounded-xl hover:bg-white/10 transition-all duration-200">
              {{ $t('hero.cta_secondary') }}
            </router-link>
          </div>
        </div>

        <div class="hidden md:flex justify-center">
          <div class="relative">
            <div class="w-80 h-80 bg-white/10 rounded-3xl flex items-center justify-center backdrop-blur-sm">
              <svg class="w-48 h-48 text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1"
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <div class="absolute -top-4 -right-4 bg-white/20 backdrop-blur-sm rounded-2xl p-4 text-white">
              <div class="text-2xl font-bold">25K+</div>
              <div class="text-xs text-blue-200">{{ $t('stats.people_helped') }}</div>
            </div>
            <div class="absolute -bottom-4 -left-4 bg-white/20 backdrop-blur-sm rounded-2xl p-4 text-white">
              <div class="text-2xl font-bold">48</div>
              <div class="text-xs text-blue-200">{{ $t('stats.programs_launched') }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
