<script setup lang="ts">
import type { Suscripcion } from '~/types/suscripcion'

useHead({ title: 'Suscripciones · Subwise' })

const route = useRoute()
const router = useRouter()
const wide = useMediaQuery('(min-width: 900px)')
const { suscripciones, moneda, methods, porId, actualizar, crear, cancelar, reactivar, borrar } = useDatos()

// Estado de la página, sincronizado con la URL para deep-linking.
const selId = ref<string | null>(
  (route.query.id as string) ?? suscripciones.value[0]?.id ?? null,
)
const paneMode = ref<'detail' | 'form'>(
  route.query.mode === 'form' ? 'form' : 'detail',
)
const mobileDetail = ref(!!(route.query.id || route.query.mode === 'form'))

// formSub: null cuando se crea una nueva, sub al editar
const formSub = ref<Suscripcion | null>(null)

watch(() => route.query, (q) => {
  if (q.id && typeof q.id === 'string') selId.value = q.id
  if (q.mode === 'form') {
    paneMode.value = 'form'
    formSub.value = q.id ? porId(String(q.id)) ?? null : null
    mobileDetail.value = true
  } else if (q.id) {
    paneMode.value = 'detail'
    mobileDetail.value = true
  }
}, { immediate: true })

const sel = computed(() => selId.value ? porId(selId.value) : null)

function syncUrl() {
  const q: Record<string, string> = {}
  if (selId.value) q.id = selId.value
  if (paneMode.value === 'form') q.mode = 'form'
  router.replace({ query: q })
}

function seleccionar(id: string) {
  selId.value = id
  paneMode.value = 'detail'
  if (!wide.value) mobileDetail.value = true
  syncUrl()
}
function nuevaSub() {
  formSub.value = null
  paneMode.value = 'form'
  if (!wide.value) mobileDetail.value = true
  syncUrl()
}
function editar() {
  formSub.value = sel.value ?? null
  paneMode.value = 'form'
  syncUrl()
}
function cerrarForm() {
  paneMode.value = 'detail'
  syncUrl()
}
function volverLista() {
  mobileDetail.value = false
  paneMode.value = 'detail'
  router.replace({ query: {} })
}

function onSave(data: Partial<Suscripcion>) {
  if (data.id) {
    actualizar(data.id, data)
  } else {
    const id = 's' + Date.now()
    crear({ ...(data as Suscripcion), id })
    selId.value = id
  }
  paneMode.value = 'detail'
  syncUrl()
}
function onCancel(id: string) {
  cancelar(id)
  if (!wide.value) mobileDetail.value = false
}
function onReactivate(id: string) { reactivar(id) }
function onRemove(id: string) {
  borrar(id)
  const next = suscripciones.value[0]
  selId.value = next?.id ?? null
  if (!wide.value) mobileDetail.value = false
  syncUrl()
}
</script>

<template>
  <!-- Desktop: split master/detail. Mobile: una vista a la vez. -->
  <div v-if="wide" class="subs-split">
    <div class="subs-pane-l">
      <SwSubsList
        :subs="suscripciones"
        :cur="moneda"
        :selected="selId"
        @select="seleccionar"
        @add="nuevaSub"
      />
    </div>
    <div class="subs-pane-r">
      <SwSubForm
        v-if="paneMode === 'form'"
        :sub="formSub"
        :cur="moneda"
        :methods="methods"
        @save="onSave"
        @close="cerrarForm"
      />
      <SwSubDetail
        v-else
        :sub="sel"
        :cur="moneda"
        @edit="editar"
        @cancel="onCancel"
        @reactivate="onReactivate"
        @remove="onRemove"
      />
    </div>
  </div>

  <div v-else>
    <SwSubsList
      v-if="!mobileDetail"
      :subs="suscripciones"
      :cur="moneda"
      :selected="selId"
      @select="seleccionar"
      @add="nuevaSub"
    />
    <SwSubForm
      v-else-if="paneMode === 'form'"
      :sub="formSub"
      :cur="moneda"
      :methods="methods"
      show-back
      @save="onSave"
      @close="cerrarForm"
      @back="volverLista"
    />
    <SwSubDetail
      v-else
      :sub="sel"
      :cur="moneda"
      show-back
      @edit="editar"
      @cancel="onCancel"
      @reactivate="onReactivate"
      @remove="onRemove"
      @back="volverLista"
    />
  </div>
</template>
