// Repo de datos de Subwise (Nitro): suscripciones, historial, categorías,
// métodos y perfil. Las fechas se devuelven como 'YYYY-MM-DD' (el cliente las
// hidrata a Date). Importes en enteros de la moneda original.
import type { RowDataPacket, ResultSetHeader } from 'mysql2'
import { randomBytes } from 'node:crypto'
import { db } from './db'

const sid = () => 's' + randomBytes(9).toString('hex')

export interface ApiSub {
  id: string
  name: string
  initials: string
  tint: string
  category: string
  amount: number
  currency: string
  cycle: 'mensual' | 'anual'
  nextCharge: string | null
  method: string | null
  status: 'activa' | 'cancelada' | 'prueba'
  trialDays: number | null
  trialEnds: string | null
  started: string | null
  canceled: string | null
  notes: string | null
  history: { date: string; amount: number }[]
}

function mapSub(r: any, history: { date: string; amount: number }[]): ApiSub {
  return {
    id: r.id,
    name: r.name,
    initials: r.initials,
    tint: r.tint,
    category: r.category,
    amount: Number(r.amount),
    currency: r.currency,
    cycle: r.cycle,
    nextCharge: r.next_charge,
    method: r.method,
    status: r.status,
    trialDays: r.trial_days,
    trialEnds: r.trial_ends,
    started: r.started,
    canceled: r.canceled,
    notes: r.notes,
    history,
  }
}

const COLS: Record<string, string> = {
  name: 'name', initials: 'initials', tint: 'tint', category: 'category',
  amount: 'amount', currency: 'currency', cycle: 'cycle', nextCharge: 'next_charge',
  method: 'method', status: 'status', trialDays: 'trial_days', trialEnds: 'trial_ends',
  started: 'started', canceled: 'canceled', notes: 'notes',
}

export async function getSubs(userId: number): Promise<ApiSub[]> {
  const [subs] = await db().query<RowDataPacket[]>(
    'SELECT * FROM subscriptions WHERE user_id = ? ORDER BY created_at',
    [userId]
  )
  const [hist] = await db().query<RowDataPacket[]>(
    'SELECT sh.sub_id, sh.occurred_on, sh.amount FROM sub_history sh JOIN subscriptions s ON s.id = sh.sub_id WHERE s.user_id = ? ORDER BY sh.occurred_on',
    [userId]
  )
  const byId: Record<string, { date: string; amount: number }[]> = {}
  for (const h of hist as any[]) (byId[h.sub_id] ||= []).push({ date: h.occurred_on, amount: Number(h.amount) })
  return (subs as any[]).map((s) => mapSub(s, byId[s.id] || []))
}

async function getSub(userId: number, id: string): Promise<ApiSub | null> {
  const [rows] = await db().query<RowDataPacket[]>(
    'SELECT * FROM subscriptions WHERE id = ? AND user_id = ? LIMIT 1',
    [id, userId]
  )
  if (!rows[0]) return null
  const [hist] = await db().query<RowDataPacket[]>(
    'SELECT occurred_on, amount FROM sub_history WHERE sub_id = ? ORDER BY occurred_on',
    [id]
  )
  return mapSub(rows[0], (hist as any[]).map((h) => ({ date: h.occurred_on, amount: Number(h.amount) })))
}

