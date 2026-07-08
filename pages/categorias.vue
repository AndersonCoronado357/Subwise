<script setup lang="ts">
useHead({ title: 'Categorías · Subwise' })

const { suscripciones, categorias, añadirCategoria, quitarCategoria } = useDatos()

const nuevaCat = ref('')

function agregarCat() {
  const v = nuevaCat.value.trim()
  if (!v) return
  añadirCategoria(v)
  nuevaCat.value = ''
}
function quitarCat(id: string) {
  if (!quitarCategoria(id)) {
    alert('Esta categoría está en uso por una suscripción activa. Reasígnalas antes de quitarla.')
  }
}

const conteoPorCat = computed(() => {
  const m: Record<string, number> = {}
  suscripciones.value.forEach(s => {
    if (s.category) m[s.category] = (m[s.category] ?? 0) + 1
  })
  return m
})
</script>

<template>
  <div class="screen fill">
    <div class="page-head">
      <div class="col grow" style="gap: 2px; min-width: 0">
        <span class="faint" style="font-size: .82rem; font-weight: 600; letter-spacing: .04em; text-transform: uppercase">
          Configuración
        </span>
        <h1 class="sw-title page-title">Categorías</h1>
      </div>
    </div>

    <div class="fill-col">
      <div class="card manage-card">
        <div class="manage-head">
          <span class="panel-title">Tus categorías</span>
          <div class="method-add">
            <SwField
              v-model="nuevaCat"
              icon="tag"
              placeholder="Nueva categoría (Mascotas, Hogar…)"
              @enter="agregarCat"
            />
            <SwButton variant="ghost" :leaves="false" :disabled="!nuevaCat.trim()" @click="agregarCat">
              <SwIcon name="plus" :size="17" />Añadir
            </SwButton>
          </div>
        </div>

        <div class="method-list manage-list">
          <div v-for="c in categorias" :key="c.id" class="method-row">
            <span class="row" style="gap: 11px; min-width: 0">
              <SwIcon name="tag" :size="18" style="color: var(--text3)" />
              <span style="font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis">{{ c.label }}</span>
              <span v-if="conteoPorCat[c.id]" class="faint" style="font-size: .78rem">
                · {{ conteoPorCat[c.id] }} en uso
              </span>
            </span>
            <SwIconBtn
              name="trash"
              small
              :aria-label="`Quitar ${c.label}`"
              :disabled="!!conteoPorCat[c.id]"
              @click="quitarCat(c.id)"
            />
          </div>
          <span v-if="categorias.length === 0" class="faint" style="font-size: .88rem; padding: 8px 2px">
            Aún no tienes categorías. Crea la primera arriba.
          </span>
        </div>
      </div>
    </div>
  </div>
</template>
