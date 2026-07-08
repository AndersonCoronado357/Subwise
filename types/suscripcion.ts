// Modelo de dominio. Importes en unidades enteras de la moneda original
// (ej: COP 44900 = $44.900 COP). La conversión a la moneda de visualización
// la hacen los helpers en composables/useDatos.

export type Ciclo = 'mensual' | 'anual'
export type EstadoSuscripcion = 'activa' | 'cancelada' | 'prueba'
export type CategoriaId =
  | 'entretenimiento' | 'trabajo' | 'salud'
  | 'productividad' | 'educacion' | 'compras'

export interface PrecioHistorico {
  date: Date
  amount: number
}

export interface Suscripcion {
  id: string
  name: string
  initials: string
  tint: string
  category: CategoriaId
  amount: number
  currency: string
  cycle: Ciclo
  nextDays: number | null
  nextCharge?: Date | null
  method: string
  status: EstadoSuscripcion
  trialDays?: number
  trialEnds?: Date
  started: Date
  canceled?: Date
  notes?: string
  history: PrecioHistorico[]
}

export interface Categoria {
  id: CategoriaId
  label: string
}

export interface MonedaInfo {
  code: string
  label: string
  symbol: string
}

export interface Usuario {
  name: string
  email: string
  photo: string | null
}
