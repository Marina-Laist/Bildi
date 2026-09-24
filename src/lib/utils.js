import { differenceInDays, parseISO, isValid, formatDistanceToNow } from 'date-fns'
import { es } from 'date-fns/locale'

export function diasHastaVencimiento(fecha) {
  if (!fecha) return null
  try {
    const date = typeof fecha === 'string' ? parseISO(fecha) : fecha
    if (!isValid(date)) return null
    return differenceInDays(date, new Date())
  } catch {
    return null
  }
}

export function getSemaforoConfig(dias) {
  if (dias === null || dias === undefined) {
    return { color: 'gray', badge: 'default', label: 'Sin fecha', rowBg: 'bg-slate-50', borderColor: 'border-slate-300', dot: 'bg-slate-400', textColor: 'text-slate-500' }
  }
  if (dias < 0) {
    return { color: 'red', badge: 'red', label: `Vencido (${Math.abs(dias)}d)`, rowBg: 'bg-red-50', borderColor: 'border-red-400', dot: 'bg-red-500', textColor: 'text-red-700' }
  }
  if (dias === 0) {
    return { color: 'red', badge: 'red', label: 'Vence hoy', rowBg: 'bg-red-50', borderColor: 'border-red-400', dot: 'bg-red-500', textColor: 'text-red-700' }
  }
  if (dias < 10) {
    return { color: 'red', badge: 'red', label: `${dias}d restantes`, rowBg: 'bg-red-50', borderColor: 'border-red-400', dot: 'bg-red-500', textColor: 'text-red-700' }
  }
  if (dias <= 30) {
    return { color: 'yellow', badge: 'yellow', label: `${dias}d restantes`, rowBg: 'bg-yellow-50', borderColor: 'border-yellow-400', dot: 'bg-yellow-500', textColor: 'text-yellow-700' }
  }
  return { color: 'green', badge: 'green', label: `${dias}d restantes`, rowBg: 'bg-green-50', borderColor: 'border-green-300', dot: 'bg-green-500', textColor: 'text-green-700' }
}

export function semaforoFecha(fecha) {
  return getSemaforoConfig(diasHastaVencimiento(fecha))
}

export function tiempoRelativo(fecha) {
  if (!fecha) return ''
  try {
    const date = typeof fecha === 'string' ? parseISO(fecha) : fecha
    return formatDistanceToNow(date, { addSuffix: true, locale: es })
  } catch {
    return String(fecha)
  }
}
