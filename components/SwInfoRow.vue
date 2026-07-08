<script setup lang="ts">
import type SwIcon from './SwIcon.vue'
type IconName = InstanceType<typeof SwIcon>['$props']['name']

interface Props {
  icon: IconName
  label: string
  value: string | number
  last?: boolean
}
withDefaults(defineProps<Props>(), { last: false })
</script>

<template>
  <div class="info-row">
    <span class="row" style="gap: 11px; color: var(--text2)">
      <SwIcon :name="icon" :size="18" style="color: var(--text3)" />
      <span style="font-size: .9rem">{{ label }}</span>
    </span>
    <span style="font-weight: 600; font-size: .92rem; text-align: right">{{ value }}</span>
  </div>
  <hr v-if="!last" class="hair" />
</template>
