<script setup lang="ts">
interface Props { size?: number | string }
withDefaults(defineProps<Props>(), { size: 22 })
</script>

<template>
  <svg :width="size" :height="size" viewBox="0 0 64 64" fill="currentColor" style="display: block" aria-hidden="true">
    <path d="M25 17 Q16 12 15.5 5 Q22.5 8.5 26.5 16 Z" />
    <path d="M39 17 Q48 12 48.5 5 Q41.5 8.5 37.5 16 Z" />
    <path
      fill-rule="evenodd"
      d="M32 12 C18.5 12 11 21.5 11 33 C11 45 19 54 32 54 C45 54 53 45 53 33 C53 21.5 45.5 12 32 12 Z
         M15.5 31 a7.6 7.6 0 1 0 15.2 0 a7.6 7.6 0 1 0 -15.2 0
         M33.3 31 a7.6 7.6 0 1 0 15.2 0 a7.6 7.6 0 1 0 -15.2 0
         M32 40 l3.4 4.8 a5.6 5.6 0 0 1 -6.8 0 Z"
    />
    <circle cx="23.1" cy="31" r="2.7" />
    <circle cx="40.9" cy="31" r="2.7" />
  </svg>
</template>
