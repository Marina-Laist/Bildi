import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Card, CardContent, CardHeader } from '../../components/ui/Card'
import { Badge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { Search, Mail, Plus, Building2, HardHat, ExternalLink, Filter } from 'lucide-react'

const clientes = [
  { id: 1, nombre: 'Desarrollos Norte SA', tipo: 'desarrollista', email: 'contacto@desnorte.com', cuit: '30-71234567-2', estado: 'activo', obras: 3, docs: 24, incorporado: '2024-02-10' },
  { id: 2, nombre: 'Constructora Sur SRL', tipo: 'constructora', email: 'admin@constsur.com', cuit: '30-65432187-9', estado: 'activo', obras: 1, docs: 18, incorporado: '2024-03-22' },
  { id: 3, nombre: 'Torres del Parque SA', tipo: 'desarrollista', email: 'info@torresparque.com', cuit: '30-70987654-1', estado: 'activo', obras: 2, docs: 31, incorporado: '2023-11-05' },
  { id: 4, nombre: 'Arq. Torres & Asoc.', tipo: 'constructora', email: 'arq.torres@estudio.com', cuit: '20-25436789-3', estado: 'activo', obras: 1, docs: 9, incorporado: '2025-01-14' },
  { id: 5, nombre: 'Grupo Inmobiliario GR', tipo: 'desarrollista', email: 'gestion@grupogr.com', cuit: '30-68765432-7', estado: 'activo', obras: 4, docs: 45, incorporado: '2023-09-01' },
  { id: 6, nombre: 'Obras y Proyectos SRL', tipo: 'constructora', email: 'contacto@obrasproy.com', cuit: '30-54321098-6', estado: 'inactivo', obras: 0, docs: 7, incorporado: '2022-06-18' },
]

export default function ClientesLista() {
  const [busqueda, setBusqueda] = useState('')
  const [filtroTipo, setFiltroTipo] = useState('todos')
  const [filtroEstado, setFiltroEstado] = useState('todos')
  const [inviteEmail, setInviteEmail] = useState('')
  const [inviteTipo, setInviteTipo] = useState('desarrollista')
  const [showInvite, setShowInvite] = useState(false)
  const [inviteSuccess, setInviteSuccess] = useState(false)

  const clientesFiltrados = clientes.filter(c => {
    const matchBusq = c.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      c.email.toLowerCase().includes(busqueda.toLowerCase()) ||
      c.cuit.includes(busqueda)
    const matchTipo = filtroTipo === 'todos' || c.tipo === filtroTipo
    const matchEstado = filtroEstado === 'todos' || c.estado === filtroEstado
    return matchBusq && matchTipo && matchEstado
  })

  function handleInvite(e) {
    e.preventDefault()
    setInviteSuccess(true)
    setTimeout(() => {
      setInviteSuccess(false)
      setShowInvite(false)
      setInviteEmail('')
    }, 2000)
  }

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Clientes</h1>
          <p className="text-slate-500 text-sm mt-1">{clientes.length} clientes registrados</p>
        </div>
        <Button onClick={() => setShowInvite(true)}>
          <Plus size={16} /> Invitar cliente
        </Button>
      </div>

      {/* Modal invitar */}
      {showInvite && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md">
            <CardHeader>
              <h3 className="font-semibold text-slate-800">Invitar cliente por email</h3>
            </CardHeader>
            <CardContent>
              {inviteSuccess ? (
                <div className="text-center py-6">
                  <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-3">
                    <Mail size={24} className="text-green-600" />
                  </div>
                  <p className="font-medium text-slate-800">¡Invitación enviada!</p>
                  <p className="text-sm text-slate-500 mt-1">El cliente recibirá un email para crear su cuenta.</p>
                </div>
              ) : (
                <form onSubmit={handleInvite} className="space-y-4">
                  <Input
                    label="Email del cliente"
                    type="email"
                    placeholder="cliente@empresa.com"
                    value={inviteEmail}
                    onChange={e => setInviteEmail(e.target.value)}
                    required
                  />
                  <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium text-slate-700">Tipo de cliente</label>
                    <select
                      value={inviteTipo}
                      onChange={e => setInviteTipo(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
                    >
                      <option value="desarrollista">Desarrollista</option>
                      <option value="constructora">Constructora</option>
                    </select>
                  </div>
                  <div className="flex gap-3 pt-2">
                    <Button type="button" variant="outline" className="flex-1" onClick={() => setShowInvite(false)}>
                      Cancelar
                    </Button>
                    <Button type="submit" className="flex-1">
                      <Mail size={14} /> Enviar invitación
                    </Button>
                  </div>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filtros */}
      <Card>
        <CardContent className="py-3">
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-48">
              <Search size={14} className="absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="Buscar por nombre, email o CUIT..."
                value={busqueda}
                onChange={e => setBusqueda(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter size={14} className="text-slate-400" />
              <select
                value={filtroTipo}
                onChange={e => setFiltroTipo(e.target.value)}
                className="text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-700"
              >
                <option value="todos">Todos los tipos</option>
                <option value="desarrollista">Desarrollistas</option>
                <option value="constructora">Constructoras</option>
              </select>
              <select
                value={filtroEstado}
                onChange={e => setFiltroEstado(e.target.value)}
                className="text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-700"
              >
                <option value="todos">Todos los estados</option>
                <option value="activo">Activos</option>
                <option value="inactivo">Inactivos</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabla */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Cliente</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">CUIT</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Tipo</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Obras</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Documentos</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Estado</th>
                <th className="text-right px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {clientesFiltrados.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-slate-400">
                    No se encontraron clientes con los filtros aplicados
                  </td>
                </tr>
              ) : (
                clientesFiltrados.map(c => (
                  <tr key={c.id} className="hover:bg-slate-50 transition-colors group">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-slate-800">{c.nombre}</p>
                        <p className="text-xs text-slate-400 mt-0.5">{c.email}</p>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-slate-600 font-mono text-xs">{c.cuit}</td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-1.5">
                        {c.tipo === 'desarrollista'
                          ? <Building2 size={13} className="text-purple-500" />
                          : <HardHat size={13} className="text-green-500" />
                        }
                        <Badge variant={c.tipo === 'desarrollista' ? 'purple' : 'green'}>
                          {c.tipo === 'desarrollista' ? 'Desarrollista' : 'Constructora'}
                        </Badge>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-center text-slate-600">{c.obras}</td>
                    <td className="px-4 py-4 text-center text-slate-600">{c.docs}</td>
                    <td className="px-4 py-4">
                      <Badge variant={c.estado === 'activo' ? 'green' : 'default'}>
                        {c.estado === 'activo' ? 'Activo' : 'Inactivo'}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link to={`/${c.tipo}/${c.id}`}>
                        <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                          <ExternalLink size={14} /> Ver ficha
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="px-6 py-3 border-t border-slate-100">
          <p className="text-xs text-slate-400">
            Mostrando {clientesFiltrados.length} de {clientes.length} clientes
          </p>
        </div>
      </Card>
    </div>
  )
}
