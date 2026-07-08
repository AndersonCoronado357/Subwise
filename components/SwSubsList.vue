<script setup lang="ts">
import {
  CATEGORIES, activeSubs, totals, monthlyIn, catLabel,
  formatMoney, relativeDay,
} from '~/composables/useDatos'
import type { Suscripcion } from '~/types/suscripcion'

interface Props {
  subs: Suscripcion[]
  cur: string
  selected: string | null
  embedded?: boolean
}
const props = defineProps<Props>()
const emit = defineEmits<{ select: [id: string]; add: [] }>()

const q = ref('')
const cat = ref<string>('todas')
const sort = ref<'fecha' | 'monto' | 'nombre'>('fecha')

// Popover de categorías: trigger es un chip que abre dropdown con todas
// las opciones. Escala a cualquier cantidad (el popover scrollea adentro).
const catChipRef = ref<HTMLElement | null>(null)
const catOpen = ref(false)
const catSearch = ref('')

const t = computed(() => totals(props.subs, props.cur))
const catsUsadas = computed(() =>
  CATEGORIES.filter(c => activeSubs(props.subs).some(s => s.category === c.id))
)
const catsFiltradas = computed(() => {
  const q = catSearch.value.trim().toLowerCase()
  if (!q) return catsUsadas.value
  return catsUsadas.value.filter(c => c.label.toLowerCase().includes(q))
})

const lista = computed(() => {
  const query = q.value.toLowerCase()
  let l = activeSubs(props.subs).filter(s =>
    (cat.value === 'todas' || s.category === cat.value) &&
    s.name.toLowerCase().includes(query),
  )
  if (sort.value === 'fecha') {
    l.sort((a, b) => (a.nextCharge?.getTime() ?? 0) - (b.nextCharge?.getTime() ?? 0))
  } else if (sort.value === 'monto') {
    l.sort((a, b) => monthlyIn(b, props.cur) - monthlyIn(a, props.cur))
  } else {
    l.sort((a, b) => a.name.localeCompare(b.name, 'es'))
  }
  return l
})
</script>

<template>
  <div class="subs-master">
    <div v-if="!embedded" class="master-head">
      <h1 class="sw-title master-title">Suscripciones</h1>
      <SwIconBtn name="plus" aria-label="Añadir suscripción" @click="emit('add')" />
    </div>

    <div class="subs-controls">
      <SwField v-model="q" icon="search" placeholder="Buscar servicio" />

      <div class="row" style="gap: 8px; flex-wrap: wrap">
        <SwChip :on="cat === 'todas'" @click="cat = 'todas'">Todas</SwChip>
        <button
          ref="catChipRef"
          type="button"
          :class="['chip', cat !== 'todas' ? 'on' : '']"
          @click="catOpen = !catOpen"
        >
          {{ cat === 'todas' ? 'Categoría' : catLabel(cat) }}
          <SwIcon name="chevronDown" :size="13" style="margin-left: 2px" />
        </button>
      </div>
      <SwPopover :anchor="catChipRef" :open="catOpen" :width="260" @close="catOpen = false">
        <div v-if="catsUsadas.length > 8" style="padding: 4px 6px 8px">
          <SwField
            v-model="catSearch"
            icon="search"
            placeholder="Buscar categoría"
          />
        </div>
        <div
          :class="['opt', cat === 'todas' ? 'sel' : '']"
          @click="cat = 'todas'; catOpen = false; catSearch = ''"
        >
          <span>Todas las categorías</span>
          <SwIcon v-if="cat === 'todas'" name="check" :size="16" class="ck" />
        </div>
        <div
          v-for="c in catsFiltradas"
          :key="c.id"
          :class="['opt', cat === c.id ? 'sel' : '']"
          @click="cat = c.id; catOpen = false; catSearch = ''"
        >
          <span>{{ c.label }}</span>
          <SwIcon v-if="cat === c.id" name="check" :size="16" class="ck" />
        </div>
        <div
          v-if="catsFiltradas.length === 0"
          style="padding: 10px 12px; color: var(--text3); font-size: .88rem"
        >
          Sin resultados
        </div>
      </SwPopover>

      <div class="spread" style="padding-inline: 2px">
        <span class="faint" style="font-size: .82rem">
          {{ lista.length }} {{ lista.length === 1 ? 'servicio' : 'servicios' }} ·
          {{ formatMoney(t.monthly, cur) }}/mes
        </span>
        <SwSegmented
          v-model="sort"
          :options="[
            { value: 'fecha',  label: 'Fecha' },
            { value: 'monto',  label: 'Monto' },
            { value: 'nombre', label: 'A-Z' },
          ]"
        />
      </div>
    </div>

    <div class="subs-rows scroll-y">
      <button
        v-for="s in lista"
        :key="s.id"
        :class="['sub-row', selected === s.id ? 'active' : '']"
        @click="emit('select', s.id)"
      >
        <SwServiceLogo :sub="s" />
        <div class="col grow" style="gap: 3px; align-items: flex-start; text-align: left">
          <span class="row" style="gap: 8px">
            <span style="font-weight: 600; font-size: .98rem">{{ s.name }}</span>
            <span v-if="s.status === 'prueba'" class="badge warn" style="font-size: .68rem; padding: 2px 7px">Prueba</span>
          </span>
          <span class="faint" style="font-size: .82rem">{{ catLabel(s.category) }} · {{ s.cycle }}</span>
        </div>
        <div class="col" style="gap: 4px; align-items: flex-end">
          <span class="num" style="font-weight: 600; font-size: .98rem">{{ formatMoney(s.amount, s.currency) }}</span>
          <span class="faint num" style="font-size: .78rem">{{ relativeDay(s.nextCharge) }}</span>
        </div>
      </button>

      <div v-if="lista.length === 0" class="empty">
        <SwOwl :size="34" style="color: var(--text3)" />
        <span class="muted">Sin resultados</span>
      </div>
    </div>
  </div>
</template>
