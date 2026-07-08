<script setup lang="ts">
// Shell de Subwise.
// El responsive lo manejan media queries en layout.css — no `useMediaQuery`,
// para evitar mismatches SSR/cliente. Sidebar y tabbar ambos en el DOM;
// CSS decide cuál se ve.

const ruta = useRoute()
const router = useRouter()
const { usuario } = useDatos()

const NAV = [
  { id: 'inicio',    to: '/',              label: 'Inicio',        icon: 'home' as const },
  { id: 'subs',      to: '/suscripciones', label: 'Suscripciones', icon: 'list' as const },
  { id: 'resumen',   to: '/resumen',       label: 'Resumen',       icon: 'chart' as const },
  { id: 'historial', to: '/historial',     label: 'Historial',     icon: 'clock' as const },
]

function activo(navId: string): boolean {
  const path = ruta.path
  if (navId === 'inicio')    return path === '/'
  if (navId === 'subs')      return path.startsWith('/suscripciones')
  if (navId === 'resumen')   return path.startsWith('/resumen')
  if (navId === 'historial') return path.startsWith('/historial')
  return false
}
const ajustesActivo = computed(() => ruta.path.startsWith('/ajustes'))
const subsActivo    = computed(() => ruta.path.startsWith('/suscripciones'))
const inicioActivo  = computed(() => ruta.path === '/')
const resumenActivo = computed(() => ruta.path.startsWith('/resumen'))

function nuevaSuscripcion() {
  router.push('/suscripciones?mode=form')
}
</script>

<template>
  <div class="sw-root">
    <div class="app-shell">
      <!-- Sidebar (visible ≥900px por CSS) -->
      <aside class="sidebar">
        <div class="sidebar-brand">
          <SwBrandmark :size="21" />
        </div>

        <nav class="sidebar-nav">
          <NuxtLink
            v-for="n in NAV"
            :key="n.id"
            :to="n.to"
            :class="['nav-item', activo(n.id) ? 'on' : '']"
          >
            <SwIcon :name="n.icon" :size="20" />
            <span>{{ n.label }}</span>
            <span v-if="activo(n.id)" class="nav-mark" />
          </NuxtLink>
        </nav>

        <div class="sidebar-foot">
          <SwButton variant="primary" block @click="nuevaSuscripcion">
            <SwIcon name="plus" :size="18" />
            Añadir suscripción
          </SwButton>

          <NuxtLink to="/ajustes" :class="['user-chip', ajustesActivo ? 'on' : '']">
            <span class="user-av">
              <img v-if="usuario.photo" :src="usuario.photo" alt="" />
              <template v-else>{{ usuario.name.charAt(0) }}</template>
            </span>
            <div class="col grow" style="gap: 1px; align-items: flex-start; min-width: 0">
              <span style="font-weight: 600; font-size: .88rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 100%">{{ usuario.name }}</span>
              <span class="faint" style="font-size: .76rem">Ver ajustes</span>
            </div>
            <SwIcon name="settings" :size="17" style="color: var(--text3)" />
          </NuxtLink>
        </div>
      </aside>

      <!-- Main -->
      <main class="app-main">
        <slot />
      </main>

      <!-- Tabbar (visible <900px por CSS) -->
      <nav class="tabbar" aria-label="Navegación principal">
        <NuxtLink to="/" :class="['tab-btn', inicioActivo ? 'on' : '']">
          <SwIcon name="home" :size="22" /><span>Inicio</span>
        </NuxtLink>
        <NuxtLink to="/suscripciones" :class="['tab-btn', subsActivo ? 'on' : '']">
          <SwIcon name="list" :size="22" /><span>Servicios</span>
        </NuxtLink>
        <button type="button" class="fab" aria-label="Añadir" @click="nuevaSuscripcion">
          <SwIcon name="plus" :size="24" />
        </button>
        <NuxtLink to="/resumen" :class="['tab-btn', resumenActivo ? 'on' : '']">
          <SwIcon name="chart" :size="22" /><span>Resumen</span>
        </NuxtLink>
        <NuxtLink to="/ajustes" :class="['tab-btn', ajustesActivo ? 'on' : '']">
          <SwIcon name="settings" :size="22" /><span>Ajustes</span>
        </NuxtLink>
      </nav>
    </div>
  </div>
</template>
