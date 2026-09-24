import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Card, CardContent, CardHeader } from '../../components/ui/Card'
import { Badge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'
import { ProgressBar } from '../../components/ui/ProgressBar'
import { SemaforoBadge } from '../../components/ui/Semaforo'
import { EditableField } from '../../components/ui/EditableField'
import { diasHastaVencimiento, getSemaforoConfig } from '../../lib/utils'
import {
  HardHat, MapPin, Layers, Calendar, FileText, User, Users,
  Wrench, Pencil, Save, X, Download, Trash2, AlertTriangle,
  ShieldCheck, ClipboardList, UserCheck
} from 'lucide-react'

const TABS = ['Ficha', 'Personal', 'Obra', 'Habilitaciones', 'Documentos']

const INIT_FICHA = {
  direccionObra: 'Av. Libertador 5800, piso 3°, CABA',
  tipoObra: 'Obra de albañilería y terminaciones en edificio residencial',
  superficieM2: '3.240 m²',
  fechaInicio: '2024-03-01',
  plazoContractual: '32 meses (hasta noviembre 2026)',
  razonSocial: 'Constructora Sur SRL',
  cuit: '30-65432187-9',
  responsable: 'Ing. Roberto Sánchez',
  matricula: 'MAT-ARQ-2019-4567',
  email: 'admin@constsur.com',
  telefono: '+54 11 4888-3210',
}

const personal = {
  totalNomina: 12,
  categorias: [
    { categoria: 'Oficial', cantidad: 4 },
    { categoria: 'Medio oficial', cantidad: 5 },
    { categoria: 'Ayudante', cantidad: 3 },
  ],
  art: {
    aseguradora: 'Galeno ART',
    nroPoliza: 'POL-2025-88210',
    vencimiento: '2026-05-10',
  },
  ultimoRecibo: '2026-04-30',
  incidentes: [
    { id: 1, fecha: '2026-03-15', descripcion: 'Accidente leve – caída en andamio. Parte médico enviado.', estado: 'cerrado' },
    { id: 2, fecha: '2026-04-28', descripcion: 'Reclamo salarial trabajador. En proceso de conciliación.', estado: 'activo' },
  ],
}

const obra = {
  avanceFisico: 62,
  etapaActual: 'Revestimientos y pintura interior',
  nroCertificado: 'Certificado N° 8',
  fechaCertificado: '2026-04-30',
  proximaInspeccion: '2026-05-25',
}

const etapasObra = [
  { etapa: 'Fundaciones', avance: 100 },
  { etapa: 'Estructura', avance: 100 },
  { etapa: 'Albañilería', avance: 85 },
  { etapa: 'Inst. eléctricas', avance: 70 },
  { etapa: 'Inst. sanitarias', avance: 65 },
  { etapa: 'Revestimientos', avance: 40 },
  { etapa: 'Pintura', avance: 20 },
  { etapa: 'Terminaciones', avance: 0 },
]

const habilitaciones = [
  { id: 1, item: 'Permiso de obra', detalle: 'N° EXP-2024-00312-GCBA', estado: 'aprobado', vencimiento: '2027-03-01', },
  { id: 2, item: 'Expediente municipal', detalle: '312/2024 – DGOC GCBA', estado: 'en trámite', vencimiento: null },
  { id: 3, item: 'Inspecciones GCBA', detalle: 'Última inspección: 10/04/2026', estado: 'aprobado', vencimiento: '2026-07-10' },
  { id: 4, item: 'Plano aprobado', detalle: 'Visado DGFISC – revisión 3', estado: 'aprobado', vencimiento: null },
  { id: 5, item: 'Certificado final de obra', detalle: 'Pendiente de solicitud', estado: 'pendiente', vencimiento: null },
]

const documentos = [
  { id: 1, nombre: 'Contrato de locación de obra.pdf', categoria: 'Legal y Societario', fecha: '2024-04-01', size: '1.2 MB', subidoPor: 'Estudio' },
  { id: 2, nombre: 'Planos aprobados piso 3.pdf', categoria: 'Obra y Técnico', fecha: '2024-04-15', size: '8.7 MB', subidoPor: 'Cliente' },
  { id: 3, nombre: 'Liquidación mensual mayo.pdf', categoria: 'Económico y Pagos', fecha: '2026-05-01', size: '0.8 MB', subidoPor: 'Estudio' },
  { id: 4, nombre: 'Nómina personal activo.xlsx', categoria: 'Laboral y Contable', fecha: '2026-05-01', size: '0.4 MB', subidoPor: 'Cliente' },
  { id: 5, nombre: 'ART Póliza vigente.pdf', categoria: 'Laboral y Contable', fecha: '2025-05-01', size: '1.1 MB', subidoPor: 'Cliente' },
]

const estadoHabBadge = { aprobado: 'green', 'en trámite': 'yellow', pendiente: 'default', vencido: 'red' }
const catColors = {
  'Legal y Societario': 'blue', 'Obra y Técnico': 'green',
  'Económico y Pagos': 'purple', 'Laboral y Contable': 'yellow', 'Comunicaciones': 'default',
}

export default function ConstructoraFicha() {
  const [searchParams] = useSearchParams()
  const [tab, setTab] = useState(searchParams.get('tab') || 'Ficha')
  const [ficha, setFicha] = useState(INIT_FICHA)
  const [editando, setEditando] = useState(false)
  const [fichaTemp, setFichaTemp] = useState(INIT_FICHA)
  const [docsFiltro, setDocsFiltro] = useState('Todos')

  useEffect(() => {
    const t = searchParams.get('tab')
    if (t) setTab(t)
  }, [searchParams])

  function startEdit() { setFichaTemp({ ...ficha }); setEditando(true) }
  function cancelEdit() { setEditando(false) }
  function saveEdit() { setFicha({ ...fichaTemp }); setEditando(false) }
  function setField(key) { return v => setFichaTemp(f => ({ ...f, [key]: v })) }

  const artDias = diasHastaVencimiento(personal.art.vencimiento)
  const artCfg = getSemaforoConfig(artDias)
  const docsFiltradas = docsFiltro === 'Todos' ? documentos : documentos.filter(d => d.categoria === docsFiltro)

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-xl bg-green-100 flex items-center justify-center">
            <HardHat size={28} className="text-green-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">{ficha.razonSocial}</h1>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="green">Constructora</Badge>
              <Badge variant="green">Activa</Badge>
              <span className="text-xs text-slate-400">CUIT: {ficha.cuit}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 overflow-x-auto">
        {TABS.map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-5 py-2.5 text-sm font-medium whitespace-nowrap transition-colors border-b-2 -mb-px ${
              tab === t ? 'border-blue-600 text-blue-700' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* ── Tab: Ficha ──────────────────────────────────────────────────────── */}
      {tab === 'Ficha' && (
        <div className="space-y-4">
          <div className="flex justify-end">
            {editando ? (
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={cancelEdit}><X size={14} /> Cancelar</Button>
                <Button size="sm" onClick={saveEdit}><Save size={14} /> Guardar cambios</Button>
              </div>
            ) : (
              <Button variant="outline" size="sm" onClick={startEdit}><Pencil size={14} /> Editar ficha</Button>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <h3 className="font-semibold text-slate-700 flex items-center gap-2">
                  <HardHat size={16} className="text-green-500" /> Datos de la obra
                </h3>
              </CardHeader>
              <CardContent className="space-y-4">
                <EditableField label="Dirección de obra" value={editando ? fichaTemp.direccionObra : ficha.direccionObra} onChange={setField('direccionObra')} editing={editando} icon={MapPin} />
                <EditableField label="Tipo de obra" value={editando ? fichaTemp.tipoObra : ficha.tipoObra} onChange={setField('tipoObra')} editing={editando} icon={Layers} textarea />
                <EditableField label="Superficie (m²)" value={editando ? fichaTemp.superficieM2 : ficha.superficieM2} onChange={setField('superficieM2')} editing={editando} icon={Layers} />
                <EditableField label="Fecha de inicio" value={editando ? fichaTemp.fechaInicio : ficha.fechaInicio} onChange={setField('fechaInicio')} editing={editando} icon={Calendar} type="date" />
                <EditableField label="Plazo contractual" value={editando ? fichaTemp.plazoContractual : ficha.plazoContractual} onChange={setField('plazoContractual')} editing={editando} icon={Calendar} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <h3 className="font-semibold text-slate-700 flex items-center gap-2">
                  <Users size={16} className="text-blue-500" /> Datos de la empresa
                </h3>
              </CardHeader>
              <CardContent className="space-y-4">
                <EditableField label="Razón social" value={editando ? fichaTemp.razonSocial : ficha.razonSocial} onChange={setField('razonSocial')} editing={editando} icon={FileText} />
                <EditableField label="CUIT" value={editando ? fichaTemp.cuit : ficha.cuit} onChange={setField('cuit')} editing={editando} icon={FileText} />
                <EditableField label="Responsable técnico" value={editando ? fichaTemp.responsable : ficha.responsable} onChange={setField('responsable')} editing={editando} icon={User} />
                <EditableField label="Matrícula profesional" value={editando ? fichaTemp.matricula : ficha.matricula} onChange={setField('matricula')} editing={editando} icon={Wrench} />
                <EditableField label="Email" value={editando ? fichaTemp.email : ficha.email} onChange={setField('email')} editing={editando} icon={FileText} type="email" />
                <EditableField label="Teléfono" value={editando ? fichaTemp.telefono : ficha.telefono} onChange={setField('telefono')} editing={editando} icon={FileText} />
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* ── Tab: Personal ───────────────────────────────────────────────────── */}
      {tab === 'Personal' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card>
              <CardContent className="text-center py-5">
                <p className="text-3xl font-bold text-slate-800">{personal.totalNomina}</p>
                <p className="text-xs text-slate-500 mt-1">Total en nómina activa</p>
              </CardContent>
            </Card>
            {personal.categorias.map(c => (
              <Card key={c.categoria}>
                <CardContent className="text-center py-5">
                  <p className="text-2xl font-bold text-blue-700">{c.cantidad}</p>
                  <p className="text-xs text-slate-500 mt-1">{c.categoria}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* ART */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-slate-700 flex items-center gap-2">
                  <ShieldCheck size={16} className="text-blue-500" /> ART
                </h3>
                <SemaforoBadge fecha={personal.art.vencimiento} />
              </div>
            </CardHeader>
            <CardContent>
              <div className={`p-4 rounded-lg border-l-4 ${artCfg.rowBg} ${artCfg.borderColor}`}>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                  <div><p className="text-xs text-slate-400">Aseguradora</p><p className="font-medium text-slate-700">{personal.art.aseguradora}</p></div>
                  <div><p className="text-xs text-slate-400">N° de póliza</p><p className="font-medium text-slate-700">{personal.art.nroPoliza}</p></div>
                  <div>
                    <p className="text-xs text-slate-400">Vencimiento</p>
                    <p className={`font-medium ${artCfg.textColor}`}>{personal.art.vencimiento}</p>
                    {artDias !== null && artDias <= 30 && (
                      <p className="text-xs text-red-600 font-medium mt-0.5 flex items-center gap-1">
                        <AlertTriangle size={11} /> ¡Renovar pronto!
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Último recibo */}
          <Card>
            <CardContent className="flex items-center justify-between py-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center">
                  <UserCheck size={16} className="text-slate-500" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-700">Último recibo de sueldo</p>
                  <p className="text-xs text-slate-400">Fecha de liquidación</p>
                </div>
              </div>
              <p className="font-semibold text-slate-700">{personal.ultimoRecibo}</p>
            </CardContent>
          </Card>

          {/* Incidentes */}
          <Card>
            <CardHeader>
              <h3 className="font-semibold text-slate-700 flex items-center gap-2">
                <ClipboardList size={16} className="text-orange-500" /> Incidentes activos
              </h3>
            </CardHeader>
            <div className="divide-y divide-slate-100">
              {personal.incidentes.length === 0 ? (
                <p className="text-sm text-slate-400 text-center py-6">Sin incidentes registrados</p>
              ) : (
                personal.incidentes.map(inc => (
                  <div key={inc.id} className="px-6 py-3.5 flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm text-slate-700">{inc.descripcion}</p>
                      <p className="text-xs text-slate-400 mt-0.5">{inc.fecha}</p>
                    </div>
                    <Badge variant={inc.estado === 'activo' ? 'yellow' : 'green'} className="shrink-0">
                      {inc.estado === 'activo' ? 'En curso' : 'Cerrado'}
                    </Badge>
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>
      )}

      {/* ── Tab: Obra ───────────────────────────────────────────────────────── */}
      {tab === 'Obra' && (
        <div className="space-y-6">
          <Card>
            <CardContent className="py-6">
              <h3 className="font-semibold text-slate-700 mb-4">Avance físico de obra</h3>
              <ProgressBar value={obra.avanceFisico} size="xl" color="blue" label="Progreso general" />
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
                {[
                  { label: 'Etapa actual', value: obra.etapaActual },
                  { label: 'Último certificado', value: obra.nroCertificado },
                  { label: 'Fecha certificado', value: obra.fechaCertificado },
                  { label: 'Próxima inspección', value: obra.proximaInspeccion },
                ].map(({ label, value }) => (
                  <div key={label} className="bg-slate-50 rounded-lg p-3">
                    <p className="text-xs text-slate-400">{label}</p>
                    <p className="font-medium text-slate-700 text-sm mt-0.5">{value}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><h3 className="font-semibold text-slate-700">Avance por etapa</h3></CardHeader>
            <CardContent className="space-y-4">
              {etapasObra.map(({ etapa, avance }) => (
                <ProgressBar
                  key={etapa}
                  value={avance}
                  label={etapa}
                  color={avance === 100 ? 'green' : avance > 50 ? 'blue' : 'yellow'}
                  size="md"
                />
              ))}
            </CardContent>
          </Card>
        </div>
      )}

      {/* ── Tab: Habilitaciones ─────────────────────────────────────────────── */}
      {tab === 'Habilitaciones' && (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <ShieldCheck size={16} className="text-blue-600" />
              <h3 className="font-semibold text-slate-700">Estado de habilitaciones y permisos</h3>
            </div>
          </CardHeader>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Habilitación / Permiso</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Detalle</th>
                  <th className="text-center px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Estado</th>
                  <th className="text-center px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Vencimiento</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {habilitaciones.map(h => (
                  <tr key={h.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4 font-medium text-slate-800">{h.item}</td>
                    <td className="px-4 py-4 text-slate-500 text-xs">{h.detalle}</td>
                    <td className="px-4 py-4 text-center">
                      <Badge variant={estadoHabBadge[h.estado]}>{h.estado}</Badge>
                    </td>
                    <td className="px-4 py-4 text-center">
                      {h.vencimiento ? (
                        <SemaforoBadge fecha={h.vencimiento} />
                      ) : (
                        <span className="text-xs text-slate-300">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* ── Tab: Documentos ─────────────────────────────────────────────────── */}
      {tab === 'Documentos' && (
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {['Todos', 'Legal y Societario', 'Obra y Técnico', 'Económico y Pagos', 'Laboral y Contable', 'Comunicaciones'].map(cat => (
              <button
                key={cat}
                onClick={() => setDocsFiltro(cat)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                  docsFiltro === cat ? 'bg-blue-900 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-slate-700">Archivos ({docsFiltradas.length})</h3>
                <Button size="sm"><FileText size={14} /> Subir documento</Button>
              </div>
            </CardHeader>
            <div className="divide-y divide-slate-100">
              {docsFiltradas.map(d => (
                <div key={d.id} className="px-6 py-3.5 flex items-center justify-between gap-4 group hover:bg-slate-50">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                      <FileText size={16} className="text-blue-600" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-slate-700 truncate">{d.nombre}</p>
                      <p className="text-xs text-slate-400">{d.fecha} · {d.size} · {d.subidoPor}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Badge variant={catColors[d.categoria] || 'default'}>{d.categoria}</Badge>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button variant="ghost" size="sm"><Download size={13} /></Button>
                      <Button variant="ghost" size="sm" className="text-red-500 hover:bg-red-50"><Trash2 size={13} /></Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}
