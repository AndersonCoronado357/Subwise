<script setup lang="ts">
// Fondo decorativo botánico: anillos + ramas + hojas dispersas.
// Color via currentColor del contenedor. Opacidad la maneja el contenedor.
</script>

<template>
  <svg
    viewBox="0 0 1200 800"
    preserveAspectRatio="xMidYMid slice"
    style="position: absolute; inset: 0; width: 100%; height: 100%"
    aria-hidden="true"
  >
    <defs>
      <path id="lf" d="M0 0c-7 0-12 3.4-12 9 0 1.4.3 2.5.8 3.4C-9 9-6 5.8-1 4-4.5 6.1-6.5 9.3-7 12.4c1 .6 2.4.9 3.8.9 6.4 0 9.2-5.1 9.2-13.3Z" />
    </defs>
    <g fill="none" stroke="currentColor" stroke-width="1.1" opacity="0.5">
      <circle cx="980" cy="150" r="230" />
      <circle cx="980" cy="150" r="300" />
      <circle cx="120" cy="660" r="180" />
      <circle cx="120" cy="660" r="250" />
    </g>
    <g fill="none" stroke="currentColor" stroke-width="1.3" opacity="0.55" stroke-linecap="round">
      <path d="M-20 720 C 180 660 320 560 360 420 C 380 350 360 300 420 250" />
      <path d="M1220 90 C 1020 140 880 240 840 380 C 820 460 850 520 800 580" />
    </g>
    <g fill="currentColor" opacity="0.5">
      <use href="#lf" transform="translate(360 420) scale(2.1) rotate(20)" />
      <use href="#lf" transform="translate(388 360) scale(1.8) rotate(-30)" />
      <use href="#lf" transform="translate(410 305) scale(1.9) rotate(40)" />
      <use href="#lf" transform="translate(330 470) scale(1.7) rotate(-10)" />
      <use href="#lf" transform="translate(840 380) scale(2.2) rotate(200)" />
      <use href="#lf" transform="translate(820 455) scale(1.9) rotate(150)" />
      <use href="#lf" transform="translate(806 525) scale(1.8) rotate(230)" />
      <use href="#lf" transform="translate(120 120) scale(1.6) rotate(70)" />
      <use href="#lf" transform="translate(1080 700) scale(1.7) rotate(250)" />
    </g>
  </svg>
</template>
