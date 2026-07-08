import type { Config } from 'tailwindcss'

export default <Partial<Config>>{
  content: [
    './components/**/*.{vue,js,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './app.vue',
    './error.vue',
  ],
  theme: {
    extend: {
      colors: {
        cream:   '#FFFBEB',
        surface: '#FFFFFF',
        gold: {
          DEFAULT: '#E6A700',
          dark:    '#A87A00',
          soft:    '#FDF3D1',
        },
        ink:  '#1E1A0E',
        mute: '#8C8470',
        // Acción destructiva confirmada (cancelar / borrar).
        // Tono terracota oscuro, no rojo brillante — alineado con la paleta cálida.
        danger: {
          DEFAULT: '#B23B1F',
          soft:    '#FBEAE5',
        },
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'system-ui', 'sans-serif'],
        sans:    ['Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        card: '1.25rem',
      },
      // Escala tipográfica fija (no fluida). Ratio ~1.2 entre pasos del UI.
      // El hero rompe la escala A PROPÓSITO — los números mandan (PRODUCT principle).
      fontSize: {
        // Hero del dashboard y monto en detalle. Confiado, no escandaloso.
        // Tracking en el piso del skill (-0.025em, sobre el floor de -0.04em).
        'mega':       ['3.75rem', { lineHeight: '0.95', letterSpacing: '-0.035em', fontWeight: '600' }],
        'display-xl': ['3rem',    { lineHeight: '1.0',  letterSpacing: '-0.03em',  fontWeight: '600' }],
        'display-l':  ['2.25rem', { lineHeight: '1.05', letterSpacing: '-0.025em', fontWeight: '600' }],
        'display-m':  ['1.5rem',  { lineHeight: '1.15', letterSpacing: '-0.02em',  fontWeight: '600' }],
      },
      animation: {
        // Confianza, no celebración. Durations en banda product (<300ms entry para UI;
        // hero permite hasta 450ms porque es el moment, una vez por ruta).
        'fade-up':  'fadeUp 0.55s cubic-bezier(0.23, 1, 0.32, 1) both',
        'rise':     'rise   0.45s cubic-bezier(0.23, 1, 0.32, 1) both',
        'hero-in':  'heroIn 0.65s cubic-bezier(0.23, 1, 0.32, 1) both',
        'fade-in':  'fadeIn 0.3s ease-out both',
        'pop-in':   'popIn  0.4s  cubic-bezier(0.34, 1.2, 0.64, 1) both',
        'breathe':  'breathe 8s ease-in-out infinite',
      },
      keyframes: {
        fadeUp: {
          '0%':   { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        rise: {
          '0%':   { opacity: '0', transform: 'translateY(6px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        heroIn: {
          // Entrada del hero: empieza casi visible (scale 0.96, blur leve)
          // — nunca desde scale 0. El blur enmascara el primer paint.
          '0%':   { opacity: '0', transform: 'scale(0.96) translateY(6px)', filter: 'blur(6px)' },
          '60%':  { opacity: '1', filter: 'blur(0)' },
          '100%': { opacity: '1', transform: 'scale(1) translateY(0)',     filter: 'blur(0)' },
        },
        fadeIn: { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        popIn:  {
          '0%':   { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        breathe: {
          '0%,100%': { transform: 'scale(1)',    opacity: '0.55' },
          '50%':     { transform: 'scale(1.05)', opacity: '0.75' },
        },
      },
      transitionTimingFunction: {
        // Curvas hechas, no built-in.
        // out-strong: ease-out fuerte (Emil) — el "punch" que hace que entry se sienta intencional.
        // drawer:     curva tipo iOS para elementos que vienen de un borde (sheets, indicador de nav).
        // in-snap:    salida rápida y decisiva (asimétrico: enter contemplativo, exit snappy).
        'out-strong': 'cubic-bezier(0.23, 1, 0.32, 1)',
        'drawer':     'cubic-bezier(0.32, 0.72, 0, 1)',
        'in-snap':    'cubic-bezier(0.4, 0, 1, 1)',
        'out-expo':   'cubic-bezier(0.16, 1, 0.3, 1)',
        'in-out-soft':'cubic-bezier(0.4, 0, 0.2, 1)',
      },
    },
  },
}
