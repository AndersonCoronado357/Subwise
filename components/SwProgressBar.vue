<script setup lang="ts">
interface Props { pct: number; color?: string }
const props = withDefaults(defineProps<Props>(), { color: 'var(--accent)' })
const ancho = computed(() => `${Math.min(100, Math.max(0, props.pct))}%`)
</script>

<template>
  <div class="bar"><i :style="{ width: ancho, background: color }" /></div>
</template>
