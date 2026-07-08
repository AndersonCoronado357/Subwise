<script setup lang="ts">
import { TODAY, addDays, CURRENCIES } from '~/composables/useDatos'
import type { Suscripcion } from '~/types/suscripcion'

interface Props {
  sub: Suscripcion | null
  cur: string
  methods: string[]
  showBack?: boolean
}
const props = defineProps<Props>()
const emit = defineEmits<{
  save: [data: Partial<Suscripcion>]
  close: []
  back: []
}>()

const { categorias: catsRef } = useDatos()

const TINTS = ['#C0392B', '#3FA45B', '#3A6EA5', '#C77B30', '#7A6CC0', '#3C8C7A', '#5A5A5A', '#B0413E', '#2E6B8C', '#D49A2A']

const editing = computed(() => !!props.sub)

const form = reactive<{
  id?: string
  name: string
  amount: string
  currency: string
  cycle: 'mensual' | 'anual'
  nextCharge: Date | null
  category: string
  method: string
  notes: string
  tint: string
  initials?: string
  status?: 'activa' | 'cancelada' | 'prueba'
  started?: Date
  history?: { date: Date; amount: number }[]
}>(props.sub ? {
  id: props.sub.id,
  name: props.sub.name,
  amount: String(props.sub.amount),
  currency: props.sub.currency,
  cycle: props.sub.cycle,
  nextCharge: props.sub.nextCharge ?? null,
  category: props.sub.category,
  method: props.sub.method,
  notes: props.sub.notes ?? '',
  tint: props.sub.tint,
  initials: props.sub.initials,
  status: props.sub.status,
  started: props.sub.started,
  history: props.sub.history,
} : {
  name: '',
  amount: '',
  currency: props.cur || 'COP',
  cycle: 'mensual',
  nextCharge: addDays(TODAY, 30),
  category: catsRef.value[0]?.id ?? '',
  method: props.methods[0] ?? '',
  notes: '',
  tint: TINTS[Math.floor(Math.random() * TINTS.length)] ?? '#888',
})

const valid = computed(() =>
  form.name.trim().length > 0 &&
  Number(form.amount) > 0 &&
  !!form.nextCharge,
)

function submit(e: Event) {
  e.preventDefault()
  if (!valid.value) return
  const initials = form.initials || form.name.trim().slice(0, 2).replace(/^\w/, c => c.toUpperCase())
  emit('save', {
    ...form,
    amount: Number(form.amount),
    initials,
    status: form.status ?? 'activa',
    started: form.started ?? TODAY,
    history: form.history ?? [],
  })
}

const monedaOpts = CURRENCIES.map(c => ({ value: c.code, label: `${c.label} (${c.code})` }))
const catOpts = computed(() => catsRef.value.map(c => ({ value: c.id, label: c.label })))
const cicloOpts = [
  { value: 'mensual', label: 'Mensual' },
  { value: 'anual',   label: 'Anual' },
]
const methodOpts = computed(() => props.methods.map(m => ({ value: m, label: m })))
</script>

<template>
  <div class="form-pane">
    <div class="form-head">
      <SwIconBtn
        v-if="showBack"
        name="chevronLeft"
        class="back-btn"
        aria-label="Volver"
        @click="emit('back')"
      />
      <div class="col grow" style="gap: 2px; min-width: 0">
        <span class="sw-title" style="font-weight: 600; font-size: 1.25rem; letter-spacing: -.01em">
          {{ editing ? 'Editar suscripción' : 'Nueva suscripción' }}
        </span>
        <span class="faint" style="font-size: .86rem">
          {{ editing ? sub?.name : 'Registra lo que pagas cada mes o año' }}
        </span>
      </div>
    </div>

    <form class="form-body" @submit="submit">
      <SwField
        v-model="form.name"
        label="Nombre del servicio"
        placeholder="Netflix, gimnasio, dominio…"
        autofocus
      />

      <div class="form-row-2">
        <SwField
          v-model="form.amount"
          label="Monto"
          type="number"
          inputmode="decimal"
          placeholder="0"
        />
        <SwSelect v-model="form.cycle" label="Ciclo" :options="cicloOpts" />
      </div>

      <SwSelect v-model="form.currency" label="Moneda" :options="monedaOpts" />

      <SwSelect v-model="form.category" label="Categoría" :options="catOpts" placeholder="Elegir categoría" />

      <SwDatePicker v-model="form.nextCharge" label="Próximo cobro" />

      <SwSelect
        v-model="form.method"
        label="Método de pago"
        :options="methodOpts"
        placeholder="Elegir método"
      />

      <SwField
        v-model="form.notes"
        label="Notas"
        as="textarea"
        placeholder="Opcional (qué incluye el plan, recordatorios…)"
        grow
      />

      <div class="form-actions-full">
        <SwButton type="button" variant="ghost" :leaves="false" @click="emit('close')">Cancelar</SwButton>
        <SwButton type="submit" variant="primary" :disabled="!valid">
          {{ editing ? 'Guardar cambios' : 'Añadir suscripción' }}
        </SwButton>
      </div>
    </form>
  </div>
</template>
