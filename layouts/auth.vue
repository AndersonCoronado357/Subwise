<script setup lang="ts">
// Shell de auth: pantalla completa con fondo botánico + marca arriba.
const { tema } = useTema()
</script>

<template>
  <div class="sw-root">
    <div class="login-bg" :data-theme="tema">
      <div class="login-leaves">
        <SwLeafField />
      </div>
      <div class="login-brand">
        <SwBrandmark :size="22" />
      </div>
      <slot />
    </div>
  </div>
</template>
