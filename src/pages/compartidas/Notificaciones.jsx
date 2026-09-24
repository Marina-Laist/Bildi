import { useState } from 'react'
import { Card, CardContent } from '../../components/ui/Card'
import { Badge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'
import { useNotificaciones } from '../../context/NotificacionesContext'
import { tiempoRelativo } from '../../lib/utils'
import {
  Bell, BellOff, CheckCheck, FileText, User, AlertTriangle,
  CheckCircle2, Clock, Activity, MessageSquare
} from 'lucide-react'

const FILTROS = [
  { key: 'todos', label: 'Todos' },
  { key: 'documento', label: 'Documentos' },
  { key: 'vencimiento', label: 'Vencimientos' },
  { key: 'actividad', label: 'Actividad' },
]

const TIPO_CONFIG = {
  documento: {
    icon: FileText,
    bg: 'bg-blue-100 text-blue-600',
  },
  vencimiento: {
    icon: AlertTriangle,
    bg: 'bg-red-100 text-red-600',
  },
  usuario: {
    icon: User,
    bg: 'bg-purple-100 text-purple-600',
  },
  actividad: {
    icon: Activity,
    bg: 'bg-green-100 text-green-600',
  },
  mensaje: {
    icon: MessageSquare,
    bg: 'bg-yellow-100 text-yellow-600',
  },
  sistema: {
    icon: Bell,
    bg: 'bg-slate-100 text-slate-600',
  },
}

function NotifIcon({ tipo, urgencia }) {
  const cfg = TIPO_CONFIG[tipo] || TIPO_CONFIG.sistema
  const Icon = cfg.icon
  const bg = urgencia === 'alta' ? 'bg-red-100 text-red-600' : cfg.bg

  return (
    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${bg}`}>
      {urgencia === 'alta'
        ? <AlertTriangle size={18} />
        : <Icon size={18} />
      }
    </div>
  )
}

export default function Notificaciones() {
  const { notificaciones, unreadCount, marcarLeida, marcarTodasLeidas } = useNotificaciones()
  const [filtro, setFiltro] = useState('todos')

  const filtradas = notificaciones.filter(n => {
    if (filtro === 'todos') return true
    if (filtro === 'actividad') return ['actividad', 'usuario', 'sistema'].includes(n.tipo)
    return n.tipo === filtro
  })

  const contadores = {
    todos: notificaciones.filter(n => !n.leido).length,
    documento: notificaciones.filter(n => n.tipo === 'documento' && !n.leido).length,
    vencimiento: notificaciones.filter(n => n.tipo === 'vencimiento' && !n.leido).length,
    actividad: notificaciones.filter(n => ['actividad','usuario','sistema'].includes(n.tipo) && !n.leido).length,
  }

  return (
    <div className="p-8 space-y-6 max-w-3xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Notificaciones</h1>
          <p className="text-slate-500 text-sm mt-1">
            {unreadCount > 0 ? `${unreadCount} sin leer` : 'Todo al día'}
          </p>
        </div>
        {unreadCount > 0 && (
          <Button variant="outline" size="sm" onClick={marcarTodasLeidas}>
            <CheckCheck size={14} /> Marcar todo como leído
          </Button>
        )}
      </div>

      {/* Filtros */}
      <div className="flex flex-wrap gap-2">
        {FILTROS.map(({ key, label }) => {
          const count = contadores[key]
          return (
            <button
              key={key}
              onClick={() => setFiltro(key)}
              className={`flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                filtro === key
                  ? 'bg-blue-900 text-white'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {label}
              {count > 0 && (
                <span className={`inline-flex items-center justify-center min-w-[18px] h-[18px] rounded-full text-[10px] font-bold px-1 ${
                  filtro === key ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                }`}>
                  {count}
                </span>
              )}
            </button>
          )
        })}
      </div>

      {/* Feed */}
      <Card>
        {filtradas.length === 0 ? (
          <CardContent className="text-center py-16">
            <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
              <BellOff size={24} className="text-slate-400" />
            </div>
            <p className="text-slate-500 font-medium">Sin notificaciones</p>
            <p className="text-sm text-slate-400 mt-1">Estás al día con todo</p>
          </CardContent>
        ) : (
          <div className="divide-y divide-slate-100">
            {filtradas.map(n => (
              <div
                key={n.id}
                className={`flex items-start gap-4 px-6 py-4 transition-colors ${
                  !n.leido ? 'bg-blue-50/60 hover:bg-blue-50' : 'hover:bg-slate-50'
                }`}
              >
                {/* Indicador no leído */}
                <div className="flex items-center pt-1">
                  {!n.leido
                    ? <span className="w-2 h-2 rounded-full bg-blue-600 shrink-0" />
                    : <span className="w-2 h-2 rounded-full bg-transparent shrink-0" />
                  }
                </div>

                <NotifIcon tipo={n.tipo} urgencia={n.urgencia} />

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 flex-wrap">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className={`text-sm font-semibold ${!n.leido ? 'text-slate-900' : 'text-slate-700'}`}>
                          {n.titulo}
                        </p>
                        {n.urgencia === 'alta' && (
                          <Badge variant="red">Urgente</Badge>
                        )}
                      </div>
                      <p className="text-sm text-slate-500 mt-0.5">{n.mensaje}</p>
                      {n.cliente && (
                        <p className="text-xs text-slate-400 mt-0.5 font-medium">{n.cliente}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-4 mt-2">
                    <div className="flex items-center gap-1 text-xs text-slate-400">
                      <Clock size={11} />
                      {tiempoRelativo(n.fecha)}
                    </div>
                    {!n.leido && (
                      <button
                        onClick={() => marcarLeida(n.id)}
                        className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 font-medium transition-colors"
                      >
                        <CheckCircle2 size={11} />
                        Marcar como leído
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  )
}
