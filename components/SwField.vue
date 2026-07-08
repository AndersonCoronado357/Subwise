<script setup lang="ts">
import type SwIcon from './SwIcon.vue'

type IconName = InstanceType<typeof SwIcon>['$props']['name']

interface Props {
  modelValue: string | number
  label?: string
  icon?: IconName
  iconRight?: IconName
  placeholder?: string
  type?: string
  as?: 'input' | 'textarea'
  autocomplete?: string
  autofocus?: boolean
  inputmode?: 'text' | 'numeric' | 'decimal' | 'email' | 'tel' | 'search'
  grow?: boolean
}
const props = withDefaults(defineProps<Props>(), {
  type: 'text',
  as: 'input',
  grow: false,
})
defineEmits<{
  'update:modelValue': [v: string | number]
  enter: []
}>()
</script>

<template>
  <label class="col" :class="grow ? 'grow-field' : ''" style="min-width: 0;">
    <span v-if="label" class="field-label">{{ label }}</span>
    <span class="input-wrap">
      <span v-if="icon" class="input-icon l">
        <SwIcon :name="icon" :size="18" />
      </span>
      <textarea
        v-if="as === 'textarea'"
        :value="modelValue"
        :placeholder="placeholder"
        :autofocus="autofocus"
        :inputmode="inputmode"
        class="input area"
        :class="[icon ? 'has-icon-l' : '', iconRight ? 'has-icon-r' : '']"
        @input="$emit('update:modelValue', ($event.target as HTMLTextAreaElement).value)"
      />
      <input
        v-else
        :type="type"
        :value="modelValue"
        :placeholder="placeholder"
        :autocomplete="autocomplete"
        :autofocus="autofocus"
        :inputmode="inputmode"
        class="input"
        :class="[icon ? 'has-icon-l' : '', iconRight ? 'has-icon-r' : '']"
        @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
        @keydown.enter="$emit('enter')"
      >
      <span v-if="iconRight" class="input-icon r">
        <SwIcon :name="iconRight" :size="18" />
      </span>
    </span>
  </label>
</template>
