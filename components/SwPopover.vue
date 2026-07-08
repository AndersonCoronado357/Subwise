<script setup lang="ts">
// Popover portal: nunca queda cortado por overflow. Posición calculada
// contra el viewport. Cierra con click fuera o Escape.

interface Props {
  anchor: HTMLElement | null
  open: boolean
  align?: 'left' | 'right'
  width?: number
}
const props = withDefaults(defineProps<Props>(), { align: 'left' })
const emit = defineEmits<{ close: [] }>()

const popRef = ref<HTMLElement | null>(null)
const pos = ref<{ left: number; top: number; width: number } | null>(null)

function place() {
  const a = props.anchor
  if (!a) return
  const r = a.getBoundingClientRect()
  const w = props.width ?? r.width
  const vh = window.innerHeight
  const vw = window.innerWidth
  const ph = popRef.value?.offsetHeight ?? 320
  const below = vh - r.bottom
  const openUp = below < ph + 12 && r.top > below
  let left = props.align === 'right' ? r.right - w : r.left
  left = Math.max(8, Math.min(left, vw - w - 8))
  const top = openUp ? Math.max(8, r.top - ph - 6) : r.bottom + 6
  pos.value = { left, top, width: w }
}

function onKey(e: KeyboardEvent) {
  if (e.key === 'Escape' && props.open) emit('close')
}
function onDown(e: MouseEvent) {
  const t = e.target as Node
  if (popRef.value && !popRef.value.contains(t) &&
      props.anchor && !props.anchor.contains(t)) emit('close')
}

watch(() => props.open, async (open) => {
  if (open) {
    await nextTick()
    place()
  } else {
    pos.value = null
  }
})

onMounted(() => {
  window.addEventListener('scroll', place, true)
  window.addEventListener('resize', place)
  window.addEventListener('keydown', onKey)
  document.addEventListener('mousedown', onDown)
})
onBeforeUnmount(() => {
  window.removeEventListener('scroll', place, true)
  window.removeEventListener('resize', place)
  window.removeEventListener('keydown', onKey)
  document.removeEventListener('mousedown', onDown)
})
</script>

<template>
  <Teleport to="body">
    <div
      v-if="open"
      ref="popRef"
      class="popover"
      :style="pos
        ? { left: pos.left + 'px', top: pos.top + 'px', width: pos.width + 'px' }
        : { left: '0px', top: '0px', width: (width ?? 240) + 'px', visibility: 'hidden' }"
    >
      <slot />
    </div>
  </Teleport>
</template>
