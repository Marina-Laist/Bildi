import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Card, CardContent, CardHeader } from '../../components/ui/Card'
import { Badge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'
import { ProgressBar } from '../../components/ui/ProgressBar'
import { SemaforoRow, SemaforoBadge } from '../../components/ui/Semaforo'
import { EditableField } from '../../components/ui/EditableField'
import {
  Building2, MapPin, Home, Layers, DollarSign, FileText,
  User, Users, Calendar, Pencil, Save, X, Download, Trash2, AlertTriangle
} from 'lucide-react'

const TABS = ['Ficha', 'Ventas', 'Obra', 'Documentos', 'Vencimientos']

const INIT_FICHA = {
  direccion: 'Av. Libertador 5800, CABA',
  tipoEmprendimiento: 'Edificio de departamentos',
  cantUnidades: '18',
  superficieTotal: '3.240 m²',
  valuacion: 'USD 6.800.000',
  razonSocial: 'Desarrollos Norte SA',
  cuit: '30-71234567-2',
  socios: 'Martín García (60%) – Roberto López (40%)',
  cargosSocietarios: 'García: Presidente | López: Socio gerente',
  fechaVigenciaCargo: '2027-06-30',
  folioMatricula: 'Tomo 45, Folio 312, Reg. Nac.',
}

const ventas = [
  { id: 1, unidad: 'PB A', sup: '68 m²', precio: 'USD 122.000', estado: 'escriturada', comprador: 'Familia Rodríguez', boleto: '2024-11-01', escritura: '2025-03-15' },
  { id: 2, unidad: '1° A', sup: '78 m²', precio: 'USD 140.000', estado: 'escriturada', comprador: 'Sra. Martínez', boleto: '2024-12-10', escritura: '2025-04-22' },
  { id: 3, unidad: '1° B', sup: '92 m²', precio: 'USD 165.000', estado: 'en boleto', comprador: 'Dr. Fernández', boleto: '2025-02-18', escritura: '—' },
  { id: 4, unidad: '2° A', sup: '78 m²', precio: 'USD 140.000', estado: 'reservada', comprador: 'Srta. Gómez', boleto: '—', escritura: '—' },
  { id: 5, unidad: '2° B', sup: '92 m²', precio: 'USD 165.000', estado: 'cesión', comprador: 'SRL Inversiones Sur', boleto: '2025-01-05', escritura: '—' },
  { id: 6, unidad: 'PH', sup: '210 m²', precio: 'USD 390.000', estado: 'disponible', comprador: '—', boleto: '—', escritura: '—' },
]

const etapasObra = [
  { etapa: 'Fundaciones', avance: 100 },
  { etapa: 'Estructura', avance: 100 },
  { etapa: 'Albañilería', avance: 80 },
  { etapa: 'Inst. eléctricas', avance: 65 },
  { etapa: 'Inst. sanitarias', avance: 60 },
  { etapa: 'Revestimientos', avance: 30 },
  { etapa: 'Terminaciones', avance: 5 },
]

const obra = {
  etapaActual: 'Revestimientos y terminaciones',
  fechaInicio: '2024-03-01',
  entregaEstimada: '2026-12-15',
  ultimoCertificado: 'Certificado N°8 — Abril 2026',
  directorObra: 'Arq. Pablo Rossi',
  constructora: 'Constructora Sur SRL',
}

const documentos = [
  { id: 1, nombre: 'Escritura del terreno.pdf', categoria: 'Legal y Societario', fecha: '2024-01-20', size: '1.8 MB', subidoPor: 'Estudio' },
  { id: 2, nombre: 'Plano de obra aprobado.pdf', categoria: 'Obra y Técnico', fecha: '2024-03-15', size: '4.2 MB', subidoPor: 'Cliente' },
  { id: 3, nombre: 'Habilitación municipal.pdf', categoria: 'Legal y Societario', fecha: '2024-04-02', size: '0.9 MB', subidoPor: 'Estudio' },
  { id: 4, nombre: 'Cert. de avance Q1 2026.pdf', categoria: 'Económico y Pagos', fecha: '2026-04-10', size: '2.1 MB', subidoPor: 'Cliente' },
  { id: 5, nombre: 'Estatuto social.pdf', categoria: 'Legal y Societario', fecha: '2024-01-05', size: '3.4 MB', subidoPor: 'Estudio' },
]

const vencimientos = [
  { id: 1, doc: 'Habilitación municipal', fecha: '2026-05-13', descripcion: 'Renovación anual – Municipio CABA' },
  { id: 2, doc: 'Vigencia cargo Presidente', fecha: '2027-06-30', descripcion: 'García Martín – según estatuto' },
  { id: 3, doc: 'Seguro de obra', fecha: '2026-05-20', descripcion: 'Póliza N° 4421-B' },
  { id: 4, doc: 'Certificado AFIP', fecha: '2026-07-01', descripcion: 'Constancia de cumplimiento fiscal' },
  { id: 5, doc: 'Registro registral', fecha: '2026-06-15', descripcion: 'Folio 312 – Renovación quinquenal' },
]

const catColors = {
  'Legal y Societario': 'blue',
  'Obra y Técnico': 'green',
  'Económico y Pagos': 'purple',
  'Laboral y Contable': 'yellow',
  'Comunicaciones': 'default',
}

const estadoBadge = {
  disponible: 'default',
  reservada: 'yellow',
  'en boleto': 'blue',
  cesión: 'purple',
  escriturada: 'green',
}

export default function DesarrollistaFicha() {
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

  const avanceObra = Math.round(etapasObra.reduce((a, e) => a + e.avance, 0) / etapasObra.length)
  const vendidas = ventas.filter(v => v.estado === 'escriturada').length
  const enBoleto = ventas.filter(v => v.estado === 'en boleto').length
  const cesiones = ventas.filter(v => v.estado === 'cesión').length
  const avanceVentas = Math.round(((vendidas + enBoleto + cesiones) / ventas.length) * 100)

  const docsFiltradas = docsFiltro === 'Todos'
    ? documentos
    : documentos.filter(d => d.categoria === docsFiltro)

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-xl bg-purple-100 flex items-center justify-center">
            <Building2 size={28} className="text-purple-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">{ficha.razonSocial}</h1>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="purple">Desarrollista</Badge>
              <Badge variant="green">Activo</Badge>
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
            {/* Col 1: datos del emprendimiento */}
            <Card>
              <CardHeader>
                <h3 className="font-semibold text-slate-700 flex items-center gap-2">
                  <Building2 size={16} className="text-purple-500" /> Datos del emprendimiento
                </h3>
              </CardHeader>
              <CardContent className="space-y-4">
                <EditableField label="Dirección" value={editando ? fichaTemp.direccion : ficha.direccion} onChange={setField('direccion')} editing={editando} icon={MapPin} />
                <EditableField label="Tipo de emprendimiento" value={editando ? fichaTemp.tipoEmprendimiento : ficha.tipoEmprendimiento} onChange={setField('tipoEmprendimiento')} editing={editando} icon={Layers} />
                <EditableField label="Cantidad de unidades" value={editando ? fichaTemp.cantUnidades : ficha.cantUnidades} onChange={setField('cantUnidades')} editing={editando} icon={Home} />
                <EditableField label="Superficie total" value={editando ? fichaTemp.superficieTotal : ficha.superficieTotal} onChange={setField('superficieTotal')} editing={editando} icon={Layers} />
                <EditableField label="Valuación del proyecto" value={editando ? fichaTemp.valuacion : ficha.valuacion} onChange={setField('valuacion')} editing={editando} icon={DollarSign} />
              </CardContent>
            </Card>

            {/* Col 2: datos societarios */}
            <Card>
              <CardHeader>
                <h3 className="font-semibold text-slate-700 flex items-center gap-2">
                  <Users size={16} className="text-blue-500" /> Datos societarios
                </h3>
              </CardHeader>
              <CardContent className="space-y-4">
                <EditableField label="Razón social" value={editando ? fichaTemp.razonSocial : ficha.razonSocial} onChange={setField('razonSocial')} editing={editando} icon={FileText} />
                <EditableField label="CUIT" value={editando ? fichaTemp.cuit : ficha.cuit} onChange={setField('cuit')} editing={editando} icon={FileText} />
                <EditableField label="Socios y participaciones" value={editando ? fichaTemp.socios : ficha.socios} onChange={setField('socios')} editing={editando} icon={Users} textarea />
                <EditableField label="Cargos societarios" value={editando ? fichaTemp.cargosSocietarios : ficha.cargosSocietarios} onChange={setField('cargosSocietarios')} editing={editando} icon={User} textarea />
                <EditableField label="Fecha de vigencia del cargo" value={editando ? fichaTemp.fechaVigenciaCargo : ficha.fechaVigenciaCargo} onChange={setField('fechaVigenciaCargo')} editing={editando} icon={Calendar} type="date" />
                <EditableField label="Folio / Matrícula registral" value={editando ? fichaTemp.folioMatricula : ficha.folioMatricula} onChange={setField('folioMatricula')} editing={editando} icon={FileText} />
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* ── Tab: Ventas ─────────────────────────────────────────────────────── */}
      {tab === 'Ventas' && (
        <div className="space-y-6">
          {/* Gran barra de progreso */}
          <Card>
            <CardContent className="py-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-slate-700">Avance de ventas</h3>
                <div className="flex gap-3 text-sm">
                  <span className="text-slate-500">{ventas.length} unidades totales</span>
                </div>
              </div>
              <ProgressBar value={avanceVentas} size="xl" color="green" label="Comercialización general" />
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
                {[
                  { label: 'Disponibles', val: ventas.filter(v => v.estado === 'disponible').length, color: 'text-slate-600' },
                  { label: 'Reservadas', val: ventas.filter(v => v.estado === 'reservada').length, color: 'text-yellow-600' },
                  { label: 'En boleto', val: enBoleto, color: 'text-blue-600' },
                  { label: 'Escrituradas', val: vendidas, color: 'text-green-600' },
                ].map(({ label, val, color }) => (
                  <div key={label} className="text-center p-3 rounded-lg bg-slate-50">
                    <p className={`text-2xl font-bold ${color}`}>{val}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{label}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Tabla */}
          <Card>
            <CardHeader><h3 className="font-semibold text-slate-700">Detalle por unidad</h3></CardHeader>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100">
                    {['Unidad', 'Superficie', 'Precio', 'Comprador', 'Estado', 'Boleto', 'Escritura'].map(h => (
                      <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {ventas.map(v => (
                    <tr key={v.id} className="hover:bg-slate-50">
                      <td className="px-4 py-3 font-medium text-slate-800">{v.unidad}</td>
                      <td className="px-4 py-3 text-slate-600">{v.sup}</td>
                      <td className="px-4 py-3 text-slate-700 font-medium">{v.precio}</td>
                      <td className="px-4 py-3 text-slate-600">{v.comprador}</td>
                      <td className="px-4 py-3"><Badge variant={estadoBadge[v.estado]}>{v.estado}</Badge></td>
                      <td className="px-4 py-3 text-slate-500 text-xs">{v.boleto}</td>
                      <td className="px-4 py-3 text-slate-500 text-xs">{v.escritura}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {/* ── Tab: Obra ───────────────────────────────────────────────────────── */}
      {tab === 'Obra' && (
        <div className="space-y-6">
          {/* Gran barra */}
          <Card>
            <CardContent className="py-6">
              <h3 className="font-semibold text-slate-700 mb-4">Avance físico de obra</h3>
              <ProgressBar value={avanceObra} size="xl" color="blue" label="Progreso general" />
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 text-sm">
                {[
                  { label: 'Etapa actual', value: obra.etapaActual },
                  { label: 'Inicio de obra', value: obra.fechaInicio },
                  { label: 'Entrega estimada', value: obra.entregaEstimada },
                  { label: 'Último certificado', value: obra.ultimoCertificado },
                ].map(({ label, value }) => (
                  <div key={label} className="bg-slate-50 rounded-lg p-3">
                    <p className="text-xs text-slate-400">{label}</p>
                    <p className="font-medium text-slate-700 mt-0.5 text-sm">{value}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Avance por etapa */}
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

          {/* Info adicional */}
          <Card>
            <CardHeader><h3 className="font-semibold text-slate-700">Equipo de obra</h3></CardHeader>
            <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div><p className="text-xs text-slate-400">Director de obra</p><p className="font-medium text-slate-700">{obra.directorObra}</p></div>
              <div><p className="text-xs text-slate-400">Constructora</p><p className="font-medium text-slate-700">{obra.constructora}</p></div>
            </CardContent>
          </Card>
        </div>
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

      {/* ── Tab: Vencimientos ───────────────────────────────────────────────── */}
      {tab === 'Vencimientos' && (
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <AlertTriangle size={16} className="text-yellow-500" />
                <h3 className="font-semibold text-slate-700">Control de vencimientos</h3>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {vencimientos
                .sort((a, b) => new Date(a.fecha) - new Date(b.fecha))
                .map(v => (
                  <SemaforoRow key={v.id} label={v.doc} fecha={v.fecha} descripcion={v.descripcion} />
                ))
              }
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
