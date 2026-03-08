<template>
  <section class="py-16 bg-primary">
    <div class="container-narrow">
      <div class="grid grid-cols-2 md:grid-cols-4 gap-8">
        <div v-for="stat in stats" :key="stat.id" class="text-center text-white">
          <div class="text-4xl md:text-5xl font-headline font-bold mb-2">
            {{ formatNumber(animatedValues[stat.key] || 0) }}{{ stat.value >= 100 ? '+' : '' }}
          </div>
          <div class="text-blue-200 text-sm md:text-base">{{ $t(`stats.${stat.key}`) }}</div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { Statistic } from '@/types'

const props = defineProps<{ stats: Statistic[] }>()
const animatedValues = ref<Record<string, number>>({})

const formatNumber = (num: number) => {
  if (num >= 1000) return (num / 1000).toFixed(num % 1000 === 0 ? 0 : 1) + 'K'
  return num.toString()
}

const animateValue = (key: string, end: number, duration: number) => {
  let start = 0
  const increment = end / (duration / 16)
  const timer = setInterval(() => {
    start += increment
    if (start >= end) {
      animatedValues.value[key] = end
      clearInterval(timer)
    } else {
      animatedValues.value[key] = Math.floor(start)
    }
  }, 16)
}

onMounted(() => {
  props.stats.forEach((stat) => {
    animateValue(stat.key, stat.value, 2000)
  })
})
</script>
