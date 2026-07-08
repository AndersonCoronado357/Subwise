import { sendDueReminders, pushEnabled } from '../utils/push'

// Programador interno: revisa cada 30 min y una vez al día (después de las 8am
// hora Colombia) envía los recordatorios de renovación. Corre en el proceso Nitro.
export default defineNitroPlugin(() => {
  if (!pushEnabled()) return
  let lastRun = ''
  const tick = async () => {
    try {
      const co = new Date(Date.now() - 5 * 3600 * 1000) // hora Colombia (UTC-5)
      const today = co.toISOString().slice(0, 10)
      if (co.getUTCHours() >= 8 && lastRun !== today) {
        lastRun = today
        await sendDueReminders(today)
      }
    } catch {
      /* no interrumpir el servidor */
    }
  }
  setInterval(tick, 30 * 60 * 1000)
  void tick()
})
