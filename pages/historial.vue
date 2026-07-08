<script setup lang="ts">
import { monthlyIn, formatMoney, fmtDate } from '~/composables/useDatos'

useHead({ title: 'Historial · Subwise' })

const router = useRouter()
const { suscripciones, moneda, reactivar } = useDatos()

const canceled = computed(() =>
  suscripciones.value
    .filter(s => s.status === 'cancelada')
    .sort((a, b) => (b.canceled?.getTime() ?? 0) - (a.canceled?.getTime() ?? 0)),
)
const saved = computed(() =>
  canceled.value.reduce((sum, s) => sum + monthlyIn(s, moneda.value), 0),
)

function abrir(id: string) { router.push(`/suscripciones?id=${id}`) }
</script>

<template>
  <div class="screen fill">
    <div class="page-head">
      <div class="col grow" style="gap: 2px; min-width: 0">
        <span class="faint" style="font-size: .82rem; font-weight: 600; letter-spacing: .04em; text-transform: uppercase">
          Suscripciones canceladas
        </span>
        <h1 class="sw-title page-title">Historial</h1>
      </div>
    </div>

    <div class="fill-col">
      <div class="card saving-card">
        <div class="col" style="gap: 6px">
          <span class="muted" style="font-size: .9rem">Dejaste de pagar</span>
          <span class="sw-title num hero-num">
            {{ formatMoney(saved, moneda) }}
            <span style="font-size: .42em; color: var(--text2); font-weight: 500"> /mes</span>
          </span>
          <span class="faint" style="font-size: .86rem">
            {{ canceled.length }}
            {{ canceled.length === 1 ? 'suscripción cancelada' : 'suscripciones canceladas' }}
            · {{ formatMoney(saved * 12, moneda) }} al año
          </span>
        </div>
      </div>

      <div class="card list-fill" style="padding: 6px 18px">
        <template v-for="(s, i) in canceled" :key="s.id">
          <hr v-if="i > 0" class="hair" />
          <div class="hist-row">
            <SwServiceLogo :sub="s" :size="42" />
            <div class="col grow" style="gap: 3px; min-width: 0">
              <span style="font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis">{{ s.name }}</span>
              <span class="faint" style="font-size: .82rem">
                Cancelada el {{ fmtDate(s.canceled, { long: true }) }}
              </span>
            </div>
            <div class="row" style="gap: 14px; flex-shrink: 0">
              <span class="num faint" style="font-size: .9rem; text-decoration: line-through">
                {{ formatMoney(s.amount, s.currency) }}
              </span>
              <SwButton
                variant="ghost"
                :leaves="false"
                style="padding: 9px 15px; font-size: .85rem"
                @click="reactivar(s.id)"
              >
                Reactivar
              </SwButton>
            </div>
          </div>
        </template>

        <div v-if="canceled.length === 0" class="empty">
          <SwSprig :size="34" style="color: var(--text3)" />
          <span class="muted">No has cancelado nada todavía</span>
        </div>
      </div>
    </div>
  </div>
</template>
