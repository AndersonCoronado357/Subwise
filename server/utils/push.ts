// Web Push (solo servidor / Nitro). Configura VAPID, guarda/borra suscripciones
// y envía. Incluye los recordatorios de renovación de suscripciones.
import webpush from 'web-push'
import type { RowDataPacket } from 'mysql2'
import { createHash, randomUUID } from 'node:crypto'
import { db } from './db'

let configured = false
function ensureConfigured(): boolean {
  if (configured) return true
  const pub = process.env.VAPID_PUBLIC
  const priv = process.env.VAPID_PRIVATE
  if (!pub || !priv) return false
  webpush.setVapidDetails(process.env.VAPID_SUBJECT || 'mailto:noreply@acmsy.com', pub, priv)
  configured = true
  return true
}

export function pushEnabled(): boolean {
  return !!(process.env.VAPID_PUBLIC && process.env.VAPID_PRIVATE)
}
export function vapidPublicKey(): string {
  return process.env.VAPID_PUBLIC || ''
}

const hashEndpoint = (e: string) => createHash('sha256').update(e).digest('hex')

export type SubInput = { endpoint: string; keys: { p256dh: string; auth: string } }

export async function saveSubscription(userId: number, sub: SubInput): Promise<void> {
  if (!sub?.endpoint || !sub?.keys?.p256dh || !sub?.keys?.auth) return
  await db().query(
    `INSERT INTO push_subscriptions (id, user_id, endpoint_hash, endpoint, p256dh, auth)
     VALUES (?, ?, ?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE user_id = VALUES(user_id), endpoint = VALUES(endpoint),
       p256dh = VALUES(p256dh), auth = VALUES(auth)`,
    [randomUUID(), userId, hashEndpoint(sub.endpoint), sub.endpoint, sub.keys.p256dh, sub.keys.auth]
  )
}

export async function deleteSubscription(endpoint: string): Promise<void> {
  await db().query('DELETE FROM push_subscriptions WHERE endpoint_hash = ?', [hashEndpoint(endpoint)])
}

type SubRow = { id: string; endpoint: string; p256dh: string; auth: string }

async function subsForUser(userId: number): Promise<SubRow[]> {
  const [rows] = await db().query<RowDataPacket[]>(
    'SELECT id, endpoint, p256dh, auth FROM push_subscriptions WHERE user_id = ?',
    [userId]
  )
  return rows as SubRow[]
}

async function sendTo(sub: SubRow, payload: string): Promise<boolean> {
  try {
    await webpush.sendNotification(
      { endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth } },
      payload
    )
    return true
  } catch (e) {
    const code = (e as { statusCode?: number })?.statusCode
    if (code === 404 || code === 410) {
      await db().query('DELETE FROM push_subscriptions WHERE id = ?', [sub.id])
    }
    return false
  }
}

export async function sendToUser(userId: number, title: string, body: string): Promise<number> {
  if (!ensureConfigured()) return 0
  const subs = await subsForUser(userId)
  const payload = JSON.stringify({ title, body })
  let ok = 0
  for (const s of subs) if (await sendTo(s, payload)) ok++
  return ok
}

const fmtCOP = (n: number, code = 'COP') => {
  try {
    return new Intl.NumberFormat('es-CO', { style: 'currency', currency: code, maximumFractionDigits: 0 }).format(n)
  } catch {
    return '$' + Math.round(n).toLocaleString('es-CO')
  }
}

function cuando(days: number): string {
  if (days <= 0) return 'hoy'
  if (days === 1) return 'mañana'
  return `en ${days} días`
}

// Avisa las renovaciones que caen dentro de la ventana notify_days del usuario
// y aún no se han avisado hoy. `today` en 'YYYY-MM-DD'.
export async function sendDueReminders(today: string): Promise<{ sent: number; subs: number }> {
  if (!ensureConfigured()) return { sent: 0, subs: 0 }
  const [rows] = await db().query<RowDataPacket[]>(
    `SELECT s.id, s.user_id, s.name, s.amount, s.currency, s.next_charge, u.notify_days
       FROM subscriptions s JOIN users u ON u.id = s.user_id
      WHERE s.status IN ('activa','prueba')
        AND s.next_charge IS NOT NULL
        AND s.next_charge >= ?
        AND DATEDIFF(s.next_charge, ?) <= u.notify_days
        AND (s.reminded_on IS NULL OR s.reminded_on < ?)`,
    [today, today, today]
  )
  const subs = rows as {
    id: string; user_id: number; name: string; amount: number; currency: string; next_charge: string; notify_days: number
  }[]
  let sent = 0
  for (const s of subs) {
    const days = Math.max(0, Math.round((new Date(s.next_charge + 'T12:00:00').getTime() - new Date(today + 'T12:00:00').getTime()) / 86400000))
    sent += await sendToUser(
      s.user_id,
      'Subwise · Renovación',
      `${s.name} se renueva ${cuando(days)} por ${fmtCOP(Number(s.amount), s.currency)}.`
    )
    await db().query('UPDATE subscriptions SET reminded_on = ? WHERE id = ?', [today, s.id])
  }
  return { sent, subs: subs.length }
}
