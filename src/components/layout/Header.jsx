import { Link, useLocation } from 'react-router-dom'
import { Bell } from 'lucide-react'
import { useNotificaciones } from '../../context/NotificacionesContext'

const TITLES = {
  '/estudio': 'Panel General',
  '/estudio/clientes': 'Clientes',
  '/estudio/clientes/nuevo': 'Agregar cliente',
  '/desarrollista': 'Mi Emprendimiento',
  '/constructora': 'Mi Obra',
  '/documentos': 'Documentos',
  '/notificaciones': 'Notificaciones',
}

export function Header() {
  const { pathname, search } = useLocation()
  const { unreadCount } = useNotificaciones()

  let title = TITLES[pathname] || 'BILDI'
  if (pathname === '/desarrollista' && search.includes('tab=Vencimientos')) title = 'Vencimientos'
  if (pathname === '/constructora' && search.includes('tab=Habilitaciones')) title = 'Habilitaciones'

  return (
    <header className="h-16 border-b border-slate-200 bg-white flex items-center justify-between px-8 sticky top-0 z-20 shrink-0">
      <h2 className="text-lg font-semibold text-slate-800">{title}</h2>
      <Link
        to="/notificaciones"
        className="relative p-2 rounded-lg hover:bg-slate-100 transition-colors"
        title="Notificaciones"
      >
        <Bell size={20} className="text-slate-600" />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] rounded-full bg-red-500 text-white text-[10px] flex items-center justify-center font-bold px-1">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </Link>
    </header>
  )
}
