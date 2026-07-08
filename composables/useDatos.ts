import type { Suscripcion, Categoria, MonedaInfo } from '~/types/suscripcion'

// "Hoy" real (la app ya usa datos de la BD).
export const TODAY = new Date()

const RATE_TO_COP: Record<string, number> = {
  COP: 1, USD: 4100, EUR: 4450, MXN: 235, ARS: 4.4,
}

export const CURRENCIES: MonedaInfo[] = [
  { code: 'COP', label: 'Peso colombiano', symbol: '$' },
  { code: 'USD', label: 'Dólar',           symbol: 'US$' },
  { code: 'EUR', label: 'Euro',            symbol: '€' },
  { code: 'MXN', label: 'Peso mexicano',   symbol: 'MX$' },
]

export function convert(amount: number, from: string, to: string): number {
  const cop = amount * (RATE_TO_COP[from] ?? 1)
  return cop / (RATE_TO_COP[to] ?? 1)
}

export function formatMoney(amount: number, code = 'COP'): string {
  try {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency', currency: code,
      minimumFractionDigits: 0, maximumFractionDigits: 0,
    }).format(amount)
  } catch {
    return '$' + Math.round(amount).toLocaleString('es-CO')
  }
}

// Fechas
export const MESES = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre']
export const MESES_COR = ['ene','feb','mar','abr','may','jun','jul','ago','sep','oct','nov','dic']
export const DIAS_MIN = ['lu','ma','mi','ju','vi','sá','do']

export function addDays(date: Date, n: number): Date {
  const d = new Date(date); d.setDate(d.getDate() + n); return d
}
function startOfDay(d: Date): Date { const x = new Date(d); x.setHours(0,0,0,0); return x }
export function daysBetween(a: Date, b: Date): number {
  return Math.round((startOfDay(b).getTime() - startOfDay(a).getTime()) / 86400000)
}
export function daysUntil(date: Date | null | undefined): number {
  if (!date) return 0
  return daysBetween(TODAY, date)
}
export function fmtDate(date: Date | null | undefined, opts?: { long?: boolean }): string {
  if (!date) return ''
  const d = new Date(date)
  return opts?.long
    ? `${d.getDate()} de ${MESES[d.getMonth()]} de ${d.getFullYear()}`
    : `${d.getDate()} ${MESES_COR[d.getMonth()]}`
}
export function relativeDay(date: Date | null | undefined): string {
  if (!date) return ''
  const n = daysUntil(date)
  if (n < 0)  return `hace ${Math.abs(n)} d`
  if (n === 0) return 'hoy'
  if (n === 1) return 'mañana'
  if (n <= 30) return `en ${n} días`
  return fmtDate(date)
}

// Fecha 'YYYY-MM-DD' <-> Date (mediodía, evita saltos de zona horaria).
function parseD(s: string | null | undefined): Date | null {
  return s ? new Date(s + 'T12:00:00') : null
}
function isoD(d: Date | null | undefined): string | null {
  if (!d) return null
  const x = new Date(d)
  return `${x.getFullYear()}-${String(x.getMonth() + 1).padStart(2, '0')}-${String(x.getDate()).padStart(2, '0')}`
}

const CATEGORIES_INIT: Categoria[] = [
  { id: 'entretenimiento', label: 'Entretenimiento' },
  { id: 'trabajo',         label: 'Trabajo' },
  { id: 'salud',           label: 'Salud' },
  { id: 'productividad',   label: 'Productividad' },
  { id: 'educacion',       label: 'Educación' },
  { id: 'compras',         label: 'Compras' },
]

// Estado (SPA: refs de módulo, por navegador). Se llena desde /api/data.
const _subs = ref<Suscripcion[]>([])
const _user = ref({ name: '', email: '', photo: null as string | null })
const _moneda = ref('COP')
const _notifyDays = ref(3)
const _emailAlerts = ref(true)
const _methods = ref<string[]>([])
const _categorias = ref<Categoria[]>([...CATEGORIES_INIT])
export const _loaded = ref(false)

// CATEGORIES apunta al array reactivo (se muta en sitio para que siga válido).
export const CATEGORIES = _categorias.value

export function catLabel(id: string): string {
  return _categorias.value.find(c => c.id === id)?.label ?? id
}

