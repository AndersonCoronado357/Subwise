<script setup lang="ts">
interface Opcion {
  value: string | number
  label: string
}
interface Props {
  modelValue: string | number
  options: Opcion[]
  ariaLabel?: string
}
const props = defineProps<Props>()
defineEmits<{ 'update:modelValue': [v: string | number] }>()

const wrapRef = ref<HTMLElement | null>(null)
const thumb = ref<{ left: number; width: number } | null>(null)
const idx = computed(() => Math.max(0, props.options.findIndex(o => o.value === props.modelValue)))

function recompute() {
  const el = wrapRef.value
  if (!el) return
  const btns = el.querySelectorAll<HTMLElement>('.seg-btn')
  const b = btns[idx.value]
  if (!b) return
  thumb.value = { left: b.offsetLeft, width: b.offsetWidth }
}

watch([idx, () => props.options.length], async () => {
  await nextTick()
  recompute()
})

onMounted(async () => {
  await nextTick()
  recompute()
  window.addEventListener('resize', recompute)
})
onBeforeUnmount(() => window.removeEventListener('resize', recompute))
</script>

<template>
  <div ref="wrapRef" class="seg" role="radiogroup" :aria-label="ariaLabel">
    <span
      v-if="thumb"
      class="seg-thumb"
      :style="{ left: thumb.left + 'px', width: thumb.width + 'px' }"
    />
    <button
      v-for="o in options"
      :key="o.value"
      type="button"
      role="radio"
      :aria-checked="modelValue === o.value"
      :class="['seg-btn', o.value === modelValue ? 'on' : '']"
      @click="$emit('update:modelValue', o.value)"
    >
      {{ o.label }}
    </button>
  </div>
</template>
