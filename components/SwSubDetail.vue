<script setup lang="ts">
import {
  catLabel, monthlyIn, yearlyIn, daysUntil, relativeDay, fmtDate, formatMoney,
} from '~/composables/useDatos'
import type { Suscripcion } from '~/types/suscripcion'

interface Props {
  sub: Suscripcion | null | undefined
  cur: string
  showBack?: boolean
}
const props = defineProps<Props>()
const emit = defineEmits<{
  edit: []
  cancel: [id: string]
  reactivate: [id: string]
  remove: [id: string]
  back: []
}>()

const monthly = computed(() => props.sub ? monthlyIn(props.sub, props.cur) : 0)
const yearly  = computed(() => props.sub ? yearlyIn (props.sub, props.cur) : 0)
const canceled = computed(() => props.sub?.status === 'cancelada')
const conversion = computed(() => props.sub && props.sub.currency !== props.cur)
</script>

<template>
  <div v-if="!sub" class="detail-empty">
    <SwOwl :size="40" style="color: var(--text3)" />
    <span class="muted">Elige una suscripción para ver el detalle</span>
  </div>

  <div v-else class="detail" :key="sub.id">
      <div class="detail-top">
        <SwIconBtn
          v-if="showBack"
          name="chevronLeft"
          class="back-btn"
          aria-label="Volver"
          @click="emit('back')"
        />
        <div class="row grow" style="gap: 14px; min-width: 0">
          <SwServiceLogo :sub="sub" :size="56" />
          <div class="col" style="gap: 4px; min-width: 0">
            <span class="sw-title" style="font-weight: 600; font-size: 1.3rem; letter-spacing: -.01em; white-space: nowrap; overflow: hidden; text-overflow: ellipsis">{{ sub.name }}</span>
            <span class="row" style="gap: 8px">
              <span class="badge"><SwIcon name="tag" :size="12" />{{ catLabel(sub.category) }}</span>
              <span v-if="canceled" class="badge">Cancelada</span>
              <span v-else-if="sub.status === 'prueba'" class="badge warn">En prueba</span>
              <span v-else class="badge accent">Activa</span>
            </span>
          </div>
        </div>
        <SwIconBtn v-if="!canceled" name="edit" aria-label="Editar" @click="emit('edit')" />
      </div>

      <div class="detail-body">
      <!-- Monto -->
      <div class="card detail-amount">
        <div class="col" style="gap: 5px">
          <span class="num sw-title" style="font-weight: 600; font-size: clamp(2rem, 5vw, 2.6rem); letter-spacing: -.02em">
            {{ formatMoney(sub.amount, sub.currency) }}
          </span>
          <span class="muted" style="font-size: .9rem">
            por {{ sub.cycle === 'anual' ? 'año' : 'mes' }}
            <span v-if="conversion" class="faint">
              · ≈ {{ formatMoney(monthly, cur) }}/mes en {{ cur }}
            </span>
          </span>
        </div>
        <div v-if="!canceled && sub.nextCharge" class="next-pill">
          <span class="faint" style="font-size: .78rem">Próximo cobro</span>
          <span style="font-weight: 600">{{ fmtDate(sub.nextCharge, { long: true }) }}</span>
          <span
            :class="['badge', daysUntil(sub.nextCharge) <= 3 ? 'soon' : '']"
            style="margin-top: 4px"
          >
            <SwIcon name="clock" :size="13" />{{ relativeDay(sub.nextCharge) }}
          </span>
        </div>
      </div>

      <!-- Info -->
      <div class="card" style="padding: 4px 18px">
        <SwInfoRow icon="repeat" label="Ciclo" :value="sub.cycle === 'anual' ? 'Anual' : 'Mensual'" />
        <SwInfoRow icon="card" label="Método de pago" :value="sub.method" />
        <SwInfoRow icon="chart" label="Equivale al mes" :value="formatMoney(monthly, cur)" />
        <SwInfoRow icon="trend" label="Equivale al año" :value="formatMoney(yearly, cur)" />
        <SwInfoRow
          icon="calendar"
          label="Suscrito desde"
          :value="fmtDate(sub.started, { long: true })"
          :last="!canceled"
        />
        <SwInfoRow
          v-if="canceled && sub.canceled"
          icon="x"
          label="Cancelada el"
          :value="fmtDate(sub.canceled, { long: true })"
          last
        />
      </div>

      <!-- Cambios de precio -->
      <div class="card dash-panel">
        <span class="panel-title" style="margin-bottom: 14px; display: block">Cambios de precio</span>
        <div v-if="sub.history && sub.history.length > 0" class="price-hist">
          <div v-for="(h, i) in sub.history" :key="i" class="price-step">
            <span class="faint" style="font-size: .82rem">{{ fmtDate(h.date, { long: true }) }}</span>
            <span class="num" style="font-weight: 600">{{ formatMoney(h.amount, sub.currency) }}</span>
          </div>
          <div class="price-step">
            <span style="font-size: .82rem; font-weight: 600">Ahora</span>
            <span class="num" style="font-weight: 600; color: var(--accent)">{{ formatMoney(sub.amount, sub.currency) }}</span>
          </div>
        </div>
        <div v-else class="row" style="gap: 11px; color: var(--text2)">
          <SwIcon name="trend" :size="18" style="color: var(--text3)" />
          <span style="font-size: .9rem">
            No le han subido el precio desde que te suscribiste. Sigue en {{ formatMoney(sub.amount, sub.currency) }}.
          </span>
        </div>
      </div>

      <!-- Notas (siempre presente para no mover el layout) -->
      <div class="card dash-panel">
        <span class="panel-title" style="margin-bottom: 8px; display: block">Notas</span>
        <p v-if="sub.notes" class="muted" style="margin: 0; font-size: .92rem; line-height: 1.55">{{ sub.notes }}</p>
        <p v-else class="faint" style="margin: 0; font-size: .9rem; line-height: 1.55">Sin notas.</p>
      </div>
    </div>

    <!-- Acciones (fijas abajo) -->
    <div class="detail-actions">
      <SwButton
        v-if="canceled"
        variant="ghost"
        :leaves="false"
        class="grow"
        @click="emit('reactivate', sub.id)"
      >
        <SwIcon name="repeat" :size="17" />Reactivar
      </SwButton>
      <SwButton
        v-else
        variant="ghost"
        :leaves="false"
        class="grow"
        @click="emit('cancel', sub.id)"
      >
        <SwIcon name="x" :size="17" />Cancelar
      </SwButton>
      <SwButton variant="danger" :leaves="false" @click="emit('remove', sub.id)">
        <SwIcon name="trash" :size="17" />Eliminar
      </SwButton>
    </div>
  </div>
</template>