export function monthlyIn(sub: Suscripcion, displayCode: string): number {
  const amt = convert(sub.amount, sub.currency, displayCode)
  return sub.cycle === 'anual' ? amt / 12 : amt
}
export function yearlyIn(sub: Suscripcion, displayCode: string): number {
  const amt = convert(sub.amount, sub.currency, displayCode)
  return sub.cycle === 'anual' ? amt : amt * 12
}
export function activeSubs(list: Suscripcion[]): Suscripcion[] {
  return list.filter(s => s.status === 'activa' || s.status === 'prueba')
}
export function totals(list: Suscripcion[], displayCode: string) {
  const act = activeSubs(list)
  const monthly = act.reduce((sum, s) => sum + monthlyIn(s, displayCode), 0)
  return { monthly, yearly: monthly * 12, count: act.length }
}
export function byCategory(list: Suscripcion[], displayCode: string) {
  const map: Record<string, number> = {}
  activeSubs(list).forEach(s => {
    map[s.category] = (map[s.category] ?? 0) + monthlyIn(s, displayCode)
  })
  return Object.entries(map)
    .map(([id, value]) => ({ id, label: catLabel(id), value }))
    .sort((a, b) => b.value - a.value)
}
export function upcoming(list: Suscripcion[], limit?: number): Suscripcion[] {
  const u = list
    .filter(s => s.nextCharge && (s.status === 'activa' || s.status === 'prueba'))
    .sort((a, b) => (a.nextCharge!.getTime() - b.nextCharge!.getTime()))
  return limit ? u.slice(0, limit) : u
}

// Gasto real de los últimos 12 meses: en cada mes suma el costo mensual de las
// suscripciones que ya existían ese mes (según su fecha de alta) y que no estaban
// canceladas antes de ese mes. Sin datos inventados.
export function monthlySpend(list: Suscripcion[], displayCode: string): { m: string; v: number }[] {
  const out: { m: string; v: number }[] = []
  for (let i = 11; i >= 0; i--) {
    const first = new Date(TODAY.getFullYear(), TODAY.getMonth() - i, 1)
    const last = new Date(first.getFullYear(), first.getMonth() + 1, 0)
    let v = 0
    for (const s of list) {
      const started = s.started ? new Date(s.started) : null
      if (started && startOfDay(started) > last) continue // aún no existía
      if (s.status === 'cancelada' && s.canceled && startOfDay(new Date(s.canceled)) < first) continue
      v += monthlyIn(s, displayCode)
    }
    out.push({ m: MESES_COR[first.getMonth()]!, v })
  }
  return out
}

// ── Hidratación / serialización ──────────────────────────────────
function hydrateSub(a: any): Suscripcion {
  const nextCharge = parseD(a.nextCharge)
  return {
    id: a.id,
    name: a.name,
    initials: a.initials,
    tint: a.tint,
    category: a.category,
    amount: Number(a.amount),
    currency: a.currency,
    cycle: a.cycle,
    nextDays: nextCharge ? daysUntil(nextCharge) : null,
    nextCharge,
    method: a.method ?? '',
    status: a.status,
    trialDays: a.trialDays ?? undefined,
    trialEnds: parseD(a.trialEnds) ?? undefined,
    started: parseD(a.started) ?? new Date(),
    canceled: parseD(a.canceled) ?? undefined,
    notes: a.notes ?? undefined,
    history: Array.isArray(a.history)
      ? a.history.map((h: any) => ({ date: parseD(h.date) ?? new Date(), amount: Number(h.amount) }))
      : [],
  }
}
function serializeSub(s: Partial<Suscripcion>): any {
  const out: any = { ...s }
  if ('nextCharge' in s) out.nextCharge = isoD(s.nextCharge as any)
  if ('trialEnds' in s) out.trialEnds = isoD(s.trialEnds as any)
  if ('started' in s) out.started = isoD(s.started as any)
  if ('canceled' in s) out.canceled = isoD(s.canceled as any)
  if (Array.isArray(s.history)) out.history = s.history.map(h => ({ date: isoD(h.date), amount: h.amount }))
  delete out.nextDays
  return out
}

