import { cargarDatos, guardarPerfil, useDatos, _loaded } from '~/composables/useDatos'

// Carga el estado del usuario al iniciar la app (SPA) y persiste los cambios
// de perfil (foto, moneda, avisos) con un pequeño debounce.
export default defineNuxtPlugin(async () => {
  await cargarDatos()

  const { usuario, moneda, notifyDays, emailAlerts } = useDatos()
  let t: ReturnType<typeof setTimeout> | null = null
  const persist = () => {
    if (!_loaded.value) return
    if (t) clearTimeout(t)
    t = setTimeout(() => {
      guardarPerfil({
        name: usuario.value.name,
        photo: usuario.value.photo,
        moneda: moneda.value,
        notifyDays: notifyDays.value,
        emailAlerts: emailAlerts.value,
      })
    }, 500)
  }
  watch(
    [() => usuario.value.name, () => usuario.value.photo, moneda, notifyDays, emailAlerts],
    persist
  )
})
