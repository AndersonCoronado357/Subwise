<script setup lang="ts">
import type SwIcon from './SwIcon.vue'

type IconName = InstanceType<typeof SwIcon>['$props']['name']

interface Props {
  name: IconName
  on?: boolean
  size?: number
  ariaLabel?: string
  small?: boolean
}
withDefaults(defineProps<Props>(), { on: false, size: 20, small: false })
</script>

<template>
  <button
    :class="['iconbtn', on ? 'on' : '', small ? 'sm' : '']"
    :aria-label="ariaLabel"
  >
    <SwIcon :name="name" :size="size" />
  </button>
</template>
