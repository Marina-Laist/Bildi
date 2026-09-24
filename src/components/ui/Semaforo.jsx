import { diasHastaVencimiento, getSemaforoConfig } from '../../lib/utils'

export function SemaforoBadge({ fecha }) {
  const dias = diasHastaVencimiento(fecha)
  const { badge, label, dot } = getSemaforoConfig(dias)

  const styles = {
    red: 'bg-red-100 text-red-700',
    yellow: 'bg-yellow-100 text-yellow-700',
    green: 'bg-green-100 text-green-700',
    default: 'bg-slate-100 text-slate-500',
  }
  const dots = {
    red: 'bg-red-500',
    yellow: 'bg-yellow-500',
    green: 'bg-green-500',
    default: 'bg-slate-400',
  }

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap ${styles[badge]}`}>
      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${dots[badge]}`} />
      {label}
    </span>
  )
}

export function SemaforoRow({ label, fecha, descripcion }) {
  const dias = diasHastaVencimiento(fecha)
  const { rowBg, borderColor } = getSemaforoConfig(dias)

  return (
    <div className={`flex items-center justify-between p-3 rounded-r-lg border-l-4 ${rowBg} ${borderColor}`}>
      <div className="min-w-0">
        <p className="text-sm font-medium text-slate-700">{label}</p>
        {descripcion && <p className="text-xs text-slate-500 mt-0.5">{descripcion}</p>}
        <p className="text-xs text-slate-400 mt-0.5">Vence: {fecha}</p>
      </div>
      <div className="shrink-0 ml-3">
        <SemaforoBadge fecha={fecha} />
      </div>
    </div>
  )
}
