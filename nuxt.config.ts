// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-01-01',
  // Desactivado: @nuxt/devtools hace un import('vite') que rompe el build limpio
  // en Docker (npm install fresco); no aporta nada en producción.
  devtools: { enabled: false },

  // SPA: se renderiza solo en el cliente para el layout responsive por usuario sin parpadeo.
  ssr: false,

  devServer: {
    port: 3030,
  },

  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxtjs/google-fonts',
    // '@nuxtjs/supabase',  // desactivado por ahora
    '@vite-pwa/nuxt',
  ],

  app: {
    pageTransition: false,
    layoutTransition: false,
    head: {
      htmlAttrs: { lang: 'es' },
      title: 'Subwise',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1, viewport-fit=cover' },
        { name: 'description', content: 'Tus suscripciones, bajo control.' },
        { name: 'theme-color', content: '#FFFBEB' },
      ],
      link: [
        { rel: 'icon', type: 'image/png', href: '/owl.png' },
        { rel: 'apple-touch-icon', href: '/owl-192.png' },
        { rel: 'manifest', href: '/manifest.webmanifest' },
      ],
      script: [
        {
          // Fija el tema guardado antes del primer pintado para evitar el flash
          // (negro/claro) antes de que monte la app (ssr:false).
          innerHTML:
            "(function(){try{var t=localStorage.getItem('subwise-tema');document.documentElement.setAttribute('data-theme',t==='dark'?'dark':'light');}catch(e){document.documentElement.setAttribute('data-theme','light');}})()",
          tagPosition: 'head',
        },
      ],
    },
  },

  css: ['~/assets/css/main.css', '~/assets/css/layout.css'],

  googleFonts: {
    families: {
      'Space Grotesk': [400, 500, 600, 700],
      Inter: [400, 500, 600, 700],
    },
    display: 'swap',
    preconnect: true,
  },

  pwa: {
    registerType: 'autoUpdate',
    // SW propio para poder manejar los eventos push / notificationclick.
    strategies: 'injectManifest',
    srcDir: 'service-worker',
    filename: 'sw.ts',
    injectManifest: {
      globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
    },
    manifest: {
      name: 'Subwise',
      short_name: 'Subwise',
      description: 'Tus suscripciones, bajo control.',
      lang: 'es',
      theme_color: '#FFFBEB',
      background_color: '#FFFBEB',
      display: 'standalone',
      start_url: '/',
      icons: [
        { src: '/owl-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
        { src: '/owl-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
        { src: '/owl-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
      ],
    },
    // Permite registrar y probar el SW en `nuxt dev`.
    devOptions: { enabled: true, type: 'module', suppressWarnings: true },
  },

  typescript: {
    strict: true,
    typeCheck: false,
  },
})
