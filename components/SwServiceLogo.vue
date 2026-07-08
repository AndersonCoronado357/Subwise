<script setup lang="ts">
import type { Suscripcion } from '~/types/suscripcion'

interface Props {
  sub: Pick<Suscripcion, 'initials' | 'tint'>
  size?: number
}
const props = withDefaults(defineProps<Props>(), { size: 44 })

// Todos los recuadros usan el color de la app (acento), sin colores aleatorios.
const estilo = computed(() => ({
  width:  `${props.size}px`,
  height: `${props.size}px`,
  background: 'var(--accent-soft)',
  color:      'color-mix(in srgb, var(--accent) 82%, var(--text))',
}))
</script>

<template>
  <span class="logo" :style="estilo">{{ sub.initials }}</span>
</template>
