<script setup lang="ts">
import type { Suscripcion } from '~/types/suscripcion'

interface Props {
  sub: Pick<Suscripcion, 'initials' | 'tint'>
  size?: number
}
const props = withDefaults(defineProps<Props>(), { size: 44 })

const estilo = computed(() => {
  const tint = props.sub.tint || '#888'
  return {
    width:  `${props.size}px`,
    height: `${props.size}px`,
    background: `color-mix(in srgb, ${tint} 22%, var(--s2))`,
    color:      `color-mix(in srgb, ${tint} 72%, var(--text))`,
  }
})
</script>

<template>
  <span class="logo" :style="estilo">{{ sub.initials }}</span>
</template>
