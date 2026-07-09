/// <reference lib="webworker" />
import { precacheAndRoute, cleanupOutdatedCaches } from 'workbox-precaching'

declare let self: ServiceWorkerGlobalScope

// Assets versionados del build (nombres con hash → seguros de cachear). @vite-pwa
// inyecta la lista en __WB_MANIFEST durante el build.
precacheAndRoute(self.__WB_MANIFEST)
cleanupOutdatedCaches()

// autoUpdate: tomar control de inmediato para no servir versiones viejas.
self.addEventListener('install', () => {
  self.skipWaiting()
})
self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim())
})

// Notificación push (recordatorio de renovación enviado desde el servidor).
self.addEventListener('push', (event) => {
  let data: { title?: string; body?: string; tag?: string; url?: string } = {}
  try {
    data = event.data ? event.data.json() : {}
  } catch {
    data = {}
  }
  const title = data.title || 'Subwise'
  const body = data.body || 'Tienes una renovación próxima.'
  event.waitUntil(
    self.registration.showNotification(title, {
      body,
      tag: data.tag || 'subwise',
      requireInteraction: true,
      renotify: true,
      vibrate: [200, 100, 200],
      data: { url: data.url || '/' },
    } as NotificationOptions),
  )
})

// Al tocar la notificación: enfocar una pestaña abierta o abrir la app.
self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  const url = (event.notification.data && event.notification.data.url) || '/'
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientsArr) => {
      for (const client of clientsArr) {
        if ('focus' in client) {
          void client.focus()
          return
        }
      }
      return self.clients.openWindow(url).then(() => undefined)
    }),
  )
})
