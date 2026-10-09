<template>
  <div>
    <label class="label">Framing</label>
    <p class="text-xs text-gray-500 mb-2">
      Click the part of the image that must stay visible. Nothing is cropped — the
      original is kept, and this only decides what stays in view when the image is
      shown in a box that is a different shape.
    </p>

    <div class="flex flex-col sm:flex-row gap-4">
      <!-- The image itself. Click or drag to place the point. -->
      <div
        ref="frame"
        class="relative select-none cursor-crosshair rounded-lg overflow-hidden bg-gray-100 flex-1 min-w-0"
        @pointerdown="startDrag"
        @pointermove="onDrag"
        @pointerup="endDrag"
        @pointercancel="endDrag"
      >
        <img :src="baseUrl" :alt="alt" class="w-full h-auto max-h-64 object-contain pointer-events-none" draggable="false" />
        <!-- Crosshair. translate(-50%,-50%) centres it on the chosen point rather
             than hanging it below-right, which would misreport where you clicked. -->
        <div
          class="absolute w-6 h-6 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white ring-2 ring-primary shadow pointer-events-none"
          :style="{ left: `${model.x}%`, top: `${model.y}%` }"
        >
          <div class="absolute inset-1.5 rounded-full bg-primary"></div>
        </div>
      </div>

      <!-- Live previews, in the shapes the public site actually uses. Guessing
           from the full image is the thing that goes wrong: a portrait looks fine
           until it is put in a wide card. -->
      <div class="flex sm:flex-col gap-3">
        <div v-for="p in previews" :key="p.label" class="text-center">
          <div
            class="overflow-hidden bg-gray-100 border border-gray-200"
            :class="p.class"
          >
            <img :src="baseUrl" :alt="alt" class="w-full h-full object-cover" :style="style" />
          </div>
          <span class="text-[10px] text-gray-500 mt-1 block">{{ p.label }}</span>
        </div>
      </div>
    </div>

    <div class="flex items-center justify-between mt-2">
      <span class="text-xs text-gray-400 tabular-nums">{{ Math.round(model.x) }}% · {{ Math.round(model.y) }}%</span>
      <button type="button" class="text-xs text-gray-500 hover:text-gray-700 underline" @click="reset">
        Reset to centre
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { DEFAULT_FOCAL, type Focal } from '../utils/focal'

const props = defineProps<{
  url: string
  alt?: string
  modelValue: Focal
}>()

const emit = defineEmits<{ (e: 'update:modelValue', value: Focal): void }>()

const frame = ref<HTMLElement | null>(null)
const dragging = ref(false)

// Strip any existing fragment: the <img> here must show the whole image so you can
// choose a point on it, and a stale #fx/#fy would be noise in the URL.
const baseUrl = computed(() => (props.url || '').split('#')[0])
const model = computed(() => props.modelValue ?? DEFAULT_FOCAL)
const style = computed(() => ({ objectPosition: `${model.value.x}% ${model.value.y}%` }))

const previews = [
  { label: 'Card', class: 'w-28 h-16 rounded' },
  { label: 'Square', class: 'w-16 h-16 rounded' },
  { label: 'Team', class: 'w-16 h-16 rounded-full' },
]

const setFromEvent = (event: PointerEvent) => {
  const el = frame.value
  if (!el) return
  const rect = el.getBoundingClientRect()
  if (!rect.width || !rect.height) return
  const x = ((event.clientX - rect.left) / rect.width) * 100
  const y = ((event.clientY - rect.top) / rect.height) * 100
  // Clamped because a drag can leave the element: the pointer is captured, so
  // events keep arriving with coordinates outside the box.
  emit('update:modelValue', {
    x: Math.min(100, Math.max(0, x)),
    y: Math.min(100, Math.max(0, y)),
  })
}

const startDrag = (event: PointerEvent) => {
  dragging.value = true
  // Capture, so a drag that wanders off the image keeps updating instead of
  // stopping wherever the pointer happened to leave.
  ;(event.target as HTMLElement).setPointerCapture?.(event.pointerId)
  setFromEvent(event)
}
const onDrag = (event: PointerEvent) => {
  if (dragging.value) setFromEvent(event)
}
const endDrag = () => {
  dragging.value = false
}
const reset = () => emit('update:modelValue', { ...DEFAULT_FOCAL })
</script>
