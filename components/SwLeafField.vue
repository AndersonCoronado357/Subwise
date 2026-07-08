<script setup lang="ts">
// Fondo decorativo abstracto: solo anillos concéntricos (sin motivos de hojas).
// Color via currentColor del contenedor. Opacidad la maneja el contenedor.
</script>

<template>
  <svg
    viewBox="0 0 1200 800"
    preserveAspectRatio="xMidYMid slice"
    style="position: absolute; inset: 0; width: 100%; height: 100%"
    aria-hidden="true"
  >
    <g fill="none" stroke="currentColor" stroke-width="1.1" opacity="0.5">
      <circle cx="980" cy="150" r="170" />
      <circle cx="980" cy="150" r="240" />
      <circle cx="980" cy="150" r="310" />
      <circle cx="120" cy="660" r="150" />
      <circle cx="120" cy="660" r="220" />
      <circle cx="120" cy="660" r="290" />
    </g>
  </svg>
</template>