export async function createSub(userId: number, b: any): Promise<ApiSub> {
  // Usa el id que envía el cliente (para que su vista de detalle no quede
  // apuntando a un id distinto); si no viene o no es válido, genera uno.
  const id = (typeof b.id === 'string' && /^[a-z0-9]{1,32}$/i.test(b.id)) ? b.id : sid()
  await db().query(
    `INSERT INTO subscriptions (id, user_id, name, initials, tint, category, amount, currency, cycle,
       next_charge, method, status, trial_days, trial_ends, started, canceled, notes)
     VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
    [
      id, userId, b.name ?? '', b.initials ?? '', b.tint ?? '#3C8C5A', b.category ?? 'compras',
      Math.round(Number(b.amount) || 0), b.currency ?? 'COP', b.cycle === 'anual' ? 'anual' : 'mensual',
      b.nextCharge ?? null, b.method ?? null, b.status ?? 'activa', b.trialDays ?? null,
      b.trialEnds ?? null, b.started ?? null, b.canceled ?? null, b.notes ?? null,
    ]
  )
  for (const h of Array.isArray(b.history) ? b.history : []) {
    if (h?.date) await db().query('INSERT INTO sub_history (sub_id, occurred_on, amount) VALUES (?,?,?)', [id, h.date, Math.round(Number(h.amount) || 0)])
  }
  return (await getSub(userId, id))!
}

export async function updateSub(userId: number, id: string, patch: any): Promise<ApiSub | null> {
  const sets: string[] = []
  const vals: any[] = []
  for (const [k, col] of Object.entries(COLS)) {
    if (patch[k] !== undefined) {
      sets.push(`${col} = ?`)
      vals.push(k === 'amount' ? Math.round(Number(patch[k]) || 0) : patch[k])
    }
  }
  if (sets.length) {
    vals.push(id, userId)
    await db().query(`UPDATE subscriptions SET ${sets.join(', ')} WHERE id = ? AND user_id = ?`, vals)
  }
  return getSub(userId, id)
}

export async function deleteSub(userId: number, id: string): Promise<void> {
  await db().query('DELETE FROM subscriptions WHERE id = ? AND user_id = ?', [id, userId])
}

export async function getCategories(userId: number): Promise<{ id: string; label: string }[]> {
  const [rows] = await db().query<RowDataPacket[]>('SELECT id, label FROM categories WHERE user_id = ?', [userId])
  return rows as { id: string; label: string }[]
}
export async function addCategory(userId: number, id: string, label: string): Promise<void> {
  await db().query('INSERT IGNORE INTO categories (user_id, id, label) VALUES (?,?,?)', [userId, id, label])
}
export async function removeCategory(userId: number, id: string): Promise<boolean> {
  const [used] = await db().query<RowDataPacket[]>('SELECT id FROM subscriptions WHERE user_id = ? AND category = ? LIMIT 1', [userId, id])
  if (used.length) return false
  await db().query('DELETE FROM categories WHERE user_id = ? AND id = ?', [userId, id])
  return true
}

export async function getMethods(userId: number): Promise<string[]> {
  const [rows] = await db().query<RowDataPacket[]>('SELECT label FROM payment_methods WHERE user_id = ? ORDER BY id', [userId])
  return (rows as any[]).map((r) => r.label as string)
}
export async function addMethod(userId: number, label: string): Promise<void> {
  const v = String(label || '').trim()
  if (!v) return
  const [ex] = await db().query<RowDataPacket[]>('SELECT id FROM payment_methods WHERE user_id = ? AND label = ? LIMIT 1', [userId, v])
  if (!ex.length) await db().query('INSERT INTO payment_methods (user_id, label) VALUES (?,?)', [userId, v])
}
export async function removeMethod(userId: number, label: string): Promise<void> {
  await db().query('DELETE FROM payment_methods WHERE user_id = ? AND label = ?', [userId, label])
}

export async function updateProfile(userId: number, patch: any): Promise<void> {
  const map: Record<string, string> = { name: 'name', photo: 'photo', moneda: 'moneda', notifyDays: 'notify_days', emailAlerts: 'email_alerts' }
  const sets: string[] = []
  const vals: any[] = []
  for (const [k, col] of Object.entries(map)) {
    if (patch[k] !== undefined) {
      sets.push(`${col} = ?`)
      vals.push(k === 'emailAlerts' ? (patch[k] ? 1 : 0) : patch[k])
    }
  }
  if (!sets.length) return
  vals.push(userId)
  await db().query(`UPDATE users SET ${sets.join(', ')} WHERE id = ?`, vals)
}

// Datos demo iniciales para un usuario nuevo (para que la app no arranque vacía).
const DEMO: any[] = [
  { name: 'Netflix', initials: 'N', tint: '#C0392B', category: 'entretenimiento', amount: 44900, currency: 'COP', cycle: 'mensual', nextDays: 2, method: 'Visa ··4821', notes: 'Plan Estándar con anuncios.' },
  { name: 'Spotify', initials: 'S', tint: '#3FA45B', category: 'entretenimiento', amount: 16900, currency: 'COP', cycle: 'mensual', nextDays: 5, method: 'Visa ··4821', notes: 'Premium Individual.' },
  { name: 'Smart Fit', initials: 'SF', tint: '#D49A2A', category: 'salud', amount: 89900, currency: 'COP', cycle: 'mensual', nextDays: 6, method: 'PSE — Bancolombia', notes: 'Plan Black.' },
  { name: 'ChatGPT Plus', initials: 'GP', tint: '#3C8C7A', category: 'trabajo', amount: 20, currency: 'USD', cycle: 'mensual', nextDays: 9, method: 'Mastercard ··0067', notes: 'Cobro en dólares.' },
  { name: 'iCloud+', initials: 'iC', tint: '#5B8DCF', category: 'productividad', amount: 3900, currency: 'COP', cycle: 'mensual', nextDays: 12, method: 'Visa ··4821', notes: '200 GB.' },
  { name: 'YouTube Premium', initials: 'YT', tint: '#C0392B', category: 'entretenimiento', amount: 22900, currency: 'COP', cycle: 'mensual', nextDays: 14, method: 'Visa ··4821', notes: 'Sin anuncios + Music.' },
  { name: 'Adobe Creative Cloud', initials: 'Ai', tint: '#B0413E', category: 'trabajo', amount: 1080000, currency: 'COP', cycle: 'anual', nextDays: 47, method: 'Mastercard ··0067', notes: 'Todas las apps.' },
]

function isoFromToday(days: number): string {
  const d = new Date()
  d.setHours(12, 0, 0, 0)
  d.setDate(d.getDate() + days)
  return d.toISOString().slice(0, 10)
}

export async function seedDemoSubs(userId: number): Promise<void> {
  const [ex] = await db().query<RowDataPacket[]>('SELECT id FROM subscriptions WHERE user_id = ? LIMIT 1', [userId])
  if (ex.length) return
  for (const d of DEMO) {
    await createSub(userId, {
      ...d,
      nextCharge: d.nextDays != null ? isoFromToday(d.nextDays) : null,
      started: isoFromToday(-400),
    })
  }
}

export async function getAllData(userId: number, user: any) {
  const [subs, categorias, methods] = await Promise.all([
    getSubs(userId),
    getCategories(userId),
    getMethods(userId),
  ])
  return {
    subs,
    categorias,
    methods,
    perfil: {
      name: user.name,
      email: user.email,
      photo: user.photo,
      moneda: user.moneda,
      notifyDays: user.notify_days,
      emailAlerts: !!user.email_alerts,
    },
  }
}
