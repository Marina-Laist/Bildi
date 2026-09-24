import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import {
  LayoutDashboard, Users, FileText, Bell, LogOut,
  Building2, HardHat, Briefcase, AlertTriangle, Wrench,
  ShieldCheck, UserPlus
} from 'lucide-react'

const NAV_BY_ROLE = {
  estudio: [
    { to: '/estudio', label: 'Panel General', icon: LayoutDashboard, exact: true },
    { to: '/estudio/clientes', label: 'Clientes', icon: Users, exact: true },
    { to: '/estudio/clientes/nuevo', label: 'Agregar cliente', icon: UserPlus, exact: true },
    { to: '/notificaciones', label: 'Notificaciones', icon: Bell, exact: false },
  ],
  desarrollista: [
    { to: '/desarrollista', label: 'Mi Emprendimiento', icon: Building2, exact: true, noTab: true },
    { to: '/documentos', label: 'Documentos', icon: FileText, exact: false },
    { to: '/desarrollista?tab=Vencimientos', label: 'Vencimientos', icon: AlertTriangle, exact: true, tabKey: 'Vencimientos' },
    { to: '/notificaciones', label: 'Notificaciones', icon: Bell, exact: false },
  ],
  constructora: [
    { to: '/constructora', label: 'Mi Obra', icon: HardHat, exact: true, noTab: true },
    { to: '/documentos', label: 'Documentos', icon: FileText, exact: false },
    { to: '/constructora?tab=Habilitaciones', label: 'Habilitaciones', icon: ShieldCheck, exact: true, tabKey: 'Habilitaciones' },
    { to: '/notificaciones', label: 'Notificaciones', icon: Bell, exact: false },
  ],
}

const ROLE_LABELS = {
  estudio: 'WNS',
  desarrollista: 'Desarrollista',
  constructora: 'Constructora',
}

const ROLE_ICONS = {
  estudio: Briefcase,
  desarrollista: Building2,
  constructora: HardHat,
}

function NavItem({ item }) {
  const { pathname, search } = useLocation()
  const { to, label, icon: Icon, exact, noTab, tabKey } = item

  const toPath = to.split('?')[0]
  const toSearch = to.includes('?') ? `?${to.split('?')[1]}` : ''

  let isActive
  if (tabKey) {
    isActive = pathname === toPath && search === toSearch
  } else if (noTab) {
    isActive = pathname === toPath && !search.startsWith('?tab=')
  } else if (exact) {
    isActive = pathname === toPath
  } else {
    isActive = pathname.startsWith(toPath)
  }

  return (
    <Link
      to={to}
      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
        isActive
          ? 'bg-blue-800 text-white font-medium'
          : 'text-blue-200 hover:bg-blue-900 hover:text-white'
      }`}
    >
      <Icon size={16} className="shrink-0" />
      {label}
    </Link>
  )
}

export function Sidebar() {
  const { profile, logout } = useAuth()
  const navigate = useNavigate()
  const role = profile?.rol || 'estudio'
  const nav = NAV_BY_ROLE[role] || NAV_BY_ROLE.estudio
  const RoleIcon = ROLE_ICONS[role] || Briefcase

  async function handleLogout() {
    await logout()
    navigate('/login')
  }

  return (
    <aside className="w-64 min-h-screen bg-blue-950 text-white flex flex-col shrink-0">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-blue-900">
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center shrink-0 font-bold text-white text-sm">
            CO
          </div>
          <div>
            <p className="text-sm font-bold text-white leading-tight">BILDI</p>
            <p className="text-[10px] text-blue-300 uppercase tracking-wider">Sistema Jurídico</p>
          </div>
        </div>

        {/* User info */}
        <div className="flex items-center gap-2.5 bg-blue-900/60 rounded-lg px-3 py-2.5">
          <div className="w-8 h-8 rounded-full bg-blue-700 flex items-center justify-center shrink-0">
            <RoleIcon size={15} />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold text-white truncate">{profile?.nombre || 'Usuario'}</p>
            <p className="text-[10px] text-blue-300 truncate">{ROLE_LABELS[role]}</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {nav.map(item => (
          <NavItem key={item.to} item={item} />
        ))}
      </nav>

      {/* Logout */}
      <div className="px-3 py-4 border-t border-blue-900">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm text-blue-200 hover:bg-blue-900 hover:text-white transition-colors"
        >
          <LogOut size={16} />
          Cerrar sesión
        </button>
      </div>
    </aside>
  )
}
