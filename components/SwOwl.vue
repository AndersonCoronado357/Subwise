<script setup lang="ts">
// Logo de Subwise: el búho real (fondo transparente) en public/owl.png.
interface Props { size?: number | string }
const props = withDefaults(defineProps<Props>(), { size: 22 })
const px = computed(() => (typeof props.size === 'number' ? `${props.size}px` : props.size))
</script>

<template>
  <img
    src="/owl.png"
    alt="Subwise"
    :style="{ width: px, height: px, objectFit: 'contain', display: 'block' }"
  >
</template>
