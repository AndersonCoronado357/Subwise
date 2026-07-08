<script setup lang="ts">
useHead({ title: 'Métodos de pago · Subwise' })

const { methods, añadirMetodo, quitarMetodo } = useDatos()

const nuevoMetodo = ref('')

function agregarMet() {
  const v = nuevoMetodo.value.trim()
  if (!v) return
  añadirMetodo(v)
  nuevoMetodo.value = ''
}
</script>

<template>
  <div class="screen fill">
    <div class="page-head">
      <div class="col grow" style="gap: 2px; min-width: 0">
        <span class="faint" style="font-size: .82rem; font-weight: 600; letter-spacing: .04em; text-transform: uppercase">
          Configuración
        </span>
        <h1 class="sw-title page-title">Métodos de pago</h1>
      </div>
    </div>

    <div class="fill-col">
      <div class="card manage-card">
        <div class="manage-head">
          <span class="panel-title">Tus métodos</span>
          <div class="method-add">
            <SwField
              v-model="nuevoMetodo"
              icon="card"
              placeholder="Nuevo método (Visa ··1234, Nequi…)"
              @enter="agregarMet"
            />
            <SwButton variant="ghost" :leaves="false" :disabled="!nuevoMetodo.trim()" @click="agregarMet">
              <SwIcon name="plus" :size="17" />Añadir
            </SwButton>
          </div>
        </div>

        <div class="method-list manage-list">
          <div v-for="m in methods" :key="m" class="method-row">
            <span class="row" style="gap: 11px; min-width: 0">
              <SwIcon name="card" :size="18" style="color: var(--text3)" />
              <span style="font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis">{{ m }}</span>
            </span>
            <SwIconBtn name="trash" small :aria-label="`Quitar ${m}`" @click="quitarMetodo(m)" />
          </div>
          <span v-if="methods.length === 0" class="faint" style="font-size: .88rem; padding: 8px 2px">
            Aún no tienes métodos de pago. Crea el primero arriba.
          </span>
        </div>
      </div>
    </div>
  </div>
</template>
