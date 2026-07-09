<script setup lang="ts">
import {
  totals, byCategory, activeSubs, monthlyIn,
  formatMoney, monthlySpend,
} from '~/composables/useDatos'

useHead({ title: 'Resumen · Subwise' })

const { suscripciones, moneda } = useDatos()

const t   = computed(() => totals(suscripciones.value, moneda.value))
const cats = computed(() => byCategory(suscripciones.value, moneda.value))
const act = computed(() => activeSubs(suscripciones.value))
const serie = computed(() => monthlySpend(suscripciones.value, moneda.value))
const priciest = computed(() =>
  [...act.value].sort((a, b) => monthlyIn(b, moneda.value) - monthlyIn(a, moneda.value))[0],
)
const avg = computed(() => act.value.length ? t.value.monthly / act.value.length : 0)
const max = computed(() => Math.max(...serie.value.map(d => d.v), 0))
const min = computed(() => Math.min(...serie.value.map(d => d.v)))
const mixed = computed(() => new Set(act.value.map(s => s.currency)).size > 1)

// En celular se muestra una sección a la vez (en PC ambas).
const vista = ref<'mensual' | 'categoria'>('mensual')
const vistaOpts = [
  { value: 'mensual', label: 'Mensual' },
  { value: 'categoria', label: 'Categorías' },
]

// Altura proporcional al máximo real; los meses en cero quedan casi planos.
function alturaBarra(v: number): string {
  if (!max.value) return '2%'
  return `${2 + (v / max.value) * 96}%`
}
</script>

<template>
  <div class="screen fill">
    <div class="page-head">
      <div class="col grow" style="gap: 2px; min-width: 0">
        <span class="faint" style="font-size: .82rem; font-weight: 600; letter-spacing: .04em; text-transform: uppercase">
          Últimos 12 meses
        </span>
        <h1 class="sw-title page-title">Resumen</h1>
      </div>
      <SwSegmented
        class="resume-toggle only-mobile"
        :model-value="vista"
        :options="vistaOpts"
        @update:model-value="v => vista = v as 'mensual' | 'categoria'"
      />
    </div>

    <div class="fill-col">
      <!-- hero anual -->
      <div class="card stat-hero">
        <div class="col" style="gap: 4px">
          <span class="muted" style="font-size: .9rem">Pagarás este año</span>
          <span class="sw-title num hero-num">{{ formatMoney(t.yearly, moneda) }}</span>
        </div>
        <div class="stat-meta">
          <div class="col" style="gap: 2px">
            <span class="faint" style="font-size: .78rem">Al mes</span>
            <span class="num" style="font-weight: 600">{{ formatMoney(t.monthly, moneda) }}</span>
          </div>
          <div class="col" style="gap: 2px">
            <span class="faint" style="font-size: .78rem">Promedio por servicio</span>
            <span class="num" style="font-weight: 600">{{ formatMoney(avg, moneda) }}/mes</span>
          </div>
          <div class="col" style="gap: 2px">
            <span class="faint" style="font-size: .78rem">Más caro</span>
            <span class="num" style="font-weight: 600">{{ priciest?.name ?? '—' }}</span>
          </div>
          <div class="col" style="gap: 2px">
            <span class="faint" style="font-size: .78rem">Activas</span>
            <span class="num" style="font-weight: 600">{{ t.count }}</span>
          </div>
        </div>
      </div>

      <div :class="['resume-cols', vista === 'categoria' ? 'ver-cat' : 'ver-mensual']">
        <!-- gráfico mensual -->
        <div class="card chart-card">
          <div class="spread" style="margin-bottom: 18px">
            <span class="panel-title">Gasto mensual</span>
            <span class="faint num" style="font-size: .8rem">
              {{ formatMoney(min, moneda) }} – {{ formatMoney(max, moneda) }}
            </span>
          </div>
          <div class="chart">
            <div
              v-for="(d, i) in serie"
              :key="i"
              class="chart-col"
              :title="formatMoney(d.v, moneda)"
            >
              <div
                class="chart-bar"
                :style="{
                  height: alturaBarra(d.v),
                  opacity: i === serie.length - 1 ? 1 : 0.55,
                }"
              />
              <span class="chart-x">{{ d.m }}</span>
            </div>
          </div>
        </div>

        <!-- por categoría -->
        <div class="card cat-card">
          <span class="panel-title" style="display: block; margin-bottom: 16px">Por categoría</span>
          <div class="col cat-list" style="gap: 15px">
            <div v-for="cat in cats" :key="cat.id" class="col" style="gap: 7px">
              <div class="spread">
                <span style="font-size: .9rem; font-weight: 500">{{ cat.label }}</span>
                <span class="num faint" style="font-size: .84rem">
                  {{ formatMoney(cat.value, moneda) }} ·
                  {{ Math.round(t.monthly ? (cat.value / t.monthly) * 100 : 0) }}%
                </span>
              </div>
              <SwProgressBar :pct="t.monthly ? (cat.value / t.monthly) * 100 : 0" />
            </div>
          </div>
          <p v-if="mixed" class="faint" style="font-size: .8rem; margin: 16px 0 0; line-height: 1.5">
            Incluye cobros en otras monedas, convertidos a {{ moneda }} con la tasa actual.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
