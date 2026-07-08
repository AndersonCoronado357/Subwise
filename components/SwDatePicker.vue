<script setup lang="ts">
import { TODAY, MESES, DIAS_MIN, fmtDate } from '~/composables/useDatos'

interface Props {
  modelValue: Date | null
  label?: string
}
const props = defineProps<Props>()
const emit = defineEmits<{ 'update:modelValue': [v: Date] }>()

const open = ref(false)
const triggerRef = ref<HTMLElement | null>(null)
const view = ref(props.modelValue ? new Date(props.modelValue) : new Date(TODAY))

watch(() => props.modelValue, (v) => { if (v) view.value = new Date(v) })

const y = computed(() => view.value.getFullYear())
const m = computed(() => view.value.getMonth())
const startDow = computed(() => (new Date(y.value, m.value, 1).getDay() + 6) % 7)
const daysInMonth = computed(() => new Date(y.value, m.value + 1, 0).getDate())
const cells = computed<(Date | null)[]>(() => {
  const arr: (Date | null)[] = []
  for (let i = 0; i < startDow.value; i++) arr.push(null)
  for (let d = 1; d <= daysInMonth.value; d++) arr.push(new Date(y.value, m.value, d))
  return arr
})

function sameDay(a: Date | null | undefined, b: Date | null | undefined) {
  return !!a && !!b && a.getFullYear() === b.getFullYear()
    && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()
}

function pick(d: Date) {
  emit('update:modelValue', d)
  open.value = false
}

function prevMonth() { view.value = new Date(y.value, m.value - 1, 1) }
function nextMonth() { view.value = new Date(y.value, m.value + 1, 1) }
</script>

<template>
  <label class="col" style="min-width: 0;">
    <span v-if="label" class="field-label">{{ label }}</span>
    <button
      type="button"
      ref="triggerRef"
      :class="['select-trigger', open ? 'open' : '']"
      @click="open = !open"
    >
      <span style="display: flex; align-items: center; gap: 10px;">
        <SwIcon name="calendar" :size="17" style="color: var(--text3)" />
        <span :class="modelValue ? '' : 'ph'">
          {{ modelValue ? fmtDate(modelValue, { long: true }) : 'Elegir fecha' }}
        </span>
      </span>
      <SwIcon name="chevronDown" :size="16" class="chev" />
    </button>
    <SwPopover :anchor="triggerRef" :open="open" :width="300" @close="open = false">
      <div class="cal">
        <div class="cal-head">
          <button type="button" class="cal-nav" @click="prevMonth"><SwIcon name="chevronLeft" :size="18" /></button>
          <span class="cal-title">{{ MESES[m] }} {{ y }}</span>
          <button type="button" class="cal-nav" @click="nextMonth"><SwIcon name="chevronRight" :size="18" /></button>
        </div>
        <div class="cal-grid">
          <div v-for="d in DIAS_MIN" :key="d" class="cal-dow">{{ d }}</div>
          <template v-for="(d, i) in cells" :key="i">
            <button
              v-if="d"
              type="button"
              :class="[
                'cal-day',
                sameDay(d, modelValue) ? 'sel' : '',
                sameDay(d, TODAY) ? 'today' : '',
              ]"
              @click="pick(d)"
            >{{ d.getDate() }}</button>
            <span v-else />
          </template>
        </div>
      </div>
    </SwPopover>
  </label>
</template>
