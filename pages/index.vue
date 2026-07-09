<script setup lang="ts">
import {
  TODAY, totals, upcoming, byCategory, formatMoney, monthlyIn,
  daysUntil, relativeDay, fmtDate, catLabel,
} from '~/composables/useDatos'

useHead({ title: 'Inicio · Subwise' })

const router = useRouter()
const { suscripciones, usuario, moneda } = useDatos()

const t = computed(() => totals(suscripciones.value, moneda.value))
const next = computed(() => upcoming(suscripciones.value, 5))
const trial = computed(() => suscripciones.value.find(s => s.status === 'prueba'))
const cats = computed(() => byCategory(suscripciones.value, moneda.value).slice(0, 4))

const hora = TODAY.getHours()
const saludo = hora < 12 ? 'Buenos días' : hora < 19 ? 'Buenas tardes' : 'Buenas noches'
const eyebrow = computed(() => `${saludo}, ${usuario.value.name.split(' ')[0]}`)

function verSub(id: string) { router.push(`/suscripciones?id=${id}`) }
function nuevaSub() { router.push('/suscripciones?mode=form') }
</script>

<template>
  <div class="screen dash-screen">
    <div class="page-head">
      <div class="col grow" style="gap: 2px; min-width: 0">
        <span class="faint" style="font-size: .82rem; font-weight: 600; letter-spacing: .04em; text-transform: uppercase; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 100%">
          {{ eyebrow }}
        </span>
        <h1 class="sw-title page-title">Tu mes</h1>
      </div>
    </div>

    <div :class="['dash-grid', trial ? 'has-trial' : '']">
      <!-- Hero total -->
      <div class="card hero-total">
        <div class="col" style="gap: 6px">
          <span class="muted" style="font-size: .9rem">Gastas al mes</span>
          <span class="sw-title num hero-num">{{ formatMoney(t.monthly, moneda) }}</span>
        </div>
        <hr class="hair" style="margin: 20px 0" />
        <div class="row" style="gap: 28px; flex-wrap: wrap">
          <div class="col" style="gap: 3px">
            <span class="faint" style="font-size: .8rem">Al año</span>
            <span class="num" style="font-weight: 600; font-size: 1.15rem">{{ formatMoney(t.yearly, moneda) }}</span>
          </div>
          <div class="vhair" style="height: 34px" />
          <div class="col" style="gap: 3px">
            <span class="faint" style="font-size: .8rem">Activas</span>
            <span class="num" style="font-weight: 600; font-size: 1.15rem">{{ t.count }}</span>
          </div>
          <div class="vhair" style="height: 34px" />
          <div class="col" style="gap: 3px">
            <span class="faint" style="font-size: .8rem">Cobro más cercano</span>
            <span class="num" style="font-weight: 600; font-size: 1.15rem">{{ next[0] ? relativeDay(next[0].nextCharge) : '—' }}</span>
          </div>
        </div>
      </div>

      <!-- Aviso de prueba -->
      <button v-if="trial" class="card trial-card" @click="verSub(trial.id)">
        <span class="trial-ic"><SwIcon name="clock" :size="20" /></span>
        <div class="col grow" style="gap: 3px; align-items: flex-start; text-align: left">
          <span style="font-weight: 600; line-height: 1.35">
            Tu prueba de {{ trial.name }} termina {{ relativeDay(trial.trialEnds ?? trial.nextCharge) }}
          </span>
          <span class="muted" style="font-size: .86rem; line-height: 1.35">
            Después se cobrará {{ formatMoney(trial.amount, trial.currency) }} al mes. Decide si seguir o cancelar.
          </span>
        </div>
        <SwIcon name="chevronRight" :size="18" style="color: var(--text3)" />
      </button>

      <!-- Próximos cobros -->
      <div class="card dash-panel">
        <div class="spread" style="margin-bottom: 6px">
          <span class="panel-title">Próximos cobros</span>
          <SwIcon name="bell" :size="18" style="color: var(--text3)" />
        </div>
        <div class="dash-panel-body">
          <template v-for="(s, i) in next" :key="s.id">
            <hr v-if="i > 0" class="hair" />
            <button class="up-row" @click="verSub(s.id)">
              <SwServiceLogo :sub="s" :size="38" />
              <div class="col grow" style="gap: 2px; align-items: flex-start">
                <span style="font-weight: 600; font-size: .92rem">{{ s.name }}</span>
                <span class="faint" style="font-size: .78rem">{{ fmtDate(s.nextCharge) }}</span>
              </div>
              <div class="col" style="gap: 3px; align-items: flex-end">
                <span class="num" style="font-weight: 600; font-size: .92rem">{{ formatMoney(s.amount, s.currency) }}</span>
                <span
                  v-if="daysUntil(s.nextCharge) <= 3"
                  :class="['badge', s.status === 'prueba' ? 'warn' : 'soon']"
                >
                  <SwIcon name="clock" :size="13" />{{ relativeDay(s.nextCharge) }}
                </span>
                <span v-else class="faint num" style="font-size: .76rem">{{ relativeDay(s.nextCharge) }}</span>
              </div>
            </button>
          </template>
        </div>
      </div>

      <!-- Por categoría -->
      <div class="card dash-panel">
        <div class="spread" style="margin-bottom: 14px">
          <span class="panel-title">A dónde se va</span>
          <span class="faint" style="font-size: .8rem">este mes</span>
        </div>
        <div class="dash-panel-body" style="gap: 14px">
          <div v-for="cat in cats" :key="cat.id" class="col" style="gap: 7px">
            <div class="spread">
              <span style="font-size: .88rem; font-weight: 500">{{ cat.label }}</span>
              <span class="num faint" style="font-size: .84rem">
                {{ formatMoney(cat.value, moneda) }}
                <span style="margin-left: 8px; color: var(--text3)">
                  {{ Math.round(t.monthly ? (cat.value / t.monthly) * 100 : 0) }}%
                </span>
              </span>
            </div>
            <SwProgressBar :pct="t.monthly ? (cat.value / t.monthly) * 100 : 0" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
