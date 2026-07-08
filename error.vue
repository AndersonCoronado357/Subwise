<script setup lang="ts">
const props = defineProps<{ error: { statusCode: number; message: string } }>()
function volver() { return clearError({ redirect: '/' }) }
</script>

<template>
  <div class="sw-root" data-theme="light">
    <main style="height: 100dvh; display: flex; align-items: center; justify-content: center; padding: 24px; background: var(--bg); color: var(--text)">
      <div style="max-width: 360px; text-align: center">
        <p class="faint" style="font-size: .82rem; font-weight: 600; letter-spacing: .04em; text-transform: uppercase">
          Error {{ props.error.statusCode }}
        </p>
        <h1 class="sw-title" style="font-weight: 600; font-size: clamp(1.8rem, 4vw, 2.4rem); letter-spacing: -.02em; margin: 8px 0 16px">
          Algo se desvió.
        </h1>
        <p class="muted" style="font-size: .95rem; line-height: 1.5">{{ props.error.message }}</p>
        <button class="btn btn-primary" style="margin-top: 24px" @click="volver">Volver al inicio</button>
      </div>
    </main>
  </div>
</template>
