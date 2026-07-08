<script setup lang="ts">
interface Props { size?: number | string }
withDefaults(defineProps<Props>(), { size: 18 })
</script>

<template>
  <svg :width="size" :height="size" viewBox="0 0 24 24" style="display: block" aria-hidden="true">
    <path d="M21 3.5c-9 0-15 4.2-15 11.2 0 1.7.4 3.1 1 4.3C3.5 16 7 11 13 9c-4.4 2.6-6.8 6.6-7.6 10.4 1.3.8 3 1.1 4.8 1.1 8 0 11.8-6.4 11.8-17Z"
          fill="currentColor"/>
  </svg>
</template>
