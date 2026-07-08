<script setup lang="ts">
interface Props { size?: number | string }
withDefaults(defineProps<Props>(), { size: 26 })
</script>

<template>
  <svg :width="size" :height="size" viewBox="0 0 32 32" style="display: block" aria-hidden="true">
    <g fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round">
      <path d="M16 30V7" />
      <path d="M16 22c0-3-2.5-5-6-5.4M16 22c.2-2.6 2.2-4.6 5.4-5.2" />
      <path d="M16 15c0-3-2.2-5.2-5.4-5.8M16 15c.2-2.7 2-4.8 5-5.6" />
      <path d="M16 9c0-2.6 1.6-4.6 4-5.2" />
    </g>
  </svg>
</template>
