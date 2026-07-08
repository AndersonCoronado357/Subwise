<script setup lang="ts">
interface Props { size?: number }
const props = withDefaults(defineProps<Props>(), { size: 22 })
const fontSize = computed(() => `${props.size * 0.95}px`)
</script>

<template>
  <span class="row" style="gap: 9px; align-items: center;">
    <span style="color: var(--accent); display: flex">
      <SwOwl :size="size" />
    </span>
    <span
      class="sw-title"
      :style="{ fontWeight: 600, fontSize, letterSpacing: '-.02em', color: 'var(--text)' }"
    >
      Subwise
    </span>
  </span>
</template>
