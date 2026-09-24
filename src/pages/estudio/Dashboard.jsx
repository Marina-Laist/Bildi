import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { Card, CardContent, CardHeader } from '../../components/ui/Card'
import { Badge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { SemaforoBadge } from '../../components/ui/Semaforo'
import { diasHastaVencimiento, getSemaforoConfig } from '../../lib/utils'
import {
  Users, Building2, HardHat, FileText, AlertTriangle,
  Search, ArrowRight, Plus, Mail, X, CheckCircle2, ExternalLink,
  Calendar, TrendingUp, Upload
} from 'lucide-react'

// ── Mock data ──────────────────────────────────────────────────────────────────
const clientes = [
  { id: 1, nombre: 'Desarrollos Norte SA', tipo: 'desarrollista', estado: 'activo', obras: 3, docsTotal: 24, direccion: 'Av. Corrientes 1234' },
  { id: 2, nombre: 'Constructora Sur SRL', tipo: 'constructora', estado: 'activo', obras: 1, docsTotal: 18, direccion: 'Av. San Martín 567' },
  { id: 3, nombre: 'Torres del Parque SA', tipo: 'desarrollista', estado: 'activo', obras: 2, docsTotal: 31, direccion: 'Libertador 5800' },
  { id: 4, nombre: 'Arq. Torres & Asoc.', tipo: 'constructora', estado: 'activo', obras: 1, docsTotal: 9, direccion: 'Rivadavia 890' },
  { id: 5, nombre: 'Grupo Inmobiliario GR', tipo: 'desarrollista', estado: 'activo', obras: 4, docsTotal: 45, direccion: 'Santa Fe 3200' },
  { id: 6, nombre: 'Obras y Proyectos SRL', tipo: 'constructora', estado: 'inactivo', obras: 0, docsTotal: 7, direccion: 'Belgrano 421' },
]

const alertas = [
  { id: 1, tipo: 'ART', cliente: 'Constructora Sur SRL', tipoCliente: 'constructora', documento: 'ART Colectiva', vencimiento: '2026-05-10' },
  { id: 2, tipo: 'Habilitación', cliente: 'Desarrollos Norte SA', tipoCliente: 'desarrollista', documento: 'Habilitación Municipal', vencimiento: '2026-05-13' },
  { id: 3, tipo: 'Cargo societario', cliente: 'Torres del Parque SA', tipoCliente: 'desarrollista', documento: 'Presidente – vto. de mandato', vencimiento: '2026-05-20' },
  { id: 4, tipo: 'Habilitación', cliente: 'Arq. Torres & Asoc.', tipoCliente: 'constructora', documento: 'Registro Provincial', vencimiento: '2026-05-25' },
  { id: 5, tipo: 'Pago', cliente: 'Grupo Inmobiliario GR', tipoCliente: 'desarrollista', documento: 'ABL sin comprobante', vencimiento: '2026-05-30' },
  { id: 6, tipo: 'ART', cliente: 'Obras y Proyectos SRL', tipoCliente: 'constructora', documento: 'Seguro de vida colectivo', vencimiento: '2026-06-20' },
]

// ── Stat card ──────────────────────────────────────────────────────────────────
function StatCard({ label, value, icon: Icon, sub, colorBg, colorIcon }) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="flex items-start justify-between gap-4 py-5">
        <div>
          <p className="text-sm text-slate-500">{label}</p>
          <p className="text-3xl font-bold text-slate-800 mt-1">{value}</p>
          {sub && <p className="text-xs text-slate-400 mt-1">{sub}</p>}
        </div>
        <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${colorBg}`}>
          <Icon size={22} className={colorIcon} />
        </div>
      </CardContent>
    </Card>
  )
}

// ── Alert row with semaphore background ──────────────────────────────────────
function AlertRow({ alerta }) {
  const dias = diasHastaVencimiento(alerta.vencimiento)
  const { rowBg, borderColor, textColor } = getSemaforoConfig(dias)
  return (
    <div className={`flex items-center justify-between gap-3 p-3 rounded-lg border-l-4 ${rowBg} ${borderColor}`}>
      <div className="min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <Badge variant={alerta.tipoCliente === 'desarrollista' ? 'purple' : 'green'} className="shrink-0">
            {alerta.tipo}
          </Badge>
          <span className="text-sm font-medium text-slate-800 truncate">{alerta.cliente}</span>
        </div>
        <p className="text-xs text-slate-500 mt-0.5 truncate">{alerta.documento}</p>
        <p className="text-xs text-slate-400 mt-0.5">Vence: {alerta.vencimiento}</p>
      </div>
      <SemaforoBadge fecha={alerta.vencimiento} />
    </div>
  )
}

// ── Invite modal ──────────────────────────────────────────────────────────────
function InviteModal({ onClose }) {
  const [form, setForm] = useState({ nombre: '', tipo: 'desarrollista', email: '' })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    // En producción: llamar a una Edge Function que use supabase.auth.admin.inviteUserByEmail
    // ya que el service role key no debe exponerse en el frontend
    await new Promise(r => setTimeout(r, 1200))
    setSuccess(true)
    setLoading(false)
  }

  if (success) {
    return (
      <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
        <Card className="w-full max-w-md">
          <CardContent className="text-center py-10">
            <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 size={28} className="text-green-600" />
            </div>
            <p className="text-lg font-semibold text-slate-800">¡Invitación enviada!</p>
            <p className="text-sm text-slate-500 mt-2">
              <strong>{form.nombre}</strong> recibirá un email para crear su cuenta como <strong>{form.tipo}</strong>.
            </p>
            <Button className="mt-6" onClick={onClose}>Cerrar</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-slate-800">Invitar nuevo cliente</h3>
            <button onClick={onClose} className="p-1 rounded hover:bg-slate-100 transition-colors">
              <X size={16} className="text-slate-400" />
            </button>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Nombre / Razón social"
              placeholder="Ej: Desarrollos Norte SA"
              value={form.nombre}
              onChange={e => setForm(f => ({ ...f, nombre: e.target.value }))}
              required
            />
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-slate-700">Tipo de cliente</label>
              <select
                value={form.tipo}
                onChange={e => setForm(f => ({ ...f, tipo: e.target.value }))}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
              >
                <option value="desarrollista">Desarrollista</option>
                <option value="constructora">Constructora</option>
              </select>
            </div>
            <Input
              label="Email"
              type="email"
              placeholder="contacto@empresa.com"
              value={form.email}
              onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
              required
            />
            <div className="flex gap-3 pt-1">
              <Button type="button" variant="outline" className="flex-1" onClick={onClose}>Cancelar</Button>
              <Button type="submit" className="flex-1" disabled={loading}>
                <Mail size={14} />
                {loading ? 'Enviando...' : 'Enviar invitación'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

// ── Dashboard ─────────────────────────────────────────────────────────────────
export default function Dashboard() {
  const { profile } = useAuth()
  const [filtroTipo, setFiltroTipo] = useState('todos')
  const [busqueda, setBusqueda] = useState('')
  const [showInvite, setShowInvite] = useState(false)

  const alertasVisibles = alertas.filter(a => {
    const dias = diasHastaVencimiento(a.vencimiento)
    return dias !== null && dias <= 30
  })
  const alertasCriticas = alertasVisibles.filter(a => diasHastaVencimiento(a.vencimiento) < 10).length

  const clientesFiltrados = clientes.filter(c => {
    const matchTipo = filtroTipo === 'todos' || c.tipo === filtroTipo
    const matchBusq = c.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      c.direccion.toLowerCase().includes(busqueda.toLowerCase())
    return matchTipo && matchBusq
  })

  const stats = [
    { label: 'Clientes activos', value: clientes.filter(c => c.estado === 'activo').length, icon: Users, sub: `${clientes.length} en total`, colorBg: 'bg-blue-100', colorIcon: 'text-blue-600' },
    { label: 'Obras en curso', value: clientes.reduce((a, c) => a + c.obras, 0), icon: TrendingUp, sub: 'Entre todos los clientes', colorBg: 'bg-purple-100', colorIcon: 'text-purple-600' },
    { label: 'Docs últimos 7 días', value: 12, icon: Upload, sub: '+12 esta semana', colorBg: 'bg-green-100', colorIcon: 'text-green-600' },
    { label: 'Alertas pendientes', value: alertasVisibles.length, icon: AlertTriangle, sub: `${alertasCriticas} críticas`, colorBg: 'bg-red-100', colorIcon: 'text-red-500' },
  ]

  return (
    <div className="p-8 space-y-8">
      {showInvite && <InviteModal onClose={() => setShowInvite(false)} />}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            Buen día, {profile?.nombre?.split(' ')[0] || 'Abogado'}
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            {new Date().toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        </div>
        <Button onClick={() => setShowInvite(true)}>
          <Plus size={16} /> Nuevo cliente
        </Button>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map(s => <StatCard key={s.label} {...s} />)}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
        {/* Alertas */}
        <div className="xl:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertTriangle size={16} className="text-red-500" />
                  <h2 className="font-semibold text-slate-800">Alertas de vencimiento</h2>
                </div>
                {alertasCriticas > 0 && (
                  <Badge variant="red">{alertasCriticas} críticas</Badge>
                )}
              </div>
              <p className="text-xs text-slate-400 mt-1">Próximos 30 días</p>
            </CardHeader>
            <div className="px-4 pb-4 space-y-2">
              {alertasVisibles.length === 0 ? (
                <p className="text-sm text-slate-400 text-center py-8">Sin alertas próximas</p>
              ) : (
                alertasVisibles
                  .sort((a, b) => diasHastaVencimiento(a.vencimiento) - diasHastaVencimiento(b.vencimiento))
                  .map(a => <AlertRow key={a.id} alerta={a} />)
              )}
            </div>
          </Card>
        </div>

        {/* Clientes */}
        <div className="xl:col-span-3">
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <Users size={16} className="text-blue-600" />
                  <h2 className="font-semibold text-slate-800">Clientes</h2>
                </div>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search size={13} className="absolute left-2.5 top-2.5 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Nombre o dirección..."
                      value={busqueda}
                      onChange={e => setBusqueda(e.target.value)}
                      className="pl-8 pr-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-44"
                    />
                  </div>
                  <select
                    value={filtroTipo}
                    onChange={e => setFiltroTipo(e.target.value)}
                    className="text-xs border border-slate-200 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-700"
                  >
                    <option value="todos">Todos</option>
                    <option value="desarrollista">Desarrollistas</option>
                    <option value="constructora">Constructoras</option>
                  </select>
                </div>
              </div>
            </CardHeader>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100">
                    <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Cliente</th>
                    <th className="text-left px-3 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Tipo</th>
                    <th className="text-center px-3 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Obras</th>
                    <th className="text-center px-3 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Estado</th>
                    <th className="px-3 py-3" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {clientesFiltrados.map(c => (
                    <tr key={c.id} className="hover:bg-slate-50 group transition-colors">
                      <td className="px-5 py-3">
                        <p className="font-medium text-slate-800">{c.nombre}</p>
                        <p className="text-xs text-slate-400">{c.direccion}</p>
                      </td>
                      <td className="px-3 py-3">
                        <Badge variant={c.tipo === 'desarrollista' ? 'purple' : 'green'}>
                          {c.tipo === 'desarrollista' ? 'Desarrollista' : 'Constructora'}
                        </Badge>
                      </td>
                      <td className="px-3 py-3 text-center text-slate-600 font-medium">{c.obras}</td>
                      <td className="px-3 py-3 text-center">
                        <Badge variant={c.estado === 'activo' ? 'green' : 'default'}>
                          {c.estado === 'activo' ? 'Activo' : 'Inactivo'}
                        </Badge>
                      </td>
                      <td className="px-3 py-3 text-right">
                        <Link to={`/${c.tipo}/${c.id}`}>
                          <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity text-blue-700">
                            <ExternalLink size={13} /> Ver ficha
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="px-5 py-3 border-t border-slate-100 flex justify-between items-center">
              <p className="text-xs text-slate-400">{clientesFiltrados.length} clientes</p>
              <Link to="/estudio/clientes">
                <Button variant="ghost" size="sm" className="text-blue-700">
                  Ver todos <ArrowRight size={13} />
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
