import { sendDueReminders } from '../../utils/push'

// Dispara los recordatorios de renovación. Protegido con CRON_SECRET. Lo llama
// el programador interno y sirve para pruebas manuales.
export default defineEventHandler(async (event) => {
  const secret = process.env.CRON_SECRET
  const q = getQuery(event)
  const given = getHeader(event, 'x-cron-secret') || (typeof q.secret === 'string' ? q.secret : '')
  if (!secret || given !== secret) throw createError({ statusCode: 401, statusMessage: 'No autorizado' })
  const today =
    (typeof q.today === 'string' && q.today) ||
    new Date(Date.now() - 5 * 3600 * 1000).toISOString().slice(0, 10)
  return sendDueReminders(today)
})