// Carga todo el estado del usuario desde el servidor.
export async function cargarDatos(): Promise<void> {
  try {
    const res: any = await $fetch('/api/data')
    _subs.value = (res.subs || []).map(hydrateSub)
    _categorias.value.splice(0, _categorias.value.length, ...(res.categorias || CATEGORIES_INIT))
    _methods.value = res.methods || []
    _user.value = { name: res.perfil?.name ?? '', email: res.perfil?.email ?? '', photo: res.perfil?.photo ?? null }
    _moneda.value = res.perfil?.moneda ?? 'COP'
    _notifyDays.value = res.perfil?.notifyDays ?? 3
    _emailAlerts.value = res.perfil?.emailAlerts ?? true
    _loaded.value = true
  } catch {
    /* sin sesión u error: deja el estado vacío */
  }
}

// Persistencia de perfil (la llama el plugin con watchers debounced).
export async function guardarPerfil(patch: Record<string, unknown>): Promise<void> {
  try {
    await $fetch('/api/profile', { method: 'PATCH', body: patch })
  } catch {
    /* noop */
  }
}

const bg = (p: Promise<unknown>) => { p.catch(() => {}) }

export function useDatos() {
  function porId(id: string) { return _subs.value.find(s => s.id === id) }

  function actualizar(id: string, patch: Partial<Suscripcion>) {
    const i = _subs.value.findIndex(s => s.id === id)
    if (i >= 0) {
      const merged = { ...(_subs.value[i] as Suscripcion), ...patch }
      if (patch.nextCharge !== undefined) merged.nextDays = merged.nextCharge ? daysUntil(merged.nextCharge) : null
      _subs.value[i] = merged
    }
    bg($fetch(`/api/subs/${id}`, { method: 'PATCH', body: serializeSub(patch) }))
  }
  function crear(s: Suscripcion) {
    if (s.nextCharge) s.nextDays = daysUntil(s.nextCharge)
    _subs.value.push(s)
    bg(
      $fetch<{ sub: any }>('/api/subs', { method: 'POST', body: serializeSub(s) }).then((r) => {
        const i = _subs.value.findIndex(x => x.id === s.id)
        if (i >= 0 && r?.sub) _subs.value[i] = hydrateSub(r.sub)
      })
    )
  }
  function cancelar(id: string) {
    actualizar(id, { status: 'cancelada', canceled: TODAY, nextCharge: null })
  }
  function reactivar(id: string) {
    actualizar(id, { status: 'activa', canceled: undefined, nextCharge: addDays(TODAY, 30) })
  }
  function borrar(id: string) {
    _subs.value = _subs.value.filter(s => s.id !== id)
    bg($fetch(`/api/subs/${id}`, { method: 'DELETE' }))
  }

  function añadirCategoria(label: string) {
    const id = label.trim().toLowerCase()
      .normalize('NFD').replace(/[̀-ͯ]/g, '')
      .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
    if (!id || _categorias.value.some(c => c.id === id)) return
    _categorias.value.push({ id: id as any, label: label.trim() })
    bg($fetch('/api/categories', { method: 'POST', body: { label: label.trim() } }))
  }
  function quitarCategoria(id: string): boolean {
    const usada = _subs.value.some(s => s.category === id)
    if (usada) return false
    const i = _categorias.value.findIndex(c => c.id === id)
    if (i >= 0) _categorias.value.splice(i, 1)
    bg($fetch(`/api/categories/${id}`, { method: 'DELETE' }))
    return true
  }
  function añadirMetodo(label: string) {
    const v = label.trim()
    if (v && !_methods.value.includes(v)) {
      _methods.value.push(v)
      bg($fetch('/api/methods', { method: 'POST', body: { label: v } }))
    }
  }
  function quitarMetodo(label: string) {
    _methods.value = _methods.value.filter(m => m !== label)
    bg($fetch('/api/methods', { method: 'DELETE', body: { label } }))
  }

  return {
    suscripciones: _subs,
    usuario: _user,
    moneda: _moneda,
    notifyDays: _notifyDays,
    emailAlerts: _emailAlerts,
    methods: _methods,
    categorias: _categorias,
    porId, actualizar, crear, cancelar, reactivar, borrar,
    añadirCategoria, quitarCategoria,
    añadirMetodo, quitarMetodo,
  }
}
