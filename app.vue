<script setup lang="ts">
const { inicializar } = useTema()
if (typeof window !== 'undefined') inicializar()

onMounted(() => inicializar())
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
