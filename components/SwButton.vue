<script setup lang="ts">
interface Props {
  variant?: 'primary' | 'ghost' | 'quiet' | 'danger'
  size?: 'lg'
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
  block?: boolean
  leaves?: boolean
}
const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  type: 'button',
  disabled: false,
  block: false,
  leaves: true,
})

const conLeaves = computed(() => props.leaves && props.variant === 'primary')
</script>

<template>
  <button
    :type="type"
    :disabled="disabled"
    :class="[
      'btn',
      `btn-${variant}`,
      size === 'lg' ? 'btn-lg' : '',
      block ? 'btn-block' : '',
    ]"
  >
    <slot />
  </button>
</template>
