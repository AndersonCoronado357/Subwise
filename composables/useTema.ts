// Tema claro / oscuro. Persiste en localStorage. Aplica data-theme al <html>
// para que los popovers portales hereden las variables CSS.

type Tema = 'light' | 'dark'
const _tema = ref<Tema>('light')

export function useTema() {
  function aplicar(t: Tema) {
    _tema.value = t
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-theme', t)
      try { localStorage.setItem('subwise-tema', t) } catch {}
    }
  }
  function inicializar() {
    if (typeof document === 'undefined') return
    let t: Tema = 'light'
    try {
      const stored = localStorage.getItem('subwise-tema')
      if (stored === 'dark' || stored === 'light') t = stored
    } catch {}
    aplicar(t)
  }
  function toggle() { aplicar(_tema.value === 'dark' ? 'light' : 'dark') }
  return { tema: _tema, aplicar, inicializar, toggle }
}

// Hook media query reactivo. Inicializa en false (SSR-safe), arranca real
// onMounted para evitar mismatch de hidratación.
export function useMediaQuery(query: string) {
  const matches = ref(false)
  if (typeof window === 'undefined') return matches

  const mq = window.matchMedia(query)
  const handler = (e: MediaQueryListEvent) => { matches.value = e.matches }

  onMounted(() => {
    matches.value = mq.matches
    mq.addEventListener('change', handler)
  })
  onBeforeUnmount(() => mq.removeEventListener('change', handler))
  return matches
}
