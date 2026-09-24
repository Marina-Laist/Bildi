import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { Card, CardContent, CardHeader } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { Search, Mail, Plus, Paperclip } from 'lucide-react'

export default function ClientesLista() {
  const [clientes, setClientes] = useState([])
  const [cargando, setCargando] = useState(true)
  const [errorCarga, setErrorCarga] = useState('')
  const [busqueda, setBusqueda] = useState('')
  const [inviteEmail, setInviteEmail] = useState('')
  const [inviteTipo, setInviteTipo] = useState('desarrollista')
  const [showInvite, setShowInvite] = useState(false)
  const [inviteSuccess, setInviteSuccess] = useState(false)

  // Trae los clientes guardados en Supabase, del más nuevo al más viejo
  useEffect(() => {
    async function cargarClientes() {
      const { data, error } = await supabase
        .from('clientes')
        .select('*')
        .order('created_at', { ascending: false })
      if (error) {
        setErrorCarga('No se pudieron cargar los clientes: ' + error.message)
      } else {
        setClientes(data)
      }
      setCargando(false)
    }
    cargarClientes()
  }, [])

  const texto = busqueda.toLowerCase()
  const clientesFiltrados = clientes.filter(c =>
    (c.nombre || '').toLowerCase().includes(texto) ||
    (c.contacto || '').toLowerCase().includes(texto)
  )

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
                placeholder="Buscar por nombre o contacto..."
                value={busqueda}
                onChange={e => setBusqueda(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
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
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Contacto</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Archivo</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Fecha de alta</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {cargando ? (
                <tr>
                  <td colSpan={4} className="text-center py-12 text-slate-400">Cargando clientes...</td>
                </tr>
              ) : errorCarga ? (
                <tr>
                  <td colSpan={4} className="text-center py-12 text-red-500">{errorCarga}</td>
                </tr>
              ) : clientesFiltrados.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center py-12 text-slate-400">
                    {clientes.length === 0 ? 'Todavía no cargaste ningún cliente' : 'No se encontraron clientes con esa búsqueda'}
                  </td>
                </tr>
              ) : (
                clientesFiltrados.map(c => (
                  <tr key={c.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-800">{c.nombre}</td>
                    <td className="px-4 py-4 text-slate-600">{c.contacto}</td>
                    <td className="px-4 py-4">
                      {c.archivo_url ? (
                        <a href={c.archivo_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-blue-600 hover:underline">
                          <Paperclip size={13} /> Ver archivo
                        </a>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      {new Date(c.created_at).toLocaleDateString('es-AR')}
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
